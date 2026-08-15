"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "highest", label: "Rating Tertinggi" },
  { value: "lowest", label: "Rating Terendah" },
];

const RATING_OPTIONS = [
  { value: "all", label: "Semua Rating" },
  { value: "5", label: "5 Bintang" },
  { value: "4", label: "4 Bintang" },
  { value: "3", label: "3 Bintang" },
  { value: "2", label: "2 Bintang" },
  { value: "1", label: "1 Bintang" },
];

export default function ReviewFilters({
  sort,
  rating,
}: {
  sort: string;
  rating: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const ratingLabel = RATING_OPTIONS.find((opt) => opt.value === rating)?.label;
  const sortLabel = SORT_OPTIONS.find((opt) => opt.value === sort)?.label;

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <Select
        value={rating}
        onValueChange={(v) => v && updateParam("rating", v)}
      >
        <SelectTrigger className="flex-1 sm:w-40">
          <SelectValue>{ratingLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {RATING_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => v && updateParam("sort", v)}>
        <SelectTrigger className="flex-1 sm:w-44">
          <SelectValue>{sortLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
