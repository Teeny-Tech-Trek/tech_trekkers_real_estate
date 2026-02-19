export type PropertyStatus = 'available' | 'sold' | 'pending' | 'draft';
export type PropertyType =
  | 'single_family'
  | 'multi_family'
  | 'apartment'
  | 'condo'
  | 'townhouse'
  | 'commercial'
  | 'land';
export type HazardLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

export interface Hazard {
  type: string;
  level: HazardLevel;
  description: string;
}

export interface Analytics {
  riskScore: number;
  investmentPotential: number;
  rentalYield: number;
  appreciation: number;
  demandScore: number;
  marketValue: number;
  pricePerSqFt: number;
}

export interface Amenities {
  transit: string[];
  education: string[];
  shopping: string[];
  parks: string[];
  healthcare: string[];
  other: string[];
}

export interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  status: PropertyStatus;
  type: PropertyType;
  yearBuilt: number;
  images: string[];
  imageVariants?: Array<{
    id?: string;
    thumb: string;
    medium: string;
    full: string;
    originalName?: string;
  }>;
  description: string;
  leads: number;
  views: number;
  conversions?: number;
  favorite: boolean;
  createdAt: string;
  analytics: Analytics;
  hazards: Hazard[];
  amenities: Amenities;
  createdBy?: string;
  organization?: string | null;
}

export interface PropertyMutationPayload {
  title: string;
  price: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  status: PropertyStatus;
  type: PropertyType;
  yearBuilt: number;
  images: string[];
  description: string;
  leads: number;
  views: number;
  favorite: boolean;
  analytics: Analytics;
  hazards: Hazard[];
  amenities: Amenities;
}
