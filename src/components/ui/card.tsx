import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A styled container component that provides the Card layout and visual surface.
 *
 * @param className - Additional CSS class names appended to the component's default classes
 * @returns The rendered `div` element with `data-slot="card"` and the card styling applied
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the header region of a Card with responsive grid layout and slot attributes for composition.
 *
 * The returned element includes data-slot="card-header", applies the component's header styling, merges any provided `className`, and spreads remaining div props onto the element.
 *
 * @returns A `div` element representing the card header slot
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a card title container with title-specific typography and a `data-slot="card-title"` attribute.
 *
 * @param className - Additional CSS classes to merge with the component's default typography classes
 * @returns The title element with `leading-none` and `font-semibold` classes applied
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Renders the card description slot with muted foreground and small text styling.
 *
 * @returns A `div` element with `data-slot="card-description"`, applying muted foreground and `text-sm` styles and spreading any additional `div` props onto the element.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * Renders the card action slot positioned in the card's grid (right-aligned and spanning rows).
 *
 * @returns The div element for the card action slot with `data-slot="card-action"`.
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the card's content slot with horizontal padding and a `data-slot="card-content"` attribute.
 *
 * @returns A `div` element used as the card content container
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * Card footer container for actions or metadata at the bottom of a card.
 *
 * @returns A div element with `data-slot="card-footer"` and footer layout classes; merges any provided `className` and spreads remaining props onto the div.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}