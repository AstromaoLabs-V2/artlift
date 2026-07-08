"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/props";
import { categoryAPI } from "@/lib/category";

interface CategoryPickerProps {
  selected: number[];
  onChange: (ids: number[]) => void;
  max?: number;
}

export default function CategoryPicker({
  selected,
  onChange,
  max = 3,
}: CategoryPickerProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryAPI
      .list()
      .then((data: Category[]) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((selectedId) => selectedId !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  };

  const renderGroup = (label: string, items: Category[]) => (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((category) => {
          const isSelected = selected.includes(category.id);
          const disabled = !isSelected && selected.length >= max;
          return (
            <Button
              key={category.id}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "outline"}
              disabled={disabled}
              onClick={() => toggle(category.id)}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderGroup(
        "Mood",
        categories.filter((category) => category.type === "mood")
      )}
      {renderGroup(
        "Category of Art",
        categories.filter((category) => category.type === "art_style")
      )}
      <p className="text-xs text-gray-400">
        {selected.length}/{max} selected
      </p>
    </div>
  );
}
