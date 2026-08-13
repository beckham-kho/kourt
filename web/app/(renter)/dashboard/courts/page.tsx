import { getAccessToken } from "@/lib/auth-server";
import { getMyCourts } from "@/lib/courts";
import CourtListItem from "@/components/dashboard/court-list-item";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyCourtsPage() {
  const token = await getAccessToken();

  if (!token) {
    redirect("/login");
  }

  const courts = await getMyCourts(token);

  return (
    <>
      <div className="flex items-center justify-between mt-4 mb-3">
        <h1 className="text-2xl font-bold">Lapangan Saya</h1>
        <Button
          render={
            <Link href="/dashboard/courts/new">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Lapangan
            </Link>
          }
        />
      </div>

      {courts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {courts.map((court) => (
            <CourtListItem key={court.id} court={court} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
          <p className="text-muted-foreground">
            Kamu belum punya lapangan terdaftar.
          </p>
          <Button
            render={
              <Link href="/dashboard/courts/new">Tambah Lapangan Pertama</Link>
            }
          />
        </div>
      )}
    </>
  );
}
