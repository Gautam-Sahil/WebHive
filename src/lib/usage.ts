import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 5;
const PRO_POINTS = 100;
const DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function getUsageStatus(userId?: string) {
  const { userId: authUserId, has } = await auth();
  const finalUserId = userId || authUserId;

  if (!finalUserId) {
    return null;
  }

  // 1. Determine Limit based on Plan
  const hasProAccess = has({ plan: "pro" });
  const limit = hasProAccess ? PRO_POINTS : FREE_POINTS;

  const now = new Date();

  // 2. Fetch User Record
  const usage = await prisma.usage.findUnique({
    where: { key: finalUserId },
  });

  // 3. If no record or expired, return full 'limit'
  if (!usage || (usage.expire && usage.expire < now)) {
    return {
      remainingPoints: limit,
      msBeforeNext: 0,
      consumedPoints: 0,
      isFirstInDuration: true,
    };
  }

  const msBeforeNext = usage.expire ? usage.expire.getTime() - now.getTime() : 0;

  return {
    remainingPoints: usage.points,
    msBeforeNext: Math.max(0, msBeforeNext),
    consumedPoints: limit - usage.points,
    isFirstInDuration: false,
  };
}

export async function consumeCredits(userId?: string) {
  const { userId: authUserId, has } = await auth();
  const finalUserId = userId || authUserId;

  if (!finalUserId) throw new Error("User not authenticated");

  // 1. Determine Limit based on Plan
  const hasProAccess = has({ plan: "pro" });
  const limit = hasProAccess ? PRO_POINTS : FREE_POINTS;

  const cost = 1;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + DURATION_MS);

  return await prisma.$transaction(async (tx) => {
    let usage = await tx.usage.findUnique({
      where: { key: finalUserId },
    });

    // Case 1: New user OR Expired cycle -> Reset/Create with NEW LIMIT
    if (!usage || (usage.expire && usage.expire < now)) {
      usage = await tx.usage.upsert({
        where: { key: finalUserId },
        update: {
          points: limit - cost,
          expire: expiresAt,
        },
        create: {
          key: finalUserId,
          points: limit - cost,
          expire: expiresAt,
        },
      });
      return usage;
    }

    // Case 2: Active cycle -> Check if they have enough points
    if (usage.points < cost) {
      throw new Error("You have ran out of credits");
    }

    // Case 3: Consume points
    usage = await tx.usage.update({
      where: { key: finalUserId },
      data: {
        points: usage.points - cost,
      },
    });

    return usage;
  });
}