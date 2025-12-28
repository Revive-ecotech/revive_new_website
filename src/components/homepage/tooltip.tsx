"use client";

import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Aarav Sharma",
    designation: "Operations Manager",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    name: "Riya Patel",
    designation: "Sustainability Lead",
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 3,
    name: "Kunal Verma",
    designation: "Logistics Coordinator",
    image: "https://i.pravatar.cc/150?img=68",
  },
  {
    id: 4,
    name: "Ananya Iyer",
    designation: "Community Partner",
    image: "https://i.pravatar.cc/150?img=32",
  },
];

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center">
      <AnimatedTooltip items={people} />
    </div>
  );
}
