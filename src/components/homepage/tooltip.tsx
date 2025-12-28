"use client";

import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Ramesh Kumar",
    designation: "Recycling Partner",
    image:
      "https://images.unsplash.com/photo-1624206112918-f140f087f9b5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Sunita Devi",
    designation: "Community Member",
    image:
      "https://images.unsplash.com/photo-1611590027211-b954fd027b51?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Amit Singh",
    designation: "Logistics Associate",
    image:
      "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Pallavi Joshi",
    designation: "Sustainability Advocate",
    image:
      "https://images.unsplash.com/photo-1599847021117-c4c3f1cbe8f3?auto=format&fit=crop&w=400&q=80",
  },
];

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center">
      <AnimatedTooltip items={people} />
    </div>
  );
}
