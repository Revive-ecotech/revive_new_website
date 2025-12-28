"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Item {
  id: number;
  name: string;
  designation: string;
  image: string;
}

export function AnimatedTooltip({ items }: { items: Item[] }) {
  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            className="relative"
            style={{
              marginLeft: idx === 0 ? 0 : -18, // balanced overlap
              zIndex: items.length - idx,     // left faces stay visible
            }}
            whileHover={{
              scale: 1.15,
              zIndex: 50,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-full"
                sizes="56px"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
