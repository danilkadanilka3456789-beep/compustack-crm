
export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  CLIENTS = 'CLIENTS',
  PRODUCTS = 'PRODUCTS',
  ORDERS = 'ORDERS'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  status: 'active' | 'lead' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  items: string[];
  total: number;
  status: 'Pending' | 'Assembling' | 'Shipped' | 'Completed';
  date: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}
