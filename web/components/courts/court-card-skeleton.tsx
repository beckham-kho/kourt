import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourtCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0 gap-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardHeader className="gap-2 py-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
    </Card>
  );
}
