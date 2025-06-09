import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { RestaurantsTable } from "@/components/RestaurantsTable";
import { DashboardStats } from "@/components/DashboardStats";
import { Store } from "lucide-react";
import { api } from "@/lib/useApi";
import { Restaurant } from "@/types/restaurant";
import { toast } from "sonner";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await api.getTenants();
        if (data) {
          setRestaurants(data);
        }
      } catch (error) {
        toast.error("Falha ao buscar restaurantes.", {
          style: {
            backgroundColor: '#fff1f2',
            color: '#ef4444'
          }
        });
        console.error("Erro ao buscar restaurantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleToggleStatus = async (restaurantId: number) => {
    try {
      const result = await api.toggleTenantStatus(restaurantId, {});
      if (result.success) {
        setRestaurants(prev =>
          prev.map(r =>
            r.id === restaurantId ? { ...r, status: !r.status } : r
          )
        );
        toast.success("Status do restaurante alterado com sucesso.");
      } else {
        toast.error("Erro ao alterar o status.", { description: result.message, style: { backgroundColor: '#fff1f2', color: '#ef4444' } });
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.", { style: { backgroundColor: '#fff1f2', color: '#ef4444' } });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                    <Store className="w-8 h-8 text-admin-600" />
                    <span>Restaurantes</span>
                  </h1>
                  <p className="text-gray-600">Gerencie todos os restaurantes cadastrados</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <DashboardStats restaurants={restaurants} />

            {/* Restaurants Table */}
            <RestaurantsTable restaurants={restaurants} loading={loading} onToggleStatus={handleToggleStatus} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Restaurants;
