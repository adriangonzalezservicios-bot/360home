import { FinishingTier, MaterialOption, OptionalItem } from '../types';

/**
 * CONFIGURACIÓN DE PRECIOS DESACOPLADA (MHC STEEL FRAME)
 *
 * Preparado para conectarse directamente a una API externa, Google Sheets
 * o Google Drive sin alterar componentes visuales ni la lógica de cálculo.
 */

export const PRICING_METADATA = {
  currency: 'USD',
  currencySymbol: 'U$S',
  priceValidUntil: '2026-12-31',
  costPerM2Average: 750,
  disclaimer:
    'Los valores expresados constituyen una Estimación de Inversión y Cotización Estimativa orientativa en dólares estadounidenses (USD) para construcción en Monte Hermoso y zona. La cotización definitiva requiere visita técnica y validación del lote por parte del equipo de arquitectura e ingeniería de MHC.',
  version: '2026.1-sheet-ready'
};

export const FINISHING_TIERS: FinishingTier[] = [
  {
    id: 'obra-gris',
    name: 'Obra Gris Avanzada',
    subtitle: 'Estructura e Instalaciones listas para terminar a tu gusto',
    description:
      'Incluye platea de fundación, estructura completa Steel Frame galvanizada, barreras hidrófugas y térmicas, emplacados interiores y exteriores, e instalaciones completas (agua termofusión, desagües y electricidad) listas para conectar artefactos.',
    multiplier: 0.72,
    pricePerM2USD: 520,
    includedItems: [
      'Cálculo estructural y platea de hormigón armado según estudio de suelo',
      'Estructura de perfiles de acero galvanizado PGC y PGU de alta resistencia',
      'Emplacado OSB estructural exterior + membrana hidrófuga Tyvek / Wichi',
      'Aislación térmica con lana de vidrio con foil de aluminio (100 mm)',
      'Placas de yeso estándar y antihumedad en baños y cocina',
      'Instalación eléctrica con cañerías corrugadas normalizadas, cableado y tablero',
      'Instalación de agua fría y caliente en termofusión y desagües cloacales Awaduct'
    ],
    recommendedFor: 'Propietarios que cuentan con gremios propios de terminación o desean realizar la fase final por etapas.'
  },
  {
    id: 'estandar',
    name: 'Llave en Mano Estándar',
    subtitle: 'Vivienda 100% terminada, equipada y lista para habitar',
    description:
      'Nuestra opción más elegida para casas de veraneo. Entrega con pisos colocados, aberturas de aluminio con doble vidriado hermético (DVH), pintura completa, sanitarios, griferías y mueble de cocina bajo mesada.',
    multiplier: 1.0,
    pricePerM2USD: 720,
    includedItems: [
      'Todo lo incluido en Obra Gris Avanzada',
      'Aberturas de aluminio anodizado línea Módena con Doble Vidriado Hermético (DVH 4+9+4)',
      'Pisos y revestimientos cerámicos esmaltados primera calidad en todos los ambientes',
      'Pintura interior al látex profesional lavable y exterior elastomérico texturado',
      'Artefactos sanitarios completos marca Ferrum o Roca con mochila dual',
      'Griferías monocomando marca FV con cierre cerámico',
      'Mueble bajo mesada en melamina 18 mm con herrajes metálicos y mesada de granito Gris Mara',
      'Termotanque solar con resistencia eléctrica de apoyo para ahorro energético'
    ],
    recommendedFor: 'Segunda residencia de veraneo y renta turística tradicional con la mejor relación costo-calidad.'
  },
  {
    id: 'premium',
    name: 'Llave en Mano Premium',
    subtitle: 'Acabados de autor, carpinterías de alta gama y confort superior',
    description:
      'Para quienes buscan el estándar constructivo más alto de Monte Hermoso. Incorpora porcelanatos rectificados de gran formato, carpinterías A30 New con ruptura de puente térmico, mobiliario a medida y equipamiento de diseño.',
    multiplier: 1.25,
    pricePerM2USD: 900,
    includedItems: [
      'Todo lo incluido en Llave en Mano Estándar con jerarquización de materiales',
      'Carpinterías de aluminio pesado Aluar A30 New Negro Mate con Doble Vidriado Hermético de seguridad',
      'Pisos en porcelanato rectificado 60×120 cm o vinílico SPC símil madera de alto tránsito',
      'Mobiliario de cocina premium con alacenas, isla central y mesadas en granito Negro Brasil o cuarzo',
      'Sanitarios de diseño suspendidos o línea premium y griferías de autor negro mate / acero cepillado',
      'Frentes e interiores de placard completos a medida en melamina touch texturada',
      'Iluminación LED arquitectónica embutida en cielorrasos y gargantas de luz difusa',
      'Aislación termoacústica reforzada en lana mineral de 120 mm para eficiencia energética Clase A'
    ],
    recommendedFor: 'Viviendas permanentes o de veraneo de máxima categoría y propiedades para alquiler turístico VIP.'
  }
];

export const MATERIAL_OPTIONS: MaterialOption[] = [
  // Aberturas
  {
    id: 'ab-modena',
    category: 'aberturas',
    categoryLabel: 'Aberturas & Carpinterías',
    name: 'Aluminio Aluar Módena DVH (Negro / Anodizado)',
    description: 'Doble vidriado hermético 4/9/4 mm con cierre hermético y felpas perimetrales.',
    priceDeltaUSD: 0,
    isDefault: true
  },
  {
    id: 'ab-a30',
    category: 'aberturas',
    categoryLabel: 'Aberturas & Carpinterías',
    name: 'Aluar A30 New DVH de Alta Prestación',
    description: 'Perfiles reforzados para grandes paños de vidrio expuestos al viento costero, vidrios laminados de seguridad.',
    priceDeltaUSD: 2400
  },
  {
    id: 'ab-pvc',
    category: 'aberturas',
    categoryLabel: 'Aberturas & Carpinterías',
    name: 'PVC Alemán con Ruptura de Puente Térmico (Simil Madera / Grafito)',
    description: 'Máximo coeficiente de aislación térmica y acústica para la costa atlántica, nula corrosión salina.',
    priceDeltaUSD: 4200
  },

  // Pisos
  {
    id: 'pi-porcelanato-60',
    category: 'pisos',
    categoryLabel: 'Pisos & Revestimientos',
    name: 'Porcelanato Satinado 60×60 cm Neutro',
    description: 'Resistente a la arena, fácil limpieza, acabado mate en tonos cemento o arena cálido.',
    priceDeltaUSD: 0,
    isDefault: true
  },
  {
    id: 'pi-porcelanato-gran-formato',
    category: 'pisos',
    categoryLabel: 'Pisos & Revestimientos',
    name: 'Porcelanato Rectificado 60×120 cm Primera Selección',
    description: 'Juntas mínimas casi imperceptibles, estética contemporánea y continua.',
    priceDeltaUSD: 1800
  },
  {
    id: 'pi-spc',
    category: 'pisos',
    categoryLabel: 'Pisos & Revestimientos',
    name: 'Piso Vinílico SPC Rígido Click Símil Madera Natural',
    description: '100% resistente al agua y humedad, pisada cálida descalzo, ideal para casas de playa.',
    priceDeltaUSD: 2100
  },

  // Exterior
  {
    id: 'ext-eifs',
    category: 'exterior',
    categoryLabel: 'Terminación de Fachada Exterior',
    name: 'Sistema EIFS con Revoque Acrílico Texturado Elastomérico',
    description: 'Aislación exterior continua que elimina puentes térmicos. Color y textura a elección.',
    priceDeltaUSD: 0,
    isDefault: true
  },
  {
    id: 'ext-chapa-negra',
    category: 'exterior',
    categoryLabel: 'Terminación de Fachada Exterior',
    name: 'Combinación EIFS + Chapa Sinusoidal Prepintada Negra Mate',
    description: 'Diseño nórdico industrial contemporáneo de gran durabilidad y nulo mantenimiento.',
    priceDeltaUSD: 1900
  },
  {
    id: 'ext-siding-madera',
    category: 'exterior',
    categoryLabel: 'Terminación de Fachada Exterior',
    name: 'Combinación EIFS + Siding de Fibrocemento Texturado Símil Madera',
    description: 'Calidez estética de la madera con la resistencia indestructible del fibrocemento.',
    priceDeltaUSD: 2500
  },

  // Climatización
  {
    id: 'clim-preinstalacion',
    category: 'climatizacion',
    categoryLabel: 'Climatización & Confort',
    name: 'Preinstalación Completa de Cañerías para Aire Split',
    description: 'Cañerías de cobre aisladas, desagües embutidos y tomas eléctricas en dormitorios y estar.',
    priceDeltaUSD: 0,
    isDefault: true
  },
  {
    id: 'clim-split-inverter',
    category: 'climatizacion',
    categoryLabel: 'Climatización & Confort',
    name: 'Equipos Split Inverter Frío/Calor Instalados en Todos los Ambientes',
    description: 'Equipos silenciosos de bajo consumo energético Clase A++ para confort todo el año.',
    priceDeltaUSD: 3600
  },
  {
    id: 'clim-losa-radiante',
    category: 'climatizacion',
    categoryLabel: 'Climatización & Confort',
    name: 'Losa Radiante Eléctrica Sectorizada con Termostatos Wi-Fi',
    description: 'Calefacción invisible y confortable desde el piso, controlable a distancia desde el celular.',
    priceDeltaUSD: 4900
  }
];

export const OPTIONAL_ITEMS: OptionalItem[] = [
  {
    id: 'opt-galeria-asador',
    name: 'Galería Semicubierta con Asador Completo',
    category: 'Exterior y Quincho',
    description: 'Pérgola metálica con cubierta impermeable, parrilla tradicional con tiraje a los 4 vientos, mesada de apoyo y piso antideslizante.',
    priceUSD: 7500
  },
  {
    id: 'opt-pergola-vehicular',
    name: 'Pérgola Cochera para 1 o 2 Vehículos',
    category: 'Cochera',
    description: 'Estructura de perfiles de acero o madera dura tratada con protección contra granizo y rayos UV.',
    priceUSD: 3800
  },
  {
    id: 'opt-deck-madera',
    name: 'Deck Perimetral en Madera Tratada / WPC Libre Mantenimiento',
    category: 'Exteriores',
    description: 'Expansión exterior de 25 m² para solárium y estar al aire libre.',
    priceUSD: 3200
  },
  {
    id: 'opt-piscina-climatizada',
    name: 'Piscina de Fibra o Hormigón 6.00 × 3.00 m con Equipo Completo',
    category: 'Amenities',
    description: 'Incluye bomba, filtro Vulcano, luminarias LED subacuáticas, losetas atérmicas perimetrales e instalación hidráulica.',
    priceUSD: 9800
  },
  {
    id: 'opt-solar-fotovoltaico',
    name: 'Sistema Solar Fotovoltaico On-Grid 3 kWp + Batería de Respaldo',
    category: 'Sustentabilidad',
    description: 'Reduce la factura eléctrica hasta un 80% y asegura suministro continuo ante cortes en temporada alta.',
    priceUSD: 5400
  },
  {
    id: 'opt-parquizacion-riego',
    name: 'Parquización con Césped Grama Bahiana y Riego Automático',
    category: 'Paisajismo',
    description: 'Nivelación del terreno, colocación de panes de grama aptos para suelo arenoso y sistema de aspersión con toberas Hunter.',
    priceUSD: 2900
  }
];
