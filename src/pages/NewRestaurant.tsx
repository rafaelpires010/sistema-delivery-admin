import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { RestaurantForm } from "@/components/RestaurantForm";
import { Plus } from "lucide-react";
import { api } from "@/lib/useApi";
import { CreateRestaurantData } from "@/types/restaurant";
import { toast } from "sonner";

const NewRestaurant = () => {
  const navigate = useNavigate();

  const handleCreateRestaurant = async (form: CreateRestaurantData) => {
    const formData = new FormData();
    // Corrigindo os nomes dos campos para corresponder ao backend
    formData.append('nome', form.nome);
    formData.append('slug', form.slug);
    formData.append('main_color', form.main_color);
    formData.append('second_color', form.second_color);

    // O backend espera o arquivo no campo 'file'
    if (form.img) {
      formData.append('img', form.img);
    }

    const resultado = await api.createTenant(formData);

    if (resultado.success) {
      toast.success("Restaurante criado com sucesso!");
      const newRestaurant = resultado.data;
      navigate(`/restaurants/${newRestaurant.tenant.id}`);
    } else {
      toast.error("Erro ao criar restaurante", {
        description: resultado.message,
        style: {
          backgroundColor: '#fff1f2',
          color: '#ef4444'
        }
      });
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
                    <Plus className="w-8 h-8 text-success-600" />
                    <span>Novo Restaurante</span>
                  </h1>
                  <p className="text-gray-600">Cadastre um novo restaurante no sistema</p>
                </div>
              </div>
            </div>

            {/* Restaurant Form */}
            <div className="max-w-2xl">
              <RestaurantForm onSubmit={handleCreateRestaurant} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default NewRestaurant;
