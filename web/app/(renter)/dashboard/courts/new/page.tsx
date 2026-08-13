import { getFacilities } from "@/lib/facilities";
import AddCourtForm from "@/components/dashboard/add-court-form";

export default async function NewCourtPage() {
  const facilities = await getFacilities();

  return (
    <>
      <h1 className="text-2xl font-bold mt-4 mb-5">Tambah Lapangan Baru</h1>
      <AddCourtForm facilities={facilities} />
    </>
  );
}