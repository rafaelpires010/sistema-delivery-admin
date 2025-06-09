import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Restaurant } from "@/types/restaurant";
import { Store, Calendar, Hash, Palette } from "lucide-react";

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

export const RestaurantInfo = ({ restaurant }: RestaurantInfoProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Store className="w-5 h-5" />
          <span>Informações Básicas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Logo e Nome */}
          <div className="flex items-center space-x-4">
            {restaurant.img ? (
              <img
                src={restaurant.img}
                alt={`Logo ${restaurant.nome}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <Store className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{restaurant.nome}</h3>
              <p className="text-gray-600 font-mono">{restaurant.tenantInfo?.cnpj}</p>
            </div>
          </div>

          {/* Cores */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Cores da Marca</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: restaurant.main_color }}
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Principal</p>
                  <p className="text-gray-500 font-mono text-xs">{restaurant.main_color}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: restaurant.second_color }}
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Secundária</p>
                  <p className="text-gray-500 font-mono text-xs">{restaurant.second_color}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data de Cadastro */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {/* O campo createdAt não está mais disponível na API */}
              Data de cadastro não informada
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
