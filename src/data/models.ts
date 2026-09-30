import { HouseModel } from '../types';

export const HOUSE_MODELS: HouseModel[] = [
  {
    id: 'modelo-01',
    name: 'MODELO 01',
    tagline: 'Vivienda compacta contemporánea con optimización espacial integral',
    badge: 'Recorrido 360° Activo',
    surfaceCovered: 84,
    surfaceSemiCovered: 26,
    surfaceTotal: 110,
    bedrooms: 2,
    bathrooms: 1,
    roomsCount: 4,
    deliveryTimeDays: 120,
    basePriceUSD: 58800, // ~700 USD/m² base Steel Frame
    mainImage: '/foto-frente-plana.jpg',
    galleryImages: [
      '/foto-frente-plana.jpg',
      '/foto-lateral-plana.jpg',
      '/foto-trasera-plana.jpg',
      '/foto-esquina-plana.jpg',
      '/foto-dusk-plana.jpg',
      '/foto-interior-plana.jpg',
      '/foto-dormitorio-plana.jpg',
      '/foto-dorm2-plana.jpg',
      '/foto-bano-plana.jpg'
    ],
    floorPlanImage: '/corte-isometrico-3d.jpg',
    floorPlanType: '3d-cutaway',
    has360Tour: true,
    idealFor: [
      'Segunda residencia de veraneo en Monte Hermoso',
      'Inversión de alta rentabilidad en alquiler turístico temporal',
      'Parejas o familias de hasta 4 integrantes'
    ],
    keyFeatures: [
      'Estructura Steel Frame PGC/PGU galvanizado de alta resistencia',
      'Aislación termoacústica reforzada para clima marítimo (Lana de vidrio + EPS)',
      'Carpinterías DVH de aluminio negro con ruptura de puente térmico',
      'Galería semicubierta integrada con pérgola de sombra y asador',
      'Planta baja libre de escaleras con máxima eficiencia de circulación'
    ],
    roomsBreakdown: [
      {
        name: 'Estar / Comedor / Cocina Integrada',
        dimensions: '6.45 × 4.20 m',
        surface: '27.10 m²',
        features: ['Isla desayunadora', 'Abertura corrediza a galería', 'Ventilación cruzada']
      },
      {
        name: 'Dormitorio Principal',
        dimensions: '3.60 × 3.35 m',
        surface: '12.05 m²',
        features: ['Espacio para cama King', 'Placard empotrado', 'Orientación jardín']
      },
      {
        name: 'Dormitorio Secundario / Huéspedes',
        dimensions: '3.30 × 3.35 m',
        surface: '11.05 m²',
        features: ['Capacidad 2 camas individuales', 'Placard embutido', 'Luz natural matinal']
      },
      {
        name: 'Baño Completo Compartimentado',
        dimensions: '2.40 × 1.85 m',
        surface: '4.44 m²',
        features: ['Antebaño vanitory flotante', 'Box de ducha con mampara', 'Grifería monocomando']
      },
      {
        name: 'Galería Semicubierta con Asador',
        dimensions: '7.50 × 3.45 m',
        surface: '25.90 m²',
        features: ['Parrilla tradicional con tiraje', 'Pérgola metálica', 'Piso antideslizante']
      }
    ],
    description:
      'Diseñado específicamente para el paisaje costero de Monte Hermoso, el Modelo 01 combina líneas puras, eficiencia bioclimática y bajo mantenimiento. Su distribución en planta baja elimina circulaciones innecesarias, maximizando el espacio de vida social y conectando el interior con la galería exterior semicubierta.'
  },
  {
    id: 'modelo-02',
    name: 'MODELO 02',
    tagline: 'Amplitud, suite independiente y galería quincho para estadías prolongadas',
    badge: 'Ideal Familiar',
    surfaceCovered: 118,
    surfaceSemiCovered: 34,
    surfaceTotal: 152,
    bedrooms: 3,
    bathrooms: 2,
    roomsCount: 5,
    deliveryTimeDays: 140,
    basePriceUSD: 82600, // ~700 USD/m²
    mainImage: '/mhc-modelo-02.jpg',
    galleryImages: [
      '/mhc-modelo-02.jpg',
      '/foto-interior-plana.jpg',
      '/foto-lateral-plana.jpg',
      '/foto-dusk-plana.jpg'
    ],
    floorPlanImage: '/corte-isometrico-3d.jpg',
    floorPlanType: '2d',
    has360Tour: false,
    idealFor: [
      'Familias de 5 a 6 integrantes para vacaciones o residencia permanente',
      'Inversores buscando maximizar la tarifa diaria de alquiler premium',
      'Lotes a partir de 350 m² en Monte Hermoso o Sauce Grande'
    ],
    keyFeatures: [
      'Master Suite con vestidor y baño privado zonificado',
      'Gran salón con techos de 3.00 m de altura libre y ventanales apaisados',
      'Sector quincho semicubierto con barra, mesada exterior y parrilla',
      'Lavadero independiente y despensa de guardado',
      'Doble cochera semicubierta con pérgola de madera dura y acero'
    ],
    roomsBreakdown: [
      {
        name: 'Gran Salón Living - Comedor',
        dimensions: '7.80 × 4.60 m',
        surface: '35.88 m²',
        features: ['Techo sobreelevado', 'Conexión a deck exterior', 'Espacio para estufa a leña']
      },
      {
        name: 'Cocina con Isla Gourmet',
        dimensions: '3.80 × 3.20 m',
        surface: '12.16 m²',
        features: ['Mesadas de Silestone/granito', 'Campana extractora isla', 'Despensa anexa']
      },
      {
        name: 'Master Suite + Vestidor + Baño',
        dimensions: '4.80 × 3.60 m',
        surface: '17.28 m²',
        features: ['Baño en suite con antebaño doble bacha', 'Vestidor pasante', 'Salida a jardín']
      },
      {
        name: 'Dormitorio 2 y 3 (Hijos/Huéspedes)',
        dimensions: '3.40 × 3.20 m c/u',
        surface: '21.76 m²',
        features: ['Placares de piso a techo', 'Ventanas corredizas DVH', 'Aislación acústica']
      },
      {
        name: 'Galería Quincho + Parrilla',
        dimensions: '8.50 × 4.00 m',
        surface: '34.00 m²',
        features: ['Mesada con pileta', 'Parrilla completa con leñero', 'Cierres enrollables optativos']
      }
    ],
    description:
      'El Modelo 02 eleva la experiencia de habitar la costa. Con 118 m² cubiertos inteligentemente resueltos en una sola planta, separa el ala privada de los dormitorios del sector social de recepción, brindando intimidad y comodidad tanto para una residencia permanente como para vacaciones familiares inolvidables.'
  },
  {
    id: 'modelo-03',
    name: 'MODELO 03',
    tagline: 'Residencia en doble altura con terraza panorámica hacia médanos y mar',
    badge: 'Diseño Exclusivo',
    surfaceCovered: 145,
    surfaceSemiCovered: 42,
    surfaceTotal: 187,
    bedrooms: 3,
    bathrooms: 3,
    roomsCount: 6,
    deliveryTimeDays: 160,
    basePriceUSD: 104400, // ~720 USD/m²
    mainImage: '/mhc-modelo-03.jpg',
    galleryImages: [
      '/mhc-modelo-03.jpg',
      '/foto-frente-plana.jpg',
      '/foto-interior-plana.jpg',
      '/foto-dusk-plana.jpg'
    ],
    floorPlanImage: '/corte-isometrico-3d.jpg',
    floorPlanType: '2d',
    has360Tour: false,
    idealFor: [
      'Vivienda permanente de alto estándar o casa de playa exclusiva',
      'Lotes con desnivel o vistas privilegiadas a los médanos en Monte Hermoso',
      'Usuarios que valoran volumetrías escultóricas contemporáneas'
    ],
    keyFeatures: [
      'Volumetría contemporánea con voladizos estructurales en Steel Frame',
      'Planta alta exclusiva para suite principal con terraza mirador',
      'Estar principal con doble altura vidriada y visuales en 180°',
      'Tres baños completos con revestimientos continuos y grifería de diseño',
      'Cochera doble semicubierta pasante con acceso de servicio'
    ],
    roomsBreakdown: [
      {
        name: 'Estar Principal en Doble Altura',
        dimensions: '8.20 × 5.00 m',
        surface: '41.00 m²',
        features: ['Altura libre 5.60 m', 'Carpinterías piso a techo', 'Iluminación escenográfica']
      },
      {
        name: 'Cocina & Comedor Diario',
        dimensions: '4.50 × 3.50 m',
        surface: '15.75 m²',
        features: ['Isla central con anafe', 'Mobiliario laqueado premium', 'Lavadero independiente']
      },
      {
        name: 'Suite Presidencial (Planta Alta)',
        dimensions: '5.20 × 4.20 m',
        surface: '21.84 m²',
        features: ['Acceso a terraza mirador privada', 'Baño con hidromasaje/ducha doble', 'Vestidor walk-in']
      },
      {
        name: 'Dormitorios Planta Baja (2 Suites / Semisuites)',
        dimensions: '3.60 × 3.40 m c/u',
        surface: '24.48 m²',
        features: ['Baño compartido zonificado', 'Ventilación a patios internos', 'Escritorio integrado']
      },
      {
        name: 'Galería Lounge & Asador Techado',
        dimensions: '9.00 × 4.60 m',
        surface: '41.40 m²',
        features: ['Parrilla de 2.20 m con cerramiento', 'Deck perimetral', 'Preparada para cerramiento móvil']
      }
    ],
    description:
      'Nuestra propuesta de máxima jerarquía arquitectónica. Desarrollada para dialogar con la topografía y la vegetación de Monte Hermoso, el Modelo 03 aprovecha las ventajas de ligereza y precisión milimétrica del Steel Frame para crear voladizos audaces, amplias terrazas y ambientes bañados de luz natural.'
  }
];
