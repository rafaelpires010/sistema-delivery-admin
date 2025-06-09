import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Home, Store, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Restaurantes",
    url: "/restaurants",
    icon: Store,
  },
  {
    title: "Novo Restaurante",
    url: "/restaurants/new",
    icon: Plus,
  },
]

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-gradient-to-b from-admin-50 to-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-admin-500 to-admin-600 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">DeliveryApp</h1>
            <p className="text-sm text-gray-500">Gestor</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-medium">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`hover:bg-admin-100 hover:text-admin-800 transition-colors duration-200 ${location.pathname === item.url ? 'bg-admin-100 text-admin-800' : ''
                      }`}
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="flex items-center space-x-3 p-3 rounded-lg w-full text-left"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex flex-col items-center text-center mb-4">
          <span className="font-semibold text-gray-800">{user?.nome}</span>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
