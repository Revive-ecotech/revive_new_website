import { Star } from "lucide-react";

export function StarRating({ filled }: { filled: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < filled
              ? "fill-yellow-400 text-yellow-400"
              : "text-yellow-400"
          }`}
        />
      ))}
    </div>
  );
}
