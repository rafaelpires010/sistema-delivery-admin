import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Restaurant } from "@/types/restaurant";
import { Clock, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";

interface RestaurantWorkingHoursProps {
  restaurant: Restaurant;
  onUpdate: (data: any) => Promise<void>;
}

const DAYS_OF_WEEK = [
  { key: 'seg', label: 'Segunda' },
  { key: 'ter', label: 'Terça' },
  { key: 'quar', label: 'Quarta' },
  { key: 'quin', label: 'Quinta' },
  { key: 'sex', label: 'Sexta' },
  { key: 'sab', label: 'Sábado' },
  { key: 'dom', label: 'Domingo' },
] as const;

type FormData = {
  [key: string]: string;
};

export const RestaurantWorkingHours = ({ restaurant, onUpdate }: RestaurantWorkingHoursProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Helper para formatar HHmm para HH:mm
  const formatTime = (time: any) => {
    const timeStr = String(time || '');
    if (!timeStr || timeStr.length < 4) return "Fechado";
    const paddedTime = timeStr.padStart(4, '0');
    return `${paddedTime.substring(0, 2)}:${paddedTime.substring(2, 4)}`;
  };

  const { control, handleSubmit } = useForm<FormData>();

  const handleSave = async (data: FormData) => {
    setIsLoading(true);
    await onUpdate(data);
    setIsLoading(false);
  };

  if (!restaurant.tenantFuncionamento) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Clock className="w-5 h-5" />
            <span>Cadastrar Horários de Funcionamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(handleSave)}>
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.key} className="flex items-center justify-between py-2 border-b">
                  <span className="font-medium text-gray-700 w-24">{day.label}</span>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name={`${day.key}Open`}
                      control={control}
                      defaultValue="0800"
                      render={({ field }) => (
                        <InputMask mask="99:99" {...field}>
                          {(inputProps: any) => <Input {...inputProps} className="w-24 h-8" />}
                        </InputMask>
                      )}
                    />
                    <span className="text-gray-500">às</span>
                    <Controller
                      name={`${day.key}Close`}
                      control={control}
                      defaultValue="2200"
                      render={({ field }) => (
                        <InputMask mask="99:99" {...field}>
                          {(inputProps: any) => <Input {...inputProps} className="w-24 h-8" />}
                        </InputMask>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 mt-4 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Horários
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
          <Clock className="w-5 h-5" />
          <span>Horários de Funcionamento</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => {
            const openTime = restaurant.tenantFuncionamento?.[`${day.key}Open` as keyof typeof restaurant.tenantFuncionamento];
            const closeTime = restaurant.tenantFuncionamento?.[`${day.key}Close` as keyof typeof restaurant.tenantFuncionamento];

            return (
              <div key={day.key} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <span className="font-medium text-gray-700 w-24">{day.label}</span>
                <span className="text-gray-600">
                  {formatTime(openTime)} às {formatTime(closeTime)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
