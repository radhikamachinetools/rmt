// app/components/FaqAccordion.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border-b">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex justify-between items-center text-left py-4"
          >
            <h3 className="text-lg font-semibold text-dark-gray">
              {item.question}
            </h3>
            <ChevronDown
              className={`transition-transform duration-300 ${
                openIndex === index ? "rotate-180 text-brand-green-dark" : ""
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="pb-4 text-gray-600">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
