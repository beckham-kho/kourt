"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CourtSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/courts?q=${encodeURIComponent(trimmed)}` : "/courts",
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-xl flex items-center gap-2 bg-primary-foreground rounded-lg p-2 shadow-lg"
    >
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Masukkan nama lapangan..."
        className="border-none shadow-none focus-visible:ring-0 bg-transparent"
      />
      <Button type="submit" size="icon" className="rounded-full shrink-0">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
