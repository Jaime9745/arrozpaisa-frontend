import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { memo } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: "up" | "neutral" | "down";
  loading?: boolean;
}

function StatsCardComponent({
  title,
  value,
  description,
  icon,
  trend,
  loading = false,
}: StatsCardProps) {
  const IconComponent = icon;

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200"
      style={{ borderRadius: "30px" }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <IconComponent className="h-4 w-4 text-gray-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <p
              className={`text-xs ${
                trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                    ? "text-red-600"
                    : "text-gray-600"
              } flex items-center gap-1`}
            >
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : null}
              {description}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// React.memo prevents re-renders when props haven't changed
export default memo(StatsCardComponent);
