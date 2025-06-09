import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Users, TrendingUp, Clock } from "lucide-react";
import { Restaurant } from "@/types/restaurant";

interface DashboardStatsProps {
  restaurants: Restaurant[];
  crescimentoValue: number;
}

export const DashboardStats = ({ restaurants, crescimentoValue }: DashboardStatsProps) => {
  const activeCount = restaurants.filter(r => r.status).length;
  const inactiveCount = restaurants.length - activeCount;

  const stats = [
    {
      title: "Total de Restaurantes",
      value: restaurants.length,
      icon: Store,
      color: "bg-admin-500",
      textColor: "text-admin-600",
    },
    {
      title: "Restaurantes Ativos",
      value: activeCount,
      icon: Users,
      color: "bg-success-500",
      textColor: "text-success-600",
    },
    {
      title: "Restaurantes Inativos",
      value: inactiveCount,
      icon: Clock,
      color: "bg-gray-500",
      textColor: "text-gray-600",
    },
    {
      title: "Crescimento",
      value: `+${crescimentoValue}%`,
      icon: TrendingUp,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.textColor}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
