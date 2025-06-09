import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/useApi";
import { Restaurant, RestaurantAdmin } from "@/types/restaurant";
import { RestaurantInfo } from "@/components/RestaurantInfo";
import { RestaurantAdmins } from "@/components/RestaurantAdmins";
import { RestaurantWorkingHours } from "@/components/RestaurantWorkingHours";
import { RestaurantContact } from "@/components/RestaurantContact";
import { Store, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { TenantInfo, TenantFuncionamento } from "@/types/restaurant";

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [admins, setAdmins] = useState<RestaurantAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const restaurantData = await api.getTenantById(id);
        setRestaurant(restaurantData);

        if (restaurantData) {
          const usersData = await api.getUsers(restaurantData.id);
          setAdmins(usersData);
        }

      } catch (error) {
        console.error("Failed to fetch restaurant details:", error);
        toast.error("Falha ao buscar detalhes do restaurante.", {
          style: {
            backgroundColor: '#fff1f2',
            color: '#ef4444'
          }
        });
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleAdminCreated = (newAdmin: RestaurantAdmin) => {
    setAdmins(prev => [...prev, newAdmin]);
  }

  const handleToggleAdminStatus = async (adminId: number) => {
    if (!id) return;
    const result = await api.toggleUserStatus(adminId, [parseInt(id, 10)]);

    if (result.success) {
      setAdmins(prevAdmins =>
        prevAdmins.map(admin =>
          admin.id === adminId ? { ...admin, active: !admin.active } : admin
        )
      );
      toast.success("Status do usuário alterado com sucesso.");
    } else {
      toast.error("Erro ao alterar status do usuário.", {
        description: result.message,
        style: {
          backgroundColor: '#fff1f2',
          color: '#ef4444'
        }
      });
    }
  };

  const handleAddContactInfo = async (data: Partial<TenantInfo>) => {
    if (!id) return;
    const result = await api.createTenantInfoEnder(parseInt(id, 10), data);

    if (result.success) {
      toast.success("Informações de contato salvas com sucesso!");
      setRestaurant(prev => prev ? { ...prev, tenantInfo: result.data.data.newTenantInfo } : null);
    } else {
      toast.error("Erro ao salvar informações.", {
        description: result.message,
        style: {
          backgroundColor: '#fff1f2',
          color: '#ef4444'
        }
      });
    }
  };

  const handleAddWorkingHours = async (data: Partial<TenantFuncionamento>) => {
    if (!id) return;

    const formattedData: { [key: string]: string } = {};
    Object.keys(data).forEach(key => {
      const value = (data as any)[key];
      if (typeof value === 'string') {
        formattedData[key] = value.replace(":", "");
      }
    });

    const result = await api.createTenantFunc(parseInt(id, 10), formattedData);

    if (result.success) {
      toast.success("Horários de funcionamento salvos com sucesso!");
      setRestaurant(prev => prev ? { ...prev, tenantFuncionamento: result.data.data } : null);
    } else {
      toast.error("Erro ao salvar horários.", {
        description: result.message,
        style: {
          backgroundColor: '#fff1f2',
          color: '#ef4444'
        }
      });
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 overflow-hidden">
            <div className="p-6">
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-admin-200 border-t-admin-500 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Carregando detalhes do restaurante...</span>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!restaurant) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 overflow-hidden">
            <div className="p-6">
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 text-center">
                  <Store className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h2 className="text-xl font-semibold mb-2">Restaurante não encontrado</h2>
                  <p className="text-gray-600 mb-4">O restaurante que você está procurando não existe.</p>
                  <Link to="/restaurants">
                    <Button>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar para Restaurantes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

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
                <div className="flex items-center space-x-4">
                  <Link to="/restaurants">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                      <Store className="w-8 h-8 text-admin-600" />
                      <span>{restaurant.nome}</span>
                      <Badge
                        variant={restaurant.status ? 'default' : 'secondary'}
                        className={
                          restaurant.status
                            ? 'bg-success-100 text-success-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {restaurant.status ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </h1>
                    <p className="text-gray-600">Visualize e gerencie as informações do restaurante</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Restaurant Info */}
              <RestaurantInfo restaurant={restaurant} />

              {/* Address */}
              <RestaurantContact restaurant={restaurant} onUpdate={handleAddContactInfo} />

              {/* Working Hours */}
              <RestaurantWorkingHours restaurant={restaurant} onUpdate={handleAddWorkingHours} />

              {/* Admins */}
              <RestaurantAdmins restaurant={restaurant} admins={admins} onAdminCreated={handleAdminCreated} onToggleStatus={handleToggleAdminStatus} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default RestaurantDetails;
