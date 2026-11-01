export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface Product {
  _id: string;
  productName: string;
  productDescription?: string;
  productCategory: string;
  description?: string;
  category?: string;
  productImages?: string[];
  images?: string[];
  productVideos?: string[];
  vendorId: string;
  currentPrice?: number;
  price?: number;
  createdAt?: string;
}

export interface Review {
  _id: string;
  userId: string;
  productId: string;
  productName?: string;
  userName?: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price?: number;
  productName?: string;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  totalAmount?: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName?: string;
  vendorId?: string;
}

export interface Order {
  _id: string;
  userId: string;
  productId?: string;
  productName?: string;
  vendorId?: string;
  quantity?: number;
  items?: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  createdAt: string;
}

export interface Offer {
  _id: string;
  vendorId: string;
  offerCode: string;
  discountPercent: number;
  validUntil: string;
  createdAt?: string;
}

export interface ExportJob {
  jobId: string;
  vendorId?: string;
  status: string;
  progress?: number;
  totalProducts?: number;
  processedProducts?: number;
  zipPath?: string | null;
  error?: string | null;
  checkStatusUrl?: string;
  downloadUrl?: string;
  createdAt: string;
}

export interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  role: "user" | "vendor" | null;
  isLoading: boolean;
  networkError: string | null;
  login: (token: string, user: User, role: "user" | "vendor", refreshToken?: string) => void;
  logout: () => void;
  retrySession: () => Promise<void>;
}

export interface PriceRecord {
  _id: string;
  productId: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
