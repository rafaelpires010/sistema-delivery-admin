import axios from "axios";
import Cookies from "js-cookie";
import { User } from "@/types/restaurant";

export const ApiUrl = import.meta.env.VITE_API_BASE_URL;
console.log("API URL:", ApiUrl);
const pasta = "super-admin";

const apiInstance = axios.create({
  baseURL: ApiUrl,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("@deliveryapp-manager:token");
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  createTenant: async (form: FormData) => {
    try {
      const response = await apiInstance.post(`/${pasta}/create-tenant`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
  getTenants: async () => {
    try {
      const response = await apiInstance.get(`/${pasta}/tenants`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar os tenants:", error);
      return null;
    }
  },
  getTenantById: async (id: string) => {
    try {
      const response = await apiInstance.get(`/${pasta}/tenant/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar o tenant com ID ${id}:`, error);
      return null;
    }
  },
  getUsers: async (tenantId: number) => {
    try {
      const response = await apiInstance.get(`/super-admin/users/${tenantId}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(
        `Erro ao buscar usuários para o tenant ${tenantId}:`,
        error
      );
      return [];
    }
  },
  login: async (email: string, senha: string) => {
    try {
      const response = await apiInstance.post(`/${pasta}/signin`, {
        email,
        senha,
      });

      if (
        response.status === 200 &&
        response.data.token &&
        response.data.user
      ) {
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return { error: "Erro ao fazer login" };
    }
  },
  authorizeToken: async (token: string): Promise<User | false> => {
    if (!token) return false;

    try {
      const response = await apiInstance.post(
        `/authorize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.user) {
        const user: User = response.data.user;
        return user;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao autorizar token:", error);
      return false;
    }
  },
  createTenantInfoEnder: async (tenantId: number, data: any) => {
    try {
      const response = await apiInstance.post(
        `/${pasta}/create-tenant-infoEnder/${tenantId}`,
        data
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
  createTenantFunc: async (tenantId: number, data: any) => {
    try {
      const response = await apiInstance.post(
        `/${pasta}/create-tenant-func/${tenantId}`,
        data
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
  createUser: async (data: any) => {
    try {
      const response = await apiInstance.post(`/${pasta}/create-user`, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
  toggleUserStatus: async (userId: number, tenantIds: number[]) => {
    try {
      const response = await apiInstance.put(
        `/${pasta}/toggle-user-status/${userId}`,
        { tenantIds }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
  toggleTenantStatus: async (tenantId: number, data: any) => {
    try {
      const response = await apiInstance.put(
        `/${pasta}/toggle-tenant-status/${tenantId}`,
        data
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
  getValorFaturamento: async (userId: number) => {
    try {
      const response = await apiInstance.get(`/${pasta}/faturamento/${userId}`);
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
  updateValorFaturamento: async (
    userId: number,
    data: { valorMensalidade?: number; valorImplantacao?: number }
  ) => {
    try {
      const response = await apiInstance.put(
        `/${pasta}/faturamento/${userId}`,
        data
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
  getFaturamentoTotal: async (
    userId: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await apiInstance.get(
        `/${pasta}/faturamento-total/${userId}`,
        {
          params: { startDate, endDate },
        }
      );
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
  getCrescimento: async (userId: number) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    try {
      const response = await apiInstance.get(
        `/${pasta}/faturamento-growth/${userId}`,
        {
          params: { month, year },
        }
      );
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return { success: false, message: error.response.data.message };
      } else {
        return {
          success: false,
          message: "Ocorreu um erro de comunicação. Verifique sua conexão.",
        };
      }
    }
  },
};
