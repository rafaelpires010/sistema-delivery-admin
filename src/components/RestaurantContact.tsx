import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Restaurant, TenantInfo } from "@/types/restaurant";
import { Info, MapPin, Loader2, Check, Phone, MessageCircle, Instagram } from "lucide-react";
import { toast } from "sonner";
import InputMask from 'react-input-mask';

interface RestaurantContactProps {
  restaurant: Restaurant;
  onUpdate: (data: Partial<TenantInfo>) => Promise<void>;
}

type FormData = Partial<TenantInfo>;

export const RestaurantContact = ({ restaurant, onUpdate }: RestaurantContactProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!restaurant.tenantInfo);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    defaultValues: {
      cnpj: restaurant.tenantInfo?.cnpj || "",
      telefone: restaurant.tenantInfo?.telefone || "",
      whatsapp: restaurant.tenantInfo?.whatsapp || "",
      instagram: restaurant.tenantInfo?.instagram || "",
      cep: restaurant.tenantInfo?.cep || "",
      rua: restaurant.tenantInfo?.rua || "",
      numero: restaurant.tenantInfo?.numero || "",
      bairro: restaurant.tenantInfo?.bairro || "",
      cidade: restaurant.tenantInfo?.cidade || "",
      estado: restaurant.tenantInfo?.estado || "",
      complemento: restaurant.tenantInfo?.complemento || ""
    },
    mode: 'onChange'
  });

  const handleUpdateContact = async (data: FormData) => {
    setIsLoading(true);
    await onUpdate(data);
    setIsEditing(false);
    setIsLoading(false);
  };

  const fullAddress = restaurant.tenantInfo
    ? `${restaurant.tenantInfo.rua}, ${restaurant.tenantInfo.numero}, ${restaurant.tenantInfo.bairro} - ${restaurant.tenantInfo.cidade}, ${restaurant.tenantInfo.estado}`
    : "Endereço não cadastrado";

  if (isEditing) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Info className="w-5 h-5" />
            <span>Cadastrar Informações e Contato</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(handleUpdateContact)} className="space-y-6">
            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Controller
                    name="cnpj"
                    control={control}
                    rules={{ required: "O CNPJ é obrigatório." }}
                    render={({ field }) => (
                      <InputMask mask="99.999.999/9999-99" {...field}>
                        {(inputProps: any) => <Input {...inputProps} id="cnpj" />}
                      </InputMask>
                    )}
                  />
                  {errors.cnpj && <p className="text-sm text-red-500 mt-1">{errors.cnpj.message}</p>}
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Controller
                    name="telefone"
                    control={control}
                    rules={{ required: "O Telefone é obrigatório." }}
                    render={({ field }) => (
                      <InputMask mask="(99) 9999-9999" {...field}>
                        {(inputProps: any) => <Input {...inputProps} id="telefone" />}
                      </InputMask>
                    )}
                  />
                  {errors.telefone && <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Controller
                    name="whatsapp"
                    control={control}
                    rules={{ required: "O WhatsApp é obrigatório." }}
                    render={({ field }) => (
                      <InputMask mask="(99) 99999-9999" {...field}>
                        {(inputProps: any) => <Input {...inputProps} id="whatsapp" />}
                      </InputMask>
                    )}
                  />
                  {errors.whatsapp && <p className="text-sm text-red-500 mt-1">{errors.whatsapp.message}</p>}
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Controller
                    name="instagram"
                    control={control}
                    render={({ field }) => <Input {...field} id="instagram" placeholder="@seuusuario" />}
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Label htmlFor="cep">CEP</Label>
                  <Controller
                    name="cep"
                    control={control}
                    rules={{ required: "O CEP é obrigatório." }}
                    render={({ field }) => (
                      <InputMask mask="99999-999" {...field}>
                        {(inputProps: any) => <Input {...inputProps} id="cep" />}
                      </InputMask>
                    )}
                  />
                  {errors.cep && <p className="text-sm text-red-500 mt-1">{errors.cep.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="rua">Rua</Label>
                  <Controller name="rua" control={control} rules={{ required: "A Rua é obrigatória." }} render={({ field }) => <Input {...field} id="rua" />} />
                  {errors.rua && <p className="text-sm text-red-500 mt-1">{errors.rua.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Controller name="numero" control={control} rules={{ required: "O Número é obrigatório." }} render={({ field }) => <Input {...field} id="numero" />} />
                  {errors.numero && <p className="text-sm text-red-500 mt-1">{errors.numero.message}</p>}
                </div>
                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Controller name="bairro" control={control} rules={{ required: "O Bairro é obrigatório." }} render={({ field }) => <Input {...field} id="bairro" />} />
                  {errors.bairro && <p className="text-sm text-red-500 mt-1">{errors.bairro.message}</p>}
                </div>
                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Controller name="complemento" control={control} render={({ field }) => <Input {...field} id="complemento" />} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Controller name="cidade" control={control} rules={{ required: "A Cidade é obrigatória." }} render={({ field }) => <Input {...field} id="cidade" />} />
                  {errors.cidade && <p className="text-sm text-red-500 mt-1">{errors.cidade.message}</p>}
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Controller name="estado" control={control} rules={{ required: "O Estado é obrigatório." }} render={({ field }) => <Input {...field} id="estado" />} />
                  {errors.estado && <p className="text-sm text-red-500 mt-1">{errors.estado.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || !isValid}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                Salvar Informações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Info className="w-5 h-5" />
          <span>Informações e Contato</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center"><Phone className="w-4 h-4 mr-2" /> Contato</h4>
            <p className="text-gray-600 pl-6"><strong>CNPJ:</strong> {restaurant.tenantInfo?.cnpj || "Não informado"}</p>
            <p className="text-gray-600 pl-6"><strong>Telefone:</strong> {restaurant.tenantInfo?.telefone || "Não informado"}</p>
            <p className="text-gray-600 pl-6"><strong>WhatsApp:</strong> {restaurant.tenantInfo?.whatsapp || "Não informado"}</p>
            <p className="text-gray-600 pl-6"><strong>Instagram:</strong> {restaurant.tenantInfo?.instagram || "Não informado"}</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Endereço</h4>
            <p className="text-gray-600 pl-6">{fullAddress}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
