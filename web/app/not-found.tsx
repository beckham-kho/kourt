import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-server";

export default async function NotFound() {
  const user = await getCurrentUser();
  return (
    <>
      <Navbar user={user} />

      <section className="flex flex-col items-center justify-center gap-4 py-24 px-5 text-center min-h-[60dvh]">
        <SearchX className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-3xl font-bold">Halaman Tidak Ditemukan</h1>
        <p className="text-muted-foreground max-w-md">
          Halaman yang kamu cari mungkin telah dipindahkan, dihapus, atau alamat
          yang kamu masukkan salah.
        </p>
        <Button render={<Link href="/">Kembali ke Beranda</Link>} />
      </section>
      <Footer />
    </>
  );
}
