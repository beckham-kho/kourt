import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  period: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: string;
}

export default function StatCard({
  title,
  period,
  value,
  description,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="p-1 gap-0 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="gap-1 py-1">
        <CardTitle className="text-lg font-semibold">
          {title}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            /{period}
          </span>
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Icon className="h-3.5 w-3.5 shrink-0" />
          {value}
        </CardDescription>
        <CardDescription>{description}</CardDescription>
        {trend && (
          <CardDescription>
            <Badge variant="secondary" className="mt-2">
              {trend}
            </Badge>
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}
