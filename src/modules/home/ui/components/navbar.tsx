"use client";

import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { UserControl } from "@/components/user-control";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Laptop, Monitor } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const isScrolled = useScroll();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500",
        isScrolled ? "pt-4" : "pt-0"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden w-full max-w-5xl flex items-center justify-between px-6 py-3 transition-all duration-500",
          isScrolled
            ? "rounded-full shadow-lg w-[95%] md:w-full mt-2"
            : "bg-transparent"
        )}
      >
        {/* 🌈 GRADIENT BACKGROUND */}
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500",
            "bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradientBackground.png')]",
            isScrolled ? "opacity-100" : "opacity-0"
          )}
        />

        {/* 🌑 DARK MODE OVERLAY (keeps contrast clean) */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            isScrolled
              ? "bg-white/30 dark:bg-black/80"
              : "bg-transparent"
          )}
        />

        {/* 🧊 GLASS BLUR (only when scrolled) */}
        <div
          className={cn(
            "absolute inset-0 backdrop-blur-xl transition-opacity duration-500",
            isScrolled ? "opacity-100" : "opacity-0"
          )}
        />

        {/* 🔹 CONTENT */}
        <div className="relative z-10 flex items-center justify-between w-full">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500" />
              <Image
                src="/beyond.png"
                alt="WebHive"
                width={32}
                height={32}
                className="rounded-full relative"
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              WebHive
            </span>
          </Link>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" className="rounded-full bg-blue-600 text-white">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <UserControl showName />
            </SignedIn>

            <div className="h-6 w-px bg-border/50 hidden sm:block" />

            {/* THEME TOGGLE */}
            {mounted ? (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {theme === "light" ? (
                      <Sun className="w-5 h-5" />
                    ) : theme === "dark" ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Monitor className="w-5 h-5" />
                    )}
                  </Button>
                </Popover.Trigger>

                <Popover.Content
                  className="z-[60] w-32 p-1 rounded-xl bg-background/90 backdrop-blur-xl border shadow-xl"
                  align="start"
                  sideOffset={8}
                >
                  <ThemeItem icon={<Sun className="w-4 h-4" />} label="Light" active={theme === "light"} onClick={() => setTheme("light")} />
                  <ThemeItem icon={<Moon className="w-4 h-4" />} label="Dark" active={theme === "dark"} onClick={() => setTheme("dark")} />
                  <ThemeItem icon={<Laptop className="w-4 h-4" />} label="System" active={theme === "system"} onClick={() => setTheme("system")} />
                </Popover.Content>
              </Popover.Root>
            ) : (
              <div className="w-9 h-9 bg-muted animate-pulse rounded-full" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const ThemeItem = ({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active: boolean;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-lg",
      active
        ? "bg-accent text-accent-foreground font-medium"
        : "text-muted-foreground hover:bg-accent/50"
    )}
  >
    {icon}
    {label}
  </button>
);
