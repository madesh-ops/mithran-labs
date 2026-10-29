import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "./Icons";
import styles from "./Button.module.css";

type Variant = "primary" | "glass" | "ink" | "ghost";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: "arrow" | "external" | "none";
  className?: string;
  children: ReactNode;
};

type LinkProps = Common & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type ButtonProps = Common & { href?: undefined; loading?: boolean } & Omit<ComponentProps<"button">, "className" | "children">;

function classes(variant: Variant, size: Size, extra?: string) {
  return [
    styles.button,
    variant === "glass" ? `glass ${styles.glassVariant}` : styles[variant],
    size !== "md" ? styles[size] : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** Pill button. Renders a Next <Link>, an external <a>, or a <button>. */
export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "md", icon = "arrow", className, children } = props;
  const cls = classes(variant, size, className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, icon: _i, className: _c, children: _ch, ...rest } = props;
    const external = isExternal(href);
    const Icon = icon === "external" || /^https?:/.test(href) ? ArrowUpRight : ArrowRight;
    const content = (
      <>
        <span>{children}</span>
        {icon !== "none" && <Icon className={styles.icon} />}
      </>
    );
    if (external) {
      const newTab = /^https?:/.test(href);
      return (
        <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {content}
          {newTab && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {content}
      </Link>
    );
  }

  const { loading, variant: _v, size: _s, icon: _i, className: _c, children: _ch, type = "button", ...rest } = props;
  return (
    <button type={type} className={cls} aria-busy={loading || undefined} {...rest}>
      <span>{children}</span>
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        icon !== "none" && <ArrowRight className={styles.icon} />
      )}
    </button>
  );
}
