"use client";
interface Props {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (n: number) => void;
}

export default function StarRating({ rating, max = 5, size = 16, interactive, onRate }: Props) {
  return (
    <div className="flex gap-0.5" style={{ lineHeight: 1 }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          onClick={() => interactive && onRate?.(i + 1)}
          style={{
            fontSize: size,
            color: i < Math.round(rating) ? "var(--yellow)" : "var(--border)",
            cursor: interactive ? "pointer" : "default",
            transition: "color 0.1s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
