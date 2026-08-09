import Navbar from "@/components/layout/navbar";
import CourtSearchBar from "@/components/courts/court-search-bar";
import CourtCard from "@/components/courts/court-card";
import { getCourts } from "@/lib/courts";
import Footer from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/auth-server";

export default async function CourtsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const courts = await getCourts(q);

  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />

      <section className="flex flex-col bg-primary h-[20dvh] items-center justify-center px-5">
        <CourtSearchBar />
      </section>

      <section className="p-4 md:px-20 md:py-7">
        {courts.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            Tidak ada lapangan ditemukan{q ? ` untuk "${q}"` : ""}.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {courts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
