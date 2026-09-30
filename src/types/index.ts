export type NavigationTab =
  | 'inicio'
  | 'modelos'
  | 'cotizador'
  | 'nosotros'
  | 'contacto'
  | 'visor360';

export interface ArchitecturalRoom {
  name: string;
  dimensions: string;
  surface: string;
  features: string[];
}

export interface HouseModel {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  surfaceCovered: number; // m²
  surfaceSemiCovered: number; // m²
  surfaceTotal: number; // m²
  bedrooms: number;
  bathrooms: number;
  roomsCount: number;
  deliveryTimeDays: number;
  basePriceUSD: number;
  mainImage: string;
  galleryImages: string[];
  floorPlanImage: string;
  floorPlanType: '2d' | '3d-cutaway';
  has360Tour: boolean;
  idealFor: string[];
  keyFeatures: string[];
  roomsBreakdown: ArchitecturalRoom[];
  description: string;
}

export interface FinishingTier {
  id: 'obra-gris' | 'estandar' | 'premium';
  name: string;
  subtitle: string;
  description: string;
  multiplier: number; // multiplier over base or price adjustment
  pricePerM2USD: number;
  includedItems: string[];
  recommendedFor: string;
}

export interface MaterialOption {
  id: string;
  category: 'aberturas' | 'pisos' | 'exterior' | 'climatizacion';
  categoryLabel: string;
  name: string;
  description: string;
  priceDeltaUSD: number;
  isDefault?: boolean;
}

export interface OptionalItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceUSD: number;
  unitLabel?: string;
}

export interface QuotationSelection {
  modelId: string;
  finishingTierId: FinishingTier['id'];
  materials: {
    aberturas: string;
    pisos: string;
    exterior: string;
    climatizacion: string;
  };
  selectedOptionals: string[];
}

export interface QuotationResult {
  model: HouseModel;
  finishingTier: FinishingTier;
  basePrice: number;
  tierDelta: number;
  materialsTotal: number;
  materialsBreakdown: { category: string; name: string; price: number }[];
  optionalsTotal: number;
  optionalsBreakdown: { name: string; price: number }[];
  totalEstimatedUSD: number;
  pricePerM2USD: number;
  estimatedDeliveryMonths: number;
}

export interface LeadFormData {
  fullName: string;
  whatsapp: string;
  email: string;
  location: string;
  hasLot: 'si-monte-hermoso' | 'busco-lote-monte-hermoso' | 'otra-localidad' | 'no-tengo';
  modelInterest: string;
  constructionPurpose: 'segunda-residencia' | 'inversion-turistica' | 'vivienda-permanente';
  message: string;
  quotationSummary?: QuotationResult;
}
