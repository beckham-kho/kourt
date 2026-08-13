"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MapPin, Pencil, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Court } from "@/types/court";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CourtListItem({ court }: { court: Court }) {
  const router = useRouter();
  const thumbnail =
    court.images?.[0]?.image_url || "https://placehold.co/300x200";

  const [isActive, setIsActive] = useState(court.is_active);
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleToggle(checked: boolean) {
    setIsActive(checked);
    setIsPending(true);

    try {
      const res = await fetch(`/api/courts/${court.id}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: checked }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Gagal memperbarui status");
        setIsActive(!checked);
      }
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
      setIsActive(!checked);
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/courts/${court.id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Gagal menghapus lapangan");
        return;
      }

      toast.success("Lapangan berhasil dihapus");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="flex flex-row overflow-hidden p-0 hover:shadow-lg transition-shadow duration-300">
      <Link
        href={`/dashboard/courts/${court.id}`}
        className="flex flex-row flex-1 min-w-0"
      >
        <div className="w-28 sm:w-40 shrink-0 aspect-square sm:aspect-video bg-muted">
          <img
            src={thumbnail}
            alt={court.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-3 gap-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-semibold truncate">{court.name}</p>
            {court.total_reviews > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {court.average_rating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {court.location}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{court.type}</Badge>
            <span className="text-sm font-semibold">
              {formatPrice(court.price)}/jam
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col sm:flex-row items-center gap-2 p-3 shrink-0">
        <div className="w-25 flex items-center gap-1.5">
          <Switch
            checked={isActive}
            disabled={isPending}
            onCheckedChange={handleToggle}
            aria-label={isActive ? "Nonaktifkan lapangan" : "Aktifkan lapangan"}
          />
          <span className="hidden sm:inline text-sm text-muted-foreground">
            {isActive ? "Aktif" : "Nonaktif"}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          render={
            <Link href={`/dashboard/courts/${court.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          }
        />

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus {court.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak bisa dibatalkan. Semua foto dan data lapangan
                ini akan dihapus permanen. Jika masih ada booking aktif,
                penghapusan akan ditolak.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Menghapus..." : "Hapus"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
