import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { DashboardStats } from "@/components/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Edit, Calendar as CalendarIcon, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/useApi";
import { Restaurant } from "@/types/restaurant";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FaturamentoTenant {
  id: number;
  created_at: string;
  tenantId: number;
  valorMensalidade: number;
  valorImplantacao: number;
  tenant: Restaurant;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [faturamentoTotal, setFaturamentoTotal] = useState<number | null>(null);
  const [loadingFaturamento, setLoadingFaturamento] = useState(true);
  const [mensalidade, setMensalidade] = useState<number | null>(null);
  const [implantacao, setImplantacao] = useState<number | null>(null);

  const [updatedMensalidade, setUpdatedMensalidade] = useState("");
  const [updatedImplantacao, setUpdatedImplantacao] = useState("");

  const [activeTab, setActiveTab] = useState("last30days");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalMensalidade, setTotalMensalidade] = useState<number | null>(null);
  const [totalImplantacao, setTotalImplantacao] = useState<number | null>(null);
  const [faturamentos, setFaturamentos] = useState<FaturamentoTenant[]>([]);
  const [crescimento, setCrescimento] = useState<number | null>(null);
  const [loadingCrescimento, setLoadingCrescimento] = useState(true);


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await api.getTenants();
        if (data) {
          setRestaurants(data);
        }
      } catch (error) {
        toast.error("Falha ao buscar restaurantes para os indicadores.", {
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

  useEffect(() => {
    const fetchCrescimentoData = async () => {
      if (!user) return;
      setLoadingCrescimento(true);
      try {
        const data = await api.getCrescimento(user.id);
        if (data && typeof data.crescimentoPercentual === 'number') {
          setCrescimento(data.crescimentoPercentual);
        } else {
          setCrescimento(0);
        }
      } catch (error) {
        console.error("Erro ao buscar dados de crescimento:", error);
        setCrescimento(0);
      } finally {
        setLoadingCrescimento(false);
      }
    }

    if (user) {
      fetchCrescimentoData();
    }
  }, [user]);

  const fetchFaturamentoTotal = async () => {
    if (!user) return;
    setLoadingFaturamento(true);

    let startDate: string, endDate: string;

    if (activeTab === 'today') {
      const today = new Date();
      startDate = format(startOfDay(today), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      endDate = format(endOfDay(today), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    } else if (activeTab === 'last30days') {
      const to = endOfDay(new Date());
      const from = startOfDay(subDays(new Date(), 29));
      startDate = format(from, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      endDate = format(to, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    } else if (activeTab === 'custom' && dateRange?.from && dateRange?.to) {
      startDate = format(startOfDay(dateRange.from), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      endDate = format(endOfDay(dateRange.to), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    } else {
      setLoadingFaturamento(false);
      return;
    }

    try {
      const data = await api.getFaturamentoTotal(user.id, startDate, endDate);
      if (data.success !== false) {
        setFaturamentoTotal(data.faturamentoTotal ?? 0);
        setTotalMensalidade(data.totalMensalidade ?? 0);
        setTotalImplantacao(data.totalImplantacao ?? 0);
        setFaturamentos(data.faturamentos ?? []);
      } else {
        setFaturamentoTotal(0);
        setTotalMensalidade(0);
        setTotalImplantacao(0);
        setFaturamentos([]);
        toast.error(data.message || "Falha ao buscar faturamento total.");
      }
    } catch (error) {
      setFaturamentoTotal(0);
      setTotalMensalidade(0);
      setTotalImplantacao(0);
      setFaturamentos([]);
      toast.error("Erro ao buscar faturamento total.");
    } finally {
      setLoadingFaturamento(false);
    }
  };

  const fetchEditableValues = async () => {
    if (!user) return;
    try {
      const data = await api.getValorFaturamento(user.id);
      if (data) {
        setMensalidade(data.valorMensalidade ?? null);
        setImplantacao(data.valorImplantacao ?? null);
      } else {
        setMensalidade(null);
        setImplantacao(null);
      }
    } catch (error) {
      console.error("Erro ao buscar valores editáveis:", error);
      setMensalidade(null);
      setImplantacao(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEditableValues();
      fetchFaturamentoTotal();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFaturamentoTotal();
    }
  }, [activeTab, dateRange, user]);


  const handleUpdateFaturamento = async () => {
    if (!user) {
      toast.error("Usuário não autenticado. Não é possível atualizar.");
      return;
    }

    const dataToUpdate: { valorMensalidade?: number; valorImplantacao?: number } = {};

    if (updatedMensalidade) dataToUpdate.valorMensalidade = parseFloat(updatedMensalidade);
    if (updatedImplantacao) dataToUpdate.valorImplantacao = parseFloat(updatedImplantacao);

    if (Object.keys(dataToUpdate).length === 0) {
      toast.info("Nenhum valor foi alterado.");
      return;
    }

    try {
      const response = await api.updateValorFaturamento(user.id, dataToUpdate);
      if (response.success) {
        toast.success("Valores atualizados com sucesso!");
        fetchEditableValues();
        setUpdatedMensalidade("");
        setUpdatedImplantacao("");
        setIsModalOpen(false); // Fecha o modal
      } else {
        toast.error(response.message || "Falha ao atualizar valores.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar atualizar os valores.");
      console.error("Erro ao atualizar faturamento:", error);
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
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Visão geral do sistema de gestão</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                <TrendingUp className="w-5 h-5 text-success-500" />
                <span className="text-sm font-medium text-gray-700">
                  {loadingCrescimento ? '...' : `Crescimento: ${(crescimento ?? 0).toFixed(2)}% este mês`}
                </span>
              </div>
            </div>

            {/* Stats */}
            <DashboardStats restaurants={restaurants} crescimentoValue={crescimento ?? 0} />

            {/* Faturamento e Mensalidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {/* Faturamento Card */}
              <Card className="shadow-lg border-0 animate-fade-in">
                <CardHeader className="bg-gradient-to-r from-admin-50 to-blue-50 border-b flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <DollarSign className="w-6 h-6" />
                    <span>Faturamento Total</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-gray-800 text-center">
                    {loadingFaturamento ? '...' : `R$ ${faturamentoTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </div>
                </CardContent>
              </Card>

              {/* Total Mensalidades Card */}
              <Card className="shadow-lg border-0 animate-fade-in">
                <CardHeader className="bg-gradient-to-r from-success-50 to-emerald-50 border-b flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <FileText className="w-6 h-6" />
                    <span>Total Mensalidades</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-gray-800 text-center">
                    {loadingFaturamento ? '...' : `R$ ${totalMensalidade?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </div>
                </CardContent>
              </Card>

              {/* Total Implantação Card */}
              <Card className="shadow-lg border-0 animate-fade-in">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <FileText className="w-6 h-6" />
                    <span>Total Implantações</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-gray-800 text-center">
                    {loadingFaturamento ? '...' : `R$ ${totalImplantacao?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </div>
                </CardContent>
              </Card>

            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant={activeTab === 'today' ? 'default' : 'outline'} onClick={() => setActiveTab('today')}>Hoje</Button>
                <Button size="sm" variant={activeTab === 'last30days' ? 'default' : 'outline'} onClick={() => setActiveTab('last30days')}>Últimos 30 dias</Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      size="sm"
                      variant={"outline"}
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(newRange) => {
                        setDateRange(newRange);
                        setActiveTab('custom');
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
              {/* Tabela de Faturamentos */}
              <Card className="shadow-lg border-0 animate-fade-in lg:col-span-3">
                <CardHeader>
                  <CardTitle>Tenants Cobrados no Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[64px]"></TableHead>
                        <TableHead>Restaurante</TableHead>
                        <TableHead>Mensalidade</TableHead>
                        <TableHead>Implantação</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingFaturamento ? (
                        <TableRow><TableCell colSpan={5} className="text-center">Carregando...</TableCell></TableRow>
                      ) : faturamentos.length > 0 ? (
                        faturamentos.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <img src={item.tenant.img} alt={item.tenant.nome} className="w-10 h-10 rounded-md object-cover" />
                            </TableCell>
                            <TableCell>{item.tenant.nome}</TableCell>
                            <TableCell>R$ {item.valorMensalidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                            <TableCell>R$ {item.valorImplantacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                            <TableCell>{format(new Date(item.created_at), 'dd/MM/yyyy')}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={5} className="text-center">Nenhum faturamento no período.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Card de Ações */}
              <div className="space-y-8">
                <Card className="shadow-lg border-0 animate-fade-in">
                  <CardHeader className="bg-gradient-to-r from-success-50 to-emerald-50 border-b">
                    <CardTitle className="flex items-center space-x-2 text-gray-800">
                      <DollarSign className="w-6 h-6" />
                      <span>Mensalidade Base</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-gray-800 mb-4">
                      {mensalidade !== null ? `R$ ${mensalidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A'}
                    </div>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Edit className="w-4 h-4 mr-2" />
                          Alterar Valores Base
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Valores Base</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="mensalidade-dialog">Valor da Mensalidade (R$)</Label>
                            <Input id="mensalidade-dialog" type="number" placeholder={`Atual: R$ ${mensalidade?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`} value={updatedMensalidade} onChange={(e) => setUpdatedMensalidade(e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor="implantacao-dialog">Valor da Implantação (R$)</Label>
                            <Input id="implantacao-dialog" type="number" placeholder={`Atual: R$ ${implantacao?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`} value={updatedImplantacao} onChange={(e) => setUpdatedImplantacao(e.target.value)} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                          <Button onClick={handleUpdateFaturamento}>Salvar Alterações</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 animate-fade-in">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                    <CardTitle className="flex items-center space-x-2 text-gray-800">
                      <DollarSign className="w-6 h-6" />
                      <span>Implantação Base</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-gray-800 mb-4">
                      {implantacao !== null ? `R$ ${implantacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
