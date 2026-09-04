"use client";

interface ArrowButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  accent?: "green" | "magenta" | "cyan" | "orange";
  style?: React.CSSProperties;
}

export default function ArrowButton({ href, onClick, children, accent = "green", style }: ArrowButtonProps) {
  const colors: Record<string, string> = {
    green: "#39FF88",
    magenta: "#E600FF",
    cyan: "#00F6FF",
    orange: "#FFA31A",
  };

  const tag = href ? "a" : "button";

  const props: React.AnchorHTMLAttributes<HTMLAnchorElement> &
    React.ButtonHTMLAttributes<HTMLButtonElement> = {
    className: "arrow-btn",
    onClick,
    style: {
      ["--hover-color" as string]: colors[accent],
      ...style,
    } as React.CSSProperties,
    ...(href ? { href } : {}),
  };

  if (tag === "a") {
    return (
      <a {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children} <span className="arr">→</span>
      </a>
    );
  }
  return (
    <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children} <span className="arr">→</span>
    </button>
  );
}
