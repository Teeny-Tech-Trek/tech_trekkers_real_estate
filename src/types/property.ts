// src/types/property.ts

export type PropertyStatus = "available" | "sold" | "pending";
export type PropertyType = "single_family" | "multi_family" | "apartment" | "condo";
export type MarketTrend = "stable" | "upward" | "downward";
export type PopulationDensity = "low" | "medium" | "high";
export type HazardLevel = "very_low" | "low" | "medium" | "high" | "very_high";

// Hazard object
export interface Hazard {
  type: string;          // e.g., 'flood', 'earthquake'
  level: HazardLevel;    // severity
  description: string;   // optional note
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

export interface Demographics {
  averageAge: number;
  averageIncome: string;
  familyRatio: number;
  education: string;
  populationDensity: PopulationDensity;
}

export interface Amenities {
  transit: string[];
  education: string[];
  shopping: string[];
  parks: string[];
  healthcare: string[];
  other: string[];
}

export interface MarketInsights {
  daysOnMarket: number;
  pricePerSqFt: number;
  comparableSales: number;
  marketTrend: MarketTrend;
  avgDaysOnMarket: number;
}

export interface Financials {
  monthlyRent: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  hoa: number;
}

export interface OwnerInfo {
  name: string;
  email: string;
  phone: string;
  since: string;
}

export interface Property {
  id: string;
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
  createdAt: string;
  analytics: Analytics;
  hazards: Hazard;         // ✅ changed from string[] to Hazard[]
  demographics: Demographics;
  amenities: Amenities;
  marketInsights: MarketInsights;
  financials: Financials;
  ownerInfo: OwnerInfo;
}
