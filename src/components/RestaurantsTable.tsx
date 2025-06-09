import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Restaurant } from "@/types/restaurant";
import { MoreHorizontal, Eye, ToggleLeft, ToggleRight, Trash2, Store, Search } from "lucide-react";

interface RestaurantsTableProps {
  restaurants: Restaurant[];
  loading: boolean;
  onToggleStatus: (restaurantId: number) => Promise<void>;
}

export const RestaurantsTable = ({
  restaurants,
  loading,
  onToggleStatus,
}: RestaurantsTableProps) => {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const handleToggleClick = (restaurant: Restaurant) => {
    if (restaurant.status) {
      setSelectedRestaurant(restaurant);
      setIsAlertOpen(true);
    } else {
      onToggleStatus(restaurant.id);
    }
  };

  const handleConfirmToggle = async () => {
    if (selectedRestaurant) {
      setActionLoading(selectedRestaurant.id);
      await onToggleStatus(selectedRestaurant.id);
      setActionLoading(null);
    }
    setIsAlertOpen(false);
    setSelectedRestaurant(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatCNPJ = (cnpj: string | null | undefined): string => {
    if (!cnpj) return "";
    const cnpjDigits = cnpj.replace(/\D/g, "");
    if (cnpjDigits.length !== 14) return cnpj;
    return cnpjDigits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (searchTermLower === "") return true;

    const searchTermDigits = searchTerm.replace(/\D/g, '');

    const nameMatch = restaurant.nome?.toLowerCase().includes(searchTermLower);
    const slugMatch = restaurant.slug?.toLowerCase().includes(searchTermLower);
    const cnpjMatch = restaurant.tenantInfo?.cnpj?.replace(/\D/g, '').includes(searchTermDigits);

    return nameMatch || slugMatch || (searchTermDigits.length > 0 && cnpjMatch);
  });

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-admin-200 border-t-admin-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Carregando restaurantes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg border-0 animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <Store className="w-6 h-6" />
              <span>Restaurantes Cadastrados</span>
              <Badge variant="secondary" className="ml-2">
                {filteredRestaurants.length} restaurantes
              </Badge>
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome, slug ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredRestaurants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "Nenhum restaurante encontrado" : "Nenhum restaurante cadastrado"}
              </h3>
              <p className="text-sm">
                {searchTerm ? "Tente um termo de busca diferente." : "Cadastre o primeiro restaurante para começar."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Logo</TableHead>
                  <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                  <TableHead className="font-semibold text-gray-700">Slug</TableHead>
                  <TableHead className="font-semibold text-gray-700">CNPJ</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestaurants.map((restaurant) => {
                  const isActive = restaurant.status;
                  return (
                    <TableRow
                      key={restaurant.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell>
                        {restaurant.img ? (
                          <img
                            src={restaurant.img}
                            alt={`Logo ${restaurant.nome}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Store className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {restaurant.nome}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono">
                        {restaurant.slug}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono">
                        {formatCNPJ(restaurant.tenantInfo?.cnpj)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center justify-center">
                          <Badge
                            variant={isActive ? 'default' : 'secondary'}
                            className={
                              isActive
                                ? 'bg-success-100 text-success-800 hover:bg-success-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }
                          >
                            <p className="flex items-center justify-center">{isActive ? 'Ativo' : 'Inativo'}</p>
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              disabled={actionLoading === restaurant.id}
                            >
                              {actionLoading === restaurant.id ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                            <DropdownMenuItem asChild className="hover:bg-gray-50 cursor-pointer">
                              <Link to={`/restaurants/${restaurant.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleClick(restaurant)}
                              className="hover:bg-gray-50 cursor-pointer"
                            >
                              {isActive ? (
                                <>
                                  <ToggleLeft className="mr-2 h-4 w-4" />
                                  Inativar
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="mr-2 h-4 w-4" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá inativar o restaurante "{selectedRestaurant?.nome}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRestaurant(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggle}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
