import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Restaurant, RestaurantAdmin } from "@/types/restaurant";
import { api } from "@/lib/useApi";
import { Users, Plus, Mail, Save, Loader2, Eye, Key, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

interface RestaurantAdminsProps {
  restaurant: Restaurant;
  admins: RestaurantAdmin[];
  onAdminCreated: (newAdmin: RestaurantAdmin) => void;
  onToggleStatus: (adminId: number) => Promise<void>;
}

export const RestaurantAdmins = ({ restaurant, admins, onAdminCreated, onToggleStatus }: RestaurantAdminsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<RestaurantAdmin | null>(null);

  const [newAdmin, setNewAdmin] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
    cargo: 'proprietario'
  });

  const handleAddAdmin = async () => {
    if (!newAdmin.nome || !newAdmin.email || !newAdmin.password || !newAdmin.confirmPassword || !newAdmin.telefone) {
      toast.error("Preencha todos os campos obrigatórios.", {
        style: {
          backgroundColor: '#fff1f2',
          color: '#ef4444'
        }
      });
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      toast.error("As senhas não coincidem.", {
        style: {
          backgroundColor: '#fff1f2',
          color: '#ef4444'
        }
      });
      return;
    }

    setIsLoading(true);

    const data = {
      nome: newAdmin.nome,
      email: newAdmin.email,
      telefone: newAdmin.telefone,
      senha: newAdmin.password,
      tenants: [{
        tenantId: restaurant.id,
        cargo: newAdmin.cargo,
      }],
    }

    const result = await api.createUser(data);

    if (result.success) {
      const newAdminForState = {
        ...result.data,
        cargo: newAdmin.cargo,
      };

      onAdminCreated(newAdminForState);
      setNewAdmin({ nome: '', email: '', password: '', confirmPassword: '', telefone: '', cargo: 'proprietario' });
      setIsDialogOpen(false);
      toast.success(`${newAdmin.nome} foi adicionado como administrador.`);
    } else {
      toast.error("Erro ao adicionar administrador.", {
        description: result.message,
        style: {
          backgroundColor: '#fff1f2',
          color: '#ef4444'
        }
      });
    }
    setIsLoading(false);
  };

  const handleToggleClick = (admin: RestaurantAdmin) => {
    if (admin.active) {
      setSelectedAdmin(admin);
      setIsAlertOpen(true);
    } else {
      onToggleStatus(admin.id);
    }
  };

  const handleConfirmToggle = () => {
    if (selectedAdmin) {
      onToggleStatus(selectedAdmin.id);
    }
    setIsAlertOpen(false);
    setSelectedAdmin(null);
  };

  const getRoleLabel = (cargo: string) => {
    const roles: { [key: string]: string } = { admin: 'Admin', staff: 'Funcionário' };
    return roles[cargo] || cargo.charAt(0).toUpperCase() + cargo.slice(1);
  };

  const getRoleBadgeVariant = (cargo: string) => {
    const variants: { [key: string]: "default" | "secondary" | "outline" } = { admin: 'default', staff: 'outline' };
    return variants[cargo] || 'secondary';
  };

  return (
    <>
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-800">
              <Users className="w-5 h-5" />
              <span>Administradores</span>
              <Badge variant="secondary">{admins.length} usuário(s)</Badge>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-2" />Adicionar Novo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Novo Proprietário</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="admin-name">Nome *</Label>
                    <Input id="admin-name" value={newAdmin.nome} onChange={(e) => setNewAdmin({ ...newAdmin, nome: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="admin-email">E-mail *</Label>
                    <Input id="admin-email" type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="admin-telefone">Telefone *</Label>
                    <Input id="admin-telefone" type="text" value={newAdmin.telefone} onChange={(e) => setNewAdmin({ ...newAdmin, telefone: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Senha *</Label>
                    <Input id="admin-password" type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="admin-confirm-password">Confirmar Senha *</Label>
                    <Input id="admin-confirm-password" type="password" value={newAdmin.confirmPassword} onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })} />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddAdmin} disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Adicionar Proprietário'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {admins.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum administrador cadastrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center space-x-3">
                    <div>
                      <span className="font-medium text-gray-900">{admin.nome}</span>
                      <Badge variant={getRoleBadgeVariant(admin.cargo)} className="ml-2">{getRoleLabel(admin.cargo)}</Badge>
                      <p className="text-sm text-gray-600 flex items-center space-x-1"><Mail className="w-3 h-3" /><span>{admin.email}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={admin.active ? 'default' : 'secondary'} className={admin.active ? 'bg-success-100 text-success-800' : 'bg-red-100 text-red-800'}>
                      {admin.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleToggleClick(admin)}>
                      {admin.active ? <ToggleLeft className="w-5 h-5 text-success-500" /> : <ToggleRight className="w-5 h-5 text-red-500" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá inativar o usuário "{selectedAdmin?.nome}". Ele perderá o acesso ao sistema até que seja reativado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAdmin(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggle}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
