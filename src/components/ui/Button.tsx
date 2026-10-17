import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "quiet";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold tracking-tight transition-[background,box-shadow,border-color,color] duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-fg shadow-card hover:bg-brand-hover",
  ghost: "border border-field-line text-fg hover:bg-brand-soft",
  quiet: "text-fg-2 hover:text-fg",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

type LinkButtonProps = { href: string; children: ReactNode; variant?: Variant; className?: string; external?: boolean };

export function LinkButton({ href, children, variant = "primary", className = "", external }: LinkButtonProps) {
  if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={buttonClass(variant, className)}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };
export function Button({ variant = "primary", className = "", type = "button", ...rest }: BtnProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}
