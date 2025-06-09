export interface TenantInfo {
  id: number;
  cnpj: string;
  telefone: string;
  whatsapp: string;
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  bairro: string;
  instagram: string;
  complemento?: string;
  latitude?: number;
  longitude?: number;
  tenantId: number;
}

export interface TenantFuncionamento {
  id: number;
  segOpen: string;
  segClose: string;
  terOpen: string;
  terClose: string;
  quarOpen: string;
  quarClose: string;
  quinOpen: string;
  quinClose: string;
  sexOpen: string;
  sexClose: string;
  sabOpen: string;
  sabClose: string;
  domOpen: string;
  domClose: string;
  tenantId: number;
}

export interface Restaurant {
  id: number;
  nome: string;
  slug: string;
  status: boolean;
  OnClose: boolean;
  main_color: string;
  second_color: string;
  img?: string;
  limite_pdvs?: number;
  tenantInfo?: TenantInfo;
  tenantFuncionamento?: TenantFuncionamento;
  admins?: RestaurantAdmin[];
}

export interface CreateRestaurantData {
  nome: string;
  slug: string;
  main_color: string;
  second_color: string;
  img?: File;
}

export interface RestaurantAdmin {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cargo: string;
  active: boolean;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  active: boolean;
  tenants: string[];
}
