"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Court, CourtFacility } from "@/types/court";

const COURT_TYPES = ["Futsal", "Badminton", "Basket", "Tenis", "Voli"];

export default function EditCourtForm({
  court,
  facilities,
}: {
  court: Court;
  facilities: CourtFacility[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    court.facilities?.map((f) => f.id) ?? [],
  );
  const [type, setType] = useState(court.type);

  function toggleFacility(id: string) {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      location: formData.get("location"),
      price: Number(formData.get("price")),
      type,
      court_count: Number(formData.get("court_count")),
      facility_ids: selectedFacilities,
    };

    try {
      const res = await fetch(`/api/courts/${court.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Gagal memperbarui lapangan");
        return;
      }

      toast.success("Lapangan berhasil diperbarui");
      router.push("/dashboard/courts");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nama Lapangan</Label>
        <Input
          id="name"
          name="name"
          defaultValue={court.name}
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={court.description}
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="location">Lokasi</Label>
        <Input
          id="location"
          name="location"
          defaultValue={court.location}
          required
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Harga per Jam</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            defaultValue={court.price}
            required
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="court_count">Jumlah Lapangan</Label>
          <Input
            id="court_count"
            name="court_count"
            type="number"
            min="1"
            defaultValue={court.court_count}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Tipe Olahraga</Label>
        <div className="flex flex-wrap gap-2">
          {COURT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              disabled={loading}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                type === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Fasilitas</Label>
        <div className="grid grid-cols-2 gap-2">
          {facilities.map((facility) => (
            <div key={facility.id} className="flex items-center gap-2">
              <Checkbox
                id={facility.id}
                checked={selectedFacilities.includes(facility.id)}
                onCheckedChange={() => toggleFacility(facility.id)}
                disabled={loading}
              />
              <Label htmlFor={facility.id} className="font-normal">
                {facility.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Menyimpan...
          </>
        ) : (
          "Simpan Perubahan"
        )}
      </Button>
    </form>
  );
}
