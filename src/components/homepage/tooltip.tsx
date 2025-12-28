"use client";

import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Rahul Kumar",
    designation: "Recycling Partner",
    image:
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Pooja Sharma",
    designation: "Community Member",
    image:
      "https://images.unsplash.com/photo-1599847021117-c4c3f1cbe8f3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Amit Verma",
    designation: "Logistics Associate",
    image:
      "https://images.unsplash.com/photo-1618641986557-1ecd230959aa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Neha Singh",
    designation: "Sustainability Advocate",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
  },
];

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center">
      <AnimatedTooltip items={people} />
    </div>
  );
}
