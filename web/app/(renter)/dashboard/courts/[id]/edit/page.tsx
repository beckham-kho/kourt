import { getCourtById } from "@/lib/courts";
import { getFacilities } from "@/lib/facilities";
import { getCurrentUser } from "@/lib/auth-server";
import EditCourtForm from "@/components/dashboard/edit-court-form";
import { notFound, redirect } from "next/navigation";

export default async function EditCourtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [court, facilities, user] = await Promise.all([
    getCourtById(id),
    getFacilities(),
    getCurrentUser(),
  ]);

  if (!court) {
    notFound();
  }

  if (court.owner_id !== user?.user_id) {
    redirect("/dashboard/courts");
  }

  return (
    <>
      <h1 className="text-2xl font-bold mt-4 mb-5">Edit {court.name}</h1>
      <EditCourtForm court={court} facilities={facilities} />
    </>
  );
}
