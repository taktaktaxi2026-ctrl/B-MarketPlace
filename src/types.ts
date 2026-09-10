export type Language = 'fr' | 'ha' | 'za';

export interface Seller {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  whatsapp: string;
  city: string;
  quartier: string;
  rating: number;
  salesCount: number;
  isVerified: boolean;
  isTrialPeriod: boolean; // 0% commission trial
  avatarUrl?: string;
  pickupPoint: string;
  latitude: number;
  longitude: number;
}

export interface Product {
  id: string;
  title: string;
  titleHausa?: string;
  titleZarma?: string;
  description: string;
  descriptionHausa?: string;
  descriptionZarma?: string;
  category: 'artisanat' | 'agriculture' | 'mode' | 'alimentation' | 'electronique' | 'maison';
  priceFcfa: number;
  sellerId: string;
  seller: Seller;
  imageUrl: string;
  isFeatured: boolean; // Vedette Niger
  stock: number;
  regionOrigin: string; // Ex: Agadez, Maradi, Tahoua, Niamey, Dosso, Zinder
  tags: string[];
  pointsEarned: number; // Barewa Points
  embedding?: number[];
  similarity?: number;
  searchExplanation?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'orange_money' | 'moov_flooz' | 'wave' | 'cash_on_delivery';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotalFcfa: number;
  deliveryFeeFcfa: number;
  totalFcfa: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryStatus: 'assigned' | 'picked_up' | 'on_the_way' | 'delivered';
  courier?: TakTakCourier;
  pointsEarned: number;
}

export interface TakTakCourier {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'moto' | 'tricycle' | 'taxi';
  vehiclePlate: string;
  rating: number;
  completedDeliveries: number;
  currentLocationName: string;
  currentLat: number;
  currentLng: number;
}

export interface BarewaMapPoint {
  id: string;
  name: string;
  type: 'pickup_hub' | 'market' | 'artisan_cluster';
  quartier: string;
  city: string;
  lat: number;
  lng: number;
  openHours: string;
  contact: string;
}
