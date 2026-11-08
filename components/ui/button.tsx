import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Violeta Órbita is the only colour for primary actions (brand.md); Verde
// Próximo never replaces it on a main CTA.
const variants = {
  primary:
    "bg-orbita text-luz shadow-[0_10px_30px_-12px_rgba(103,87,232,0.9)] hover:bg-orbita-600",
  ghost: "border border-line text-luz hover:border-orbita-soft hover:bg-white/[0.04]",
  inverse: "bg-luz text-noite hover:bg-nebulosa",
  ghostLight: "border border-line-light text-ink hover:border-orbita hover:text-orbita",
} as const;

export type ButtonVariant = keyof typeof variants;

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold " +
  "transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

export function buttonClass(variant: ButtonVariant = "primary", className?: string): string {
  return cn(base, variants[variant], className);
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant; href: string }) {
  return <a className={buttonClass(variant, className)} {...props} />;
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
