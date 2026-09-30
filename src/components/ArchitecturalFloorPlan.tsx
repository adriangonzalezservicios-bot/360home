import React, { useState } from 'react';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  Compass,
  Download,
  Info,
  Ruler,
  DoorOpen,
  FileText,
  Eye,
  EyeOff,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ArchitecturalFloorPlanProps {
  currentScene?: string;
  onSelectScene?: (scene: string) => void;
  showDimensions?: boolean;
  interactive?: boolean;
  variant?: 'full' | 'compact';
  theme?: 'dark' | 'blueprint' | 'light';
}

export interface RoomDetail {
  id: string;
  name: string;
  sector: 'social' | 'privado' | 'humedo' | 'circulacion' | 'exterior';
  dimensions: string;
  netArea: string;
  height: string;
  volume: string;
  orientation: string;
  ventilation: string;
  lightingRatio: string;
  flooring: string;
  walls: string;
  ceiling: string;
  openings: string;
  sceneId: string;
}

export const ArchitecturalFloorPlan: React.FC<ArchitecturalFloorPlanProps> = ({
  currentScene = 'fachada-frontal',
  onSelectScene,
  showDimensions: initialShowDimensions = true,
  interactive = true,
  variant = 'full',
  theme = 'blueprint'
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'specs' | 'vanos' | 'memoria'>('plan');
  
  // Capas arquitectónicas CAD
  const [layerDimensions, setLayerDimensions] = useState<boolean>(initialShowDimensions);
  const [layerFurniture, setLayerFurniture] = useState<boolean>(true);
  const [layerAxes, setLayerAxes] = useState<boolean>(true);
  const [layerVanos, setLayerVanos] = useState<boolean>(true);

  // Inspector de ambientes
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);

  // Fichas técnicas completas con rigor de arquitecto
  const ROOM_DETAILS: Record<string, RoomDetail> = {
    estar: {
      id: 'estar',
      name: 'Estar - Comedor',
      sector: 'social',
      dimensions: '3.80 m × 6.60 m',
      netArea: '25.08 m²',
      height: '2.60 m',
      volume: '65.21 m³',
      orientation: 'Este (Patio y Galería) / Sur (Acceso)',
      ventilation: 'Excelente • Ventanal corredizo lateral DVH 2.20×2.10m + Ventana frontal 1.50×1.10m',
      lightingRatio: '1 : 4.2 (Supera reglamentación mínima de 1:6)',
      flooring: 'Porcelanato símil madera rectificado 20×120 cm de alto tránsito',
      walls: 'Revoque fino al yeso con látex satinado y muro focal exterior en piedra rústica',
      ceiling: 'Losa plana con enlucido de yeso blanco y fosa perimetral de iluminación indirecta',
      openings: 'Puerta P1 (0.90×2.05m), Ventanal V2 (2.20×2.10m DVH), Ventana V4 (1.50×1.10m)',
      sceneId: 'interior'
    },
    cocina: {
      id: 'cocina',
      name: 'Cocina Lineal Integrada',
      sector: 'social',
      dimensions: '3.80 m × 1.80 m (Mesada 3.80 × 0.60 m)',
      netArea: '6.84 m² (integrada al área social)',
      height: '2.60 m',
      volume: '17.78 m³',
      orientation: 'Oeste / Ventilación sobre mesada',
      ventilation: 'Campana de extracción de 90cm al exterior + Ventana V3 (1.20×0.60m antepecho 1.50m)',
      lightingRatio: 'Iluminación directa sobre plano de trabajo',
      flooring: 'Porcelanato continuo al Estar (amplitud visual sin quiebres)',
      walls: 'Alzada de mesada en granito/cuarzo lavable h=0.60m',
      ceiling: 'Cielorraso suspendido con artefactos LED antideslumbrantes',
      openings: 'Ventana V3 (1.20×0.60m antepecho 1.50m)',
      sceneId: 'interior'
    },
    dorm1: {
      id: 'dorm1',
      name: 'Dormitorio 1 (Principal - Fondo Norte)',
      sector: 'privado',
      dimensions: '3.30 m × 3.35 m',
      netArea: '11.05 m²',
      height: '2.60 m',
      volume: '28.73 m³',
      orientation: 'Norte (Asolación térmica óptima en invierno)',
      ventilation: 'Ventana V1 (1.50×1.10m antepecho 1.00m) hacia patio privado con persiana',
      lightingRatio: '1 : 6.7 (Cumple cálculo bioclimático)',
      flooring: 'Piso vinílico SPC símil roble natural cálido al tacto',
      walls: 'Mampostería con aislación acústica reforzada de 50mm',
      ceiling: 'Cielorraso blanco mate con artefacto central regulable',
      openings: 'Puerta P2 (0.80×2.05m), Ventana V1 (1.50×1.10m DVH hermético)',
      sceneId: 'interior-dormitorio'
    },
    dorm2: {
      id: 'dorm2',
      name: 'Dormitorio 2 (Sur / Frente)',
      sector: 'privado',
      dimensions: '3.30 m × 3.35 m',
      netArea: '11.05 m²',
      height: '2.60 m',
      volume: '28.73 m³',
      orientation: 'Sur (Luz natural uniforme sin sobrecalentamiento estival)',
      ventilation: 'Ventana V5 (1.50×1.10m antepecho 1.00m) hacia jardín frontal',
      lightingRatio: '1 : 6.7 (Ventilación cruzada eficiente)',
      flooring: 'Piso vinílico SPC símil roble natural',
      walls: 'Revoque fino con pintura al látex lavable hipoalergénica',
      ceiling: 'Cielorraso enlucido blanco mate',
      openings: 'Puerta P4 (0.80×2.05m), Ventana V5 (1.50×1.10m DVH)',
      sceneId: 'interior-dormitorio-2'
    },
    bano: {
      id: 'bano',
      name: 'Baño Completo Central',
      sector: 'humedo',
      dimensions: '2.30 m × 1.60 m',
      netArea: '3.68 m²',
      height: '2.40 m',
      volume: '8.83 m³',
      orientation: 'Este (Ventilación alta protegida)',
      ventilation: 'Ventana banderola oscilobatiente (0.60×0.40m antepecho 1.90m) + Extracción forzada',
      lightingRatio: 'Ventilación y luz natural directa reglamentaria',
      flooring: 'Porcelanato antideslizante R10 rectificado 60×60 cm (desnivel de seguridad -2cm)',
      walls: 'Revestimiento cerámico de piso a techo con cantoneras de aluminio',
      ceiling: 'Placa de yeso hidrófuga (verde) con pintura antihongos y extractor empotrado',
      openings: 'Puerta PB (0.70×2.05m con rejilla inferior reglamentaria)',
      sceneId: 'interior-bano'
    },
    pasillo: {
      id: 'pasillo',
      name: 'Pasillo Distribuidor Central',
      sector: 'circulacion',
      dimensions: '0.90 m × 1.60 m',
      netArea: '1.44 m²',
      height: '2.40 m',
      volume: '3.45 m³',
      orientation: 'Centro geométrico de la vivienda',
      ventilation: 'Circulación natural por convección entre áreas',
      lightingRatio: 'Luz cenital indirecta y spot LED de cortesía con sensor',
      flooring: 'Continuidad de piso de alta resistencia',
      walls: 'Pintura lavable de alto tránsito',
      ceiling: 'Cielorraso suspendido desmontable para registro de instalaciones',
      openings: 'Distribuidor directo e independiente hacia Dormitorios 1 y 2, y Baño',
      sceneId: 'interior'
    }
  };

  const handleRoomClick = (sceneId: string, roomId?: string) => {
    if (roomId && ROOM_DETAILS[roomId]) {
      setSelectedRoom(ROOM_DETAILS[roomId]);
    }
    if (interactive && onSelectScene) {
      onSelectScene(sceneId);
    }
  };

  // Colores según el tema (Blueprint técnico arquitectónico fiel al PDF)
  const isBlueprint = theme === 'blueprint';
  const bgColor = isBlueprint ? '#0a0f1d' : '#09090b';
  const paperGrid = isBlueprint ? '#1e293b' : '#18181b';
  const wallFill = isBlueprint ? '#334155' : '#27272a';
  const wallStroke = '#ffffff';
  const dimensionColor = '#ef4444'; // Rojo técnico reglamentario del plano
  const dimensionTextBg = isBlueprint ? '#0f172a' : '#000000';

  return (
    <div className="flex flex-col w-full h-full bg-neutral-950 text-neutral-100 rounded-2xl overflow-hidden select-none">
      {/* Barra de control superior para el plano */}
      {variant === 'full' && (
        <div className="p-3 bg-neutral-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-white tracking-wide uppercase">
              Plano de Arquitectura CAD • Medidas Reales
            </span>
            <span className="hidden sm:inline bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full text-[11px] border border-white/10">
              Escala 1:50 • Cotas en Metros
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Selector de 4 pestañas profesionales de arquitectura */}
            <div className="flex items-center bg-neutral-950 p-0.5 rounded-xl border border-white/10 overflow-x-auto">
              <button
                onClick={() => setActiveTab('plan')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'plan'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Plano Acotado CAD
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'specs'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Cuadro de Áreas
              </button>
              <button
                onClick={() => setActiveTab('vanos')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'vanos'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Planilla de Vanos
              </button>
              <button
                onClick={() => setActiveTab('memoria')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'memoria'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Memoria Técnica
              </button>
            </div>

            {/* Controles de Zoom */}
            <div className="flex items-center bg-neutral-950 p-0.5 rounded-xl border border-white/10 shrink-0">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(0.8, prev - 0.15))}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                title="Alejar plano"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-neutral-300 px-1 font-semibold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(2.0, prev + 0.15))}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                title="Acercar plano"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                title="Restablecer escala original"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Capas CAD Arquitectónicas (Solo visible en pestaña Plano) */}
      {variant === 'full' && activeTab === 'plan' && (
        <div className="px-3 py-1.5 bg-neutral-900/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider text-[10px] text-neutral-300">Capas CAD:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLayerDimensions(!layerDimensions)}
                className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all flex items-center gap-1 border ${
                  layerDimensions
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-neutral-800/60 text-neutral-500 border-transparent hover:text-neutral-300'
                }`}
                title="Activar/Desactivar cotas métricas reglamentarias"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${layerDimensions ? 'bg-red-400' : 'bg-neutral-600'}`} />
                Cotas (Rojo)
              </button>
              <button
                onClick={() => setLayerFurniture(!layerFurniture)}
                className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all flex items-center gap-1 border ${
                  layerFurniture
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-neutral-800/60 text-neutral-500 border-transparent hover:text-neutral-300'
                }`}
                title="Activar/Desactivar mobiliario y equipamiento fijo"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${layerFurniture ? 'bg-blue-400' : 'bg-neutral-600'}`} />
                Mobiliario
              </button>
              <button
                onClick={() => setLayerAxes(!layerAxes)}
                className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all flex items-center gap-1 border ${
                  layerAxes
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-neutral-800/60 text-neutral-500 border-transparent hover:text-neutral-300'
                }`}
                title="Activar/Desactivar ejes estructurales y niveles NPT"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${layerAxes ? 'bg-amber-400' : 'bg-neutral-600'}`} />
                Ejes & Niveles NPT
              </button>
              <button
                onClick={() => setLayerVanos(!layerVanos)}
                className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all flex items-center gap-1 border ${
                  layerVanos
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-neutral-800/60 text-neutral-500 border-transparent hover:text-neutral-300'
                }`}
                title="Activar/Desactivar etiquetas de carpinterías (V1-V5, P1-P4)"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${layerVanos ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
                Carpinterías
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
            <span className="hidden sm:inline bg-neutral-950 px-2 py-0.5 rounded border border-white/10 text-neutral-300">
              💡 Haz clic en cualquier ambiente para ver su Ficha Técnica
            </span>
          </div>
        </div>
      )}

      {/* Contenido principal: Plano o Cuadro de Áreas */}
      {activeTab === 'specs' ? (
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[70vh]">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Cuadro General de Medidas y Superficies (Vivienda 60 m²)
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Vivienda moderna de tipología en "L" desarrollada <strong>estrictamente en una sola planta</strong>, con modulación estructural eficiente, techos planos con pretiles de desagüe y sin escaleras ni desniveles.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Ambiente / Sector</th>
                    <th className="py-2.5 px-3">Ancho (m)</th>
                    <th className="py-2.5 px-3">Largo (m)</th>
                    <th className="py-2.5 px-3 text-right">Superficie Útil</th>
                    <th className="py-2.5 px-3">Ventilación & Aberturas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Estar - Comedor - Cocina
                    </td>
                    <td className="py-2.5 px-3 font-mono">3.80 m</td>
                    <td className="py-2.5 px-3 font-mono">6.60 m</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">25.08 m²</td>
                    <td className="py-2.5 px-3 text-neutral-400">Ventanal DVH patio lateral + Ventana cocina + Puerta acceso 0.90m</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Pasillo Distribuidor Central
                    </td>
                    <td className="py-2.5 px-3 font-mono">0.90 m</td>
                    <td className="py-2.5 px-3 font-mono">1.60 m</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">1.44 m²</td>
                    <td className="py-2.5 px-3 text-neutral-400">Circulación fluida e independiente hacia dormitorios y baño</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-violet-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-violet-400" />
                      Dormitorio 1 (Norte / Fondo)
                    </td>
                    <td className="py-2.5 px-3 font-mono">3.30 m</td>
                    <td className="py-2.5 px-3 font-mono">3.35 m</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-violet-400">11.05 m²</td>
                    <td className="py-2.5 px-3 text-neutral-400">Ventana norte 1.50m hacia jardín trasero + Placard</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-cyan-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Baño Completo Central
                    </td>
                    <td className="py-2.5 px-3 font-mono">2.30 m</td>
                    <td className="py-2.5 px-3 font-mono">1.60 m</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-400">3.68 m²</td>
                    <td className="py-2.5 px-3 text-neutral-400">Box de ducha 0.80m, Vanitory, Inodoro y Bidet</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-purple-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Dormitorio 2 (Sur / Frente)
                    </td>
                    <td className="py-2.5 px-3 font-mono">3.30 m</td>
                    <td className="py-2.5 px-3 font-mono">3.35 m</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-purple-400">11.05 m²</td>
                    <td className="py-2.5 px-3 text-neutral-400">Ventana sur 1.50m hacia jardín frontal + Placard</td>
                  </tr>
                  <tr className="bg-white/5 font-semibold">
                    <td className="py-2.5 px-3 text-neutral-300">Muros, Tabiquería y Envolvente (20cm / 12cm)</td>
                    <td className="py-2.5 px-3 font-mono">-</td>
                    <td className="py-2.5 px-3 font-mono">-</td>
                    <td className="py-2.5 px-3 text-right font-mono text-neutral-400">7.70 m²</td>
                    <td className="py-2.5 px-3 text-neutral-400">Aislación hidrófuga y térmica certificada</td>
                  </tr>
                  <tr className="border-t-2 border-emerald-500/40 bg-emerald-950/20 text-emerald-300 font-bold">
                    <td className="py-3 px-3 uppercase tracking-wider text-white">Superficie Total Cubierta</td>
                    <td className="py-3 px-3 font-mono">-</td>
                    <td className="py-3 px-3 font-mono">-</td>
                    <td className="py-3 px-3 text-right font-mono text-base text-emerald-400">60.00 m²</td>
                    <td className="py-3 px-3 text-emerald-400">100% Planta Baja (Sin segundo piso)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'vanos' ? (
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 max-h-[70vh]">
          {/* Planilla de Puertas */}
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <DoorOpen className="w-4 h-4" />
              Planilla de Puertas (Carpinterías de Madera & Aluminio)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Destino / Ubicación</th>
                    <th className="py-2.5 px-3">Ancho × Alto</th>
                    <th className="py-2.5 px-3">Tipo de Apertura</th>
                    <th className="py-2.5 px-3">Materialidad & Herrajes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">P1</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Acceso Principal (Frente Sur)</td>
                    <td className="py-2.5 px-3 font-mono">0.90 × 2.05 m</td>
                    <td className="py-2.5 px-3">Batiente derecha (giro interior 90°)</td>
                    <td className="py-2.5 px-3 text-neutral-300">Puerta reforzada en madera maciza/chapa con barral vertical de 1.20m y cerradura multipunto</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-violet-400">P2</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Dormitorio 1 (Principal Norte)</td>
                    <td className="py-2.5 px-3 font-mono">0.80 × 2.05 m</td>
                    <td className="py-2.5 px-3">Batiente izquierda (giro interior)</td>
                    <td className="py-2.5 px-3 text-neutral-300">Puerta placa enchapada en roble natural con marco metálico negro y burlete perimetral acústico</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">PB</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Baño Completo Central</td>
                    <td className="py-2.5 px-3 font-mono">0.70 × 2.05 m</td>
                    <td className="py-2.5 px-3">Batiente derecha (hacia muro lateral)</td>
                    <td className="py-2.5 px-3 text-neutral-300">Puerta placa con rejilla inferior de ventilación permanente (100 cm²) y cerradura con traba de seguridad</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-400">P4</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Dormitorio 2 (Sur / Frente)</td>
                    <td className="py-2.5 px-3 font-mono">0.80 × 2.05 m</td>
                    <td className="py-2.5 px-3">Batiente izquierda (giro interior)</td>
                    <td className="py-2.5 px-3 text-neutral-300">Puerta placa enchapada en roble natural con manijón tipo sanatorio en acero inoxidable mate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Planilla de Ventanas */}
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Planilla de Ventanas & Aberturas Exteriores (DVH Alta Eficiencia)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Ambiente</th>
                    <th className="py-2.5 px-3">Ancho × Alto</th>
                    <th className="py-2.5 px-3">Antepecho (h)</th>
                    <th className="py-2.5 px-3">Tipo / Vidriado</th>
                    <th className="py-2.5 px-3">Orientación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">V2</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Estar Lateral Galería</td>
                    <td className="py-2.5 px-3 font-mono">2.20 × 2.10 m</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">h = 0.00 m</td>
                    <td className="py-2.5 px-3 text-neutral-300">Puerta-ventana corrediza 2 hojas • Vidrio Laminado de Seguridad 3+3/12/3+3 DVH</td>
                    <td className="py-2.5 px-3 text-amber-300">Oeste (Galería)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">V4</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Estar Frente</td>
                    <td className="py-2.5 px-3 font-mono">1.50 × 1.10 m</td>
                    <td className="py-2.5 px-3 font-mono">h = 1.00 m</td>
                    <td className="py-2.5 px-3 text-neutral-300">Ventana corrediza 2 hojas herméticas • DVH 4+9+4 • Perfilería aluminio negro A30</td>
                    <td className="py-2.5 px-3 text-cyan-300">Sur (Frente)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">V3</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Cocina sobre Mesada</td>
                    <td className="py-2.5 px-3 font-mono">1.20 × 0.60 m</td>
                    <td className="py-2.5 px-3 font-mono">h = 1.50 m</td>
                    <td className="py-2.5 px-3 text-neutral-300">Ventana corrediza horizontal con mosquitero de aluminio incorporado</td>
                    <td className="py-2.5 px-3 text-amber-300">Oeste (Cocina)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-violet-400">V1</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Dormitorio 1 (Principal)</td>
                    <td className="py-2.5 px-3 font-mono">1.50 × 1.10 m</td>
                    <td className="py-2.5 px-3 font-mono">h = 1.00 m</td>
                    <td className="py-2.5 px-3 text-neutral-300">Ventana corrediza 2 hojas con cortina de enrollar de aluminio inyectado para oscurecimiento total</td>
                    <td className="py-2.5 px-3 text-emerald-400">Norte (Jardín)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-400">V5</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Dormitorio 2 (Sur)</td>
                    <td className="py-2.5 px-3 font-mono">1.50 × 1.10 m</td>
                    <td className="py-2.5 px-3 font-mono">h = 1.00 m</td>
                    <td className="py-2.5 px-3 text-neutral-300">Ventana corrediza 2 hojas con doble vidriado hermético y cortina de enrollar</td>
                    <td className="py-2.5 px-3 text-cyan-300">Sur (Frente)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">VB</td>
                    <td className="py-2.5 px-3 font-semibold text-white">Baño Completo</td>
                    <td className="py-2.5 px-3 font-mono">0.60 × 0.40 m</td>
                    <td className="py-2.5 px-3 font-mono">h = 1.90 m</td>
                    <td className="py-2.5 px-3 text-neutral-300">Ventana banderola oscilobatiente alta con vidrio satén esmerilado de privacidad</td>
                    <td className="py-2.5 px-3 text-blue-300">Este (Patio lateral)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'memoria' ? (
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[70vh]">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Memoria Técnica Descriptiva & Constructiva (60 m² • Planta Baja Única)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-300">
              <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  1. Cimentación & Estructura
                </span>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  Platea de fundación de hormigón armado H-21 (e = 15 cm) con vigas de encadenado perimetrales (20×30 cm) calculadas para suelo homogéneo. Incluye barrera de vapor con film de polietileno de 200 micrones para anular completamente la humedad ascendente.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  2. Muros & Envolvente Térmica (20 cm)
                </span>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  Muros exteriores ejecutados con ladrillos cerámicos huecos portantes de 18×19×33 cm. Revoque hidrófugo continuo con hidrófugo inorgánico tipo Ceresita (1:3). Aislación térmica certificada con coeficiente K inferior a 0.70 W/m²K para máxima eficiencia energética estival e invernal.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  3. Cubierta Plana & Pretiles (Sin Planta Alta)
                </span>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  Losa plana alivianada con viguetas pretensadas y bovedillas de EPS. Pendiente reglamentaria del 2% hacia embudos y desagües pluviales exteriores. Barrera de vapor, aislamiento térmico de poliestireno extruido (XPS 50mm) y doble membrana asfáltica pegada al 100% con terminación transitable. Pretiles de 40cm con goterón perimetral.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-violet-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  4. Instalaciones Sanitarias & Eléctricas
                </span>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  Agua fría y caliente por termofusión tricapa. Desagües cloacales y pluviales en PVC reforzado con junta elástica de dilatación. Tablero eléctrico con disyuntor diferencial y circuitos independientes para iluminación (IUG), tomas de fuerza (TUG) y tomas especiales (TUE) para aires acondicionados y cocina.
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
              <span className="font-semibold">
                Certificación de Normativa Arquitectónica: 100% Aprobada para construcción de nivel único (60 m²).
              </span>
              <span className="font-mono font-bold bg-emerald-900/60 px-2 py-1 rounded-md text-emerald-200">
                Escala 1:50 CAD
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto bg-neutral-950">
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            className="transition-transform duration-200 max-w-full flex items-center justify-center"
          >
            {/* SVG ARQUITECTÓNICO EXACTO DEL PLANO PDF */}
            <svg
              viewBox="0 0 760 1020"
              className="w-full max-w-[560px] sm:max-w-[640px] h-auto drop-shadow-2xl"
              style={{ background: bgColor }}
            >
              <defs>
                {/* Cuadrícula milimétrica de plano técnico */}
                <pattern id="cadGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke={paperGrid} strokeWidth="0.5" />
                </pattern>

                {/* Marcador de cota roja con punto terminal */}
                <marker
                  id="dotMarker"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                >
                  <circle cx="5" cy="5" r="3.5" fill={dimensionColor} />
                </marker>
              </defs>

              {/* Fondo del plano con cuadrícula arquitectónica */}
              <rect width="760" height="1020" fill={bgColor} />
              <rect width="760" height="1020" fill="url(#cadGrid)" opacity="0.6" />

              {/* Marco exterior del plano técnico */}
              <rect
                x="20"
                y="20"
                width="720"
                height="980"
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <rect
                x="25"
                y="25"
                width="710"
                height="970"
                fill="none"
                stroke="#1e293b"
                strokeWidth="0.75"
              />

              {/* ============================================================ */}
              {/* 1. SECTOR SOCIAL: ESTAR - COMEDOR - COCINA (3.80 × 6.60 m)    */}
              {/* ============================================================ */}
              <g
                onClick={() => handleRoomClick('interior', 'estar')}
                onMouseEnter={() => setHoveredRoom('estar')}
                onMouseLeave={() => setHoveredRoom(null)}
                className="cursor-pointer group"
              >
                {/* Fondo coloreado sutil interactivo */}
                <rect
                  x="122"
                  y="312"
                  width="228"
                  height="396"
                  className={`transition-all duration-300 ${
                    currentScene === 'interior'
                      ? 'fill-emerald-500/25 stroke-emerald-400 stroke-2'
                      : hoveredRoom === 'estar'
                      ? 'fill-emerald-500/15'
                      : 'fill-transparent'
                  }`}
                />

                {/* COCINA LINEAL SUPERIOR (Con Mesada, Bacha [A], Anafe 4 hornallas, Heladera) */}
                {/* Mesada corrida (ancho 3.80m, prof 0.60m = 36px) */}
                <rect
                  x="122"
                  y="312"
                  width="228"
                  height="36"
                  fill="#1e293b"
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                />

                {/* Pileta / Bacha de cocina con escurridor y símbolo [A] */}
                <g transform="translate(170, 316)">
                  <rect x="0" y="0" width="46" height="28" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                  <rect x="5" y="4" width="22" height="20" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="0.75" />
                  <circle cx="16" cy="14" r="2.5" fill="#38bdf8" />
                  {/* Escurridor ranurado */}
                  <line x1="32" y1="6" x2="32" y2="22" stroke="#64748b" strokeWidth="1" />
                  <line x1="36" y1="6" x2="36" y2="22" stroke="#64748b" strokeWidth="1" />
                  <line x1="40" y1="6" x2="40" y2="22" stroke="#64748b" strokeWidth="1" />
                  <text x="16" y="27" fill="#94a3b8" fontSize="7" fontWeight="bold" textAnchor="middle">A</text>
                </g>

                {/* Anafe / Cocina con 4 hornallas */}
                <g transform="translate(250, 316)">
                  <rect x="0" y="0" width="42" height="28" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                  {/* 4 hornallas concéntricas */}
                  <circle cx="11" cy="8" r="4.5" fill="#334155" stroke="#f59e0b" strokeWidth="0.8" />
                  <circle cx="11" cy="8" r="1.5" fill="#f59e0b" />
                  <circle cx="31" cy="8" r="4.5" fill="#334155" stroke="#f59e0b" strokeWidth="0.8" />
                  <circle cx="31" cy="8" r="1.5" fill="#f59e0b" />
                  <circle cx="11" cy="20" r="4.5" fill="#334155" stroke="#f59e0b" strokeWidth="0.8" />
                  <circle cx="11" cy="20" r="1.5" fill="#f59e0b" />
                  <circle cx="31" cy="20" r="4.5" fill="#334155" stroke="#f59e0b" strokeWidth="0.8" />
                  <circle cx="31" cy="20" r="1.5" fill="#f59e0b" />
                  {/* Perillas */}
                  <circle cx="6" cy="26" r="1" fill="#cbd5e1" />
                  <circle cx="14" cy="26" r="1" fill="#cbd5e1" />
                  <circle cx="28" cy="26" r="1" fill="#cbd5e1" />
                  <circle cx="36" cy="26" r="1" fill="#cbd5e1" />
                </g>

                {/* Espacio para Heladera al extremo derecho */}
                <g transform="translate(306, 314)">
                  <rect x="0" y="0" width="38" height="32" rx="2" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                  <circle cx="19" cy="16" r="10" fill="none" stroke="#64748b" strokeWidth="0.75" />
                  <text x="19" y="19" fill="#94a3b8" fontSize="8" textAnchor="middle">REF</text>
                </g>

                {/* COMEDOR CENTRAL: MESA PARA 6 PERSONAS */}
                <g transform="translate(170, 420)">
                  {/* Mesa rectangular */}
                  <rect
                    x="10"
                    y="18"
                    width="112"
                    height="60"
                    rx="3"
                    fill="#1e293b"
                    stroke="#cbd5e1"
                    strokeWidth="1.2"
                  />
                  {/* 3 sillas superiores */}
                  <rect x="18" y="2" width="22" height="12" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="55" y="2" width="22" height="12" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="92" y="2" width="22" height="12" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                  {/* 3 sillas inferiores */}
                  <rect x="18" y="82" width="22" height="12" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="55" y="82" width="22" height="12" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="92" y="82" width="22" height="12" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                </g>

                {/* ESTAR / LIVING: SOFÁ DE 3 CUERPOS, MESA RATONA Y BUTACAS PUNTEADAS */}
                <g transform="translate(172, 545)">
                  {/* Sofá de 3 cuerpos */}
                  <rect
                    x="10"
                    y="0"
                    width="110"
                    height="42"
                    rx="4"
                    fill="#1e293b"
                    stroke="#cbd5e1"
                    strokeWidth="1.2"
                  />
                  {/* Almohadones del sofá */}
                  <rect x="16" y="8" width="30" height="30" rx="2" fill="#334155" stroke="#64748b" strokeWidth="0.75" />
                  <rect x="50" y="8" width="30" height="30" rx="2" fill="#334155" stroke="#64748b" strokeWidth="0.75" />
                  <rect x="84" y="8" width="30" height="30" rx="2" fill="#334155" stroke="#64748b" strokeWidth="0.75" />
                  {/* Apoyabrazos */}
                  <rect x="10" y="4" width="6" height="34" rx="2" fill="#475569" />
                  <rect x="114" y="4" width="6" height="34" rx="2" fill="#475569" />

                  {/* Mesa ratona central */}
                  <rect
                    x="22"
                    y="58"
                    width="42"
                    height="24"
                    rx="2"
                    fill="#0f172a"
                    stroke="#94a3b8"
                    strokeWidth="1"
                  />

                  {/* Alfombra delimitadora en línea discontinua como en el plano PDF */}
                  <rect
                    x="10"
                    y="46"
                    width="112"
                    height="54"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="0.8"
                    strokeDasharray="4,3"
                  />
                </g>

                {/* Identificador de Ambiente con dimensiones reales */}
                <text x="236" y="390" fill="#a7f3d0" fontSize="13" fontWeight="bold" textAnchor="middle">
                  ESTAR - COMEDOR
                </text>
                <text x="236" y="405" fill="#6ee7b7" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  3.80 × 6.60 m (25.08 m²)
                </text>

                {/* Marcador de cámara activa */}
                {currentScene === 'interior' && (
                  <circle cx="236" cy="485" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                )}
              </g>

              {/* ============================================================ */}
              {/* 2. PASILLO DISTRIBUIDOR CENTRAL (0.90 × 1.60 m)              */}
              {/* ============================================================ */}
              <g
                onClick={() => handleRoomClick('interior')}
                className="cursor-pointer"
              >
                {/* Zona de paso del pasillo */}
                <rect
                  x="350"
                  y="310"
                  width="54"
                  height="96"
                  fill={hoveredRoom === 'pasillo' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.08)'}
                />
                <text x="377" y="362" fill="#fde68a" fontSize="8" fontWeight="bold" textAnchor="middle">
                  PASILLO
                </text>
                <text x="377" y="374" fill="#f59e0b" fontSize="7" textAnchor="middle">
                  0.90 m
                </text>
              </g>

              {/* ============================================================ */}
              {/* 3. DORMITORIO 1 (NORTE / FONDO): 3.30 × 3.35 m                */}
              {/* ============================================================ */}
              <g
                onClick={() => handleRoomClick('interior-dormitorio', 'dorm1')}
                onMouseEnter={() => setHoveredRoom('dorm1')}
                onMouseLeave={() => setHoveredRoom(null)}
                className="cursor-pointer group"
              >
                <rect
                  x="362"
                  y="102"
                  width="198"
                  height="201"
                  className={`transition-all duration-300 ${
                    currentScene === 'interior-dormitorio'
                      ? 'fill-violet-500/25 stroke-violet-400 stroke-2'
                      : hoveredRoom === 'dorm1'
                      ? 'fill-violet-500/15'
                      : 'fill-transparent'
                  }`}
                />

                {layerFurniture && (
                  <>
                    {/* Cama matrimonial doble (1.60 × 2.00 m) */}
                    <g transform="translate(425, 140)">
                      <rect
                        x="0"
                        y="0"
                        width="120"
                        height="98"
                        rx="3"
                        fill="#1e293b"
                        stroke="#cbd5e1"
                        strokeWidth="1.2"
                      />
                      {/* Dos almohadas */}
                      <rect x="8" y="8" width="46" height="24" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="0.75" />
                      <rect x="66" y="8" width="46" height="24" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="0.75" />
                      {/* Doblez de la colcha */}
                      <line x1="0" y1="45" x2="120" y2="45" stroke="#94a3b8" strokeWidth="1" />
                    </g>

                    {/* Mesas de luz a los lados */}
                    <rect x="395" y="140" width="24" height="24" rx="2" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                    <circle cx="407" cy="152" r="3" fill="#a78bfa" />
                    <rect x="550" y="140" width="24" height="24" rx="2" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                    <circle cx="562" cy="152" r="3" fill="#a78bfa" />

                    {/* Placard empotrado de piso a techo (2.00 × 0.60 m) */}
                    <g transform="translate(425, 265)">
                      <rect x="0" y="0" width="120" height="36" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                      {/* Puertas corredizas solapadas */}
                      <line x1="0" y1="18" x2="62" y2="18" stroke="#cbd5e1" strokeWidth="1.2" />
                      <line x1="58" y1="22" x2="120" y2="22" stroke="#cbd5e1" strokeWidth="1.2" />
                      <text x="60" y="12" fill="#94a3b8" fontSize="7" fontStyle="italic" textAnchor="middle">PLACARD 2.00×0.60m</text>
                    </g>
                  </>
                )}

                {/* Identificador de Ambiente */}
                <text x="461" y="125" fill="#ddd6fe" fontSize="12" fontWeight="bold" textAnchor="middle">
                  DORMITORIO 1
                </text>
                <text x="461" y="138" fill="#a78bfa" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  3.30 × 3.35 m (11.05 m²)
                </text>

                {currentScene === 'interior-dormitorio' && (
                  <circle cx="461" cy="190" r="6" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                )}
              </g>

              {/* ============================================================ */}
              {/* 4. BAÑO COMPLETO CENTRAL: 2.30 × 1.60 m                       */}
              {/* ============================================================ */}
              <g
                onClick={() => handleRoomClick('interior-bano', 'bano')}
                onMouseEnter={() => setHoveredRoom('bano')}
                onMouseLeave={() => setHoveredRoom(null)}
                className="cursor-pointer group"
              >
                <rect
                  x="416"
                  y="310"
                  width="144"
                  height="96"
                  className={`transition-all duration-300 ${
                    currentScene === 'interior-bano'
                      ? 'fill-cyan-500/30 stroke-cyan-400 stroke-2'
                      : hoveredRoom === 'bano'
                      ? 'fill-cyan-500/15'
                      : 'fill-transparent'
                  }`}
                />

                {layerFurniture && (
                  <>
                    {/* Sanitarios exactos del plano PDF: */}
                    {/* 1. Box de Ducha al fondo derecho */}
                    <g transform="translate(515, 318)">
                      <rect x="0" y="0" width="40" height="42" fill="#0f172a" stroke="#67e8f9" strokeWidth="1" />
                      <circle cx="20" cy="21" r="3" fill="#06b6d4" />
                      <line x1="0" y1="0" x2="40" y2="42" stroke="#334155" strokeWidth="0.5" />
                      <line x1="40" y1="0" x2="0" y2="42" stroke="#334155" strokeWidth="0.5" />
                      <text x="20" y="38" fill="#67e8f9" fontSize="6" textAnchor="middle">DUCHA</text>
                    </g>

                    {/* 2. Inodoro (WC) con cisterna */}
                    <g transform="translate(460, 368)">
                      <rect x="0" y="16" width="22" height="12" rx="2" fill="#334155" stroke="#cbd5e1" strokeWidth="0.75" />
                      <ellipse cx="11" cy="9" rx="9" ry="11" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx="11" cy="9" r="4" fill="#0f172a" />
                    </g>

                    {/* 3. Bidet al lado del inodoro */}
                    <g transform="translate(425, 368)">
                      <ellipse cx="10" cy="14" rx="8" ry="12" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx="10" cy="8" r="2.5" fill="#38bdf8" />
                    </g>

                    {/* 4. Vanitory con lavamanos / bacha */}
                    <g transform="translate(450, 314)">
                      <rect x="0" y="0" width="34" height="24" rx="2" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                      <ellipse cx="17" cy="12" rx="10" ry="7" fill="#0f172a" stroke="#67e8f9" strokeWidth="0.75" />
                      <circle cx="17" cy="6" r="1.5" fill="#38bdf8" />
                    </g>
                  </>
                )}

                {/* Identificador de Ambiente */}
                <text x="488" y="348" fill="#a5f3fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                  BAÑO
                </text>
                <text x="488" y="360" fill="#67e8f9" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  2.30 × 1.60 m
                </text>
                {layerAxes && (
                  <text x="488" y="372" fill="#38bdf8" fontSize="7" fontStyle="italic" textAnchor="middle">
                    N.P.T. +0.13
                  </text>
                )}

                {currentScene === 'interior-bano' && (
                  <circle cx="488" cy="385" r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                )}
              </g>

              {/* ============================================================ */}
              {/* 5. DORMITORIO 2 (SUR / FRENTE): 3.30 × 3.35 m                 */}
              {/* ============================================================ */}
              <g
                onClick={() => handleRoomClick('interior-dormitorio-2', 'dorm2')}
                onMouseEnter={() => setHoveredRoom('dorm2')}
                onMouseLeave={() => setHoveredRoom(null)}
                className="cursor-pointer group"
              >
                <rect
                  x="362"
                  y="413"
                  width="198"
                  height="201"
                  className={`transition-all duration-300 ${
                    hoveredRoom === 'dorm2'
                      ? 'fill-purple-500/15'
                      : 'fill-transparent'
                  }`}
                />

                {layerFurniture && (
                  <>
                    {/* Cama matrimonial doble (1.60 × 2.00 m) */}
                    <g transform="translate(425, 485)">
                      <rect
                        x="0"
                        y="0"
                        width="120"
                        height="98"
                        rx="3"
                        fill="#1e293b"
                        stroke="#cbd5e1"
                        strokeWidth="1.2"
                      />
                      {/* Dos almohadas */}
                      <rect x="8" y="8" width="46" height="24" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="0.75" />
                      <rect x="66" y="8" width="46" height="24" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="0.75" />
                      {/* Doblez de la colcha */}
                      <line x1="0" y1="45" x2="120" y2="45" stroke="#94a3b8" strokeWidth="1" />
                    </g>

                    {/* Mesas de luz */}
                    <rect x="395" y="485" width="24" height="24" rx="2" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                    <circle cx="407" cy="497" r="3" fill="#c084fc" />
                    <rect x="550" y="485" width="24" height="24" rx="2" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                    <circle cx="562" cy="497" r="3" fill="#c084fc" />

                    {/* Placard empotrado Dormitorio 2 (2.00 × 0.60 m) */}
                    <g transform="translate(425, 418)">
                      <rect x="0" y="0" width="120" height="34" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                      <line x1="0" y1="17" x2="62" y2="17" stroke="#cbd5e1" strokeWidth="1.2" />
                      <line x1="58" y1="21" x2="120" y2="21" stroke="#cbd5e1" strokeWidth="1.2" />
                      <text x="60" y="11" fill="#94a3b8" fontSize="7" fontStyle="italic" textAnchor="middle">PLACARD 2.00×0.60m</text>
                    </g>
                  </>
                )}

                {/* Identificador de Ambiente */}
                <text x="461" y="465" fill="#e9d5ff" fontSize="12" fontWeight="bold" textAnchor="middle">
                  DORMITORIO 2
                </text>
                <text x="461" y="478" fill="#c084fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  3.30 × 3.35 m (11.05 m²)
                </text>
                {layerAxes && (
                  <text x="461" y="600" fill="#a78bfa" fontSize="8" fontStyle="italic" textAnchor="middle">
                    N.P.T. +0.15
                  </text>
                )}
              </g>

              {/* ============================================================ */}
              {/* 6. PUERTAS CON ARCOS DE BARRIDO REGLAMENTARIOS (CYAN)        */}
              {/* ============================================================ */}
              {/* Puerta Principal de Entrada (Muro sur del Estar, 0.90 m) */}
              <g transform="translate(300, 708)">
                {/* Batiente de puerta en 90° hacia el interior */}
                <line x1="0" y1="0" x2="0" y2="-45" stroke="#38bdf8" strokeWidth="2" />
                {/* Arco de barrido punteado cyan */}
                <path
                  d="M 0 -45 A 45 45 0 0 1 45 0"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                />
                <circle cx="0" cy="0" r="2" fill="#38bdf8" />
              </g>

              {/* Puerta Dormitorio 1 (Norte) desde Pasillo */}
              <g transform="translate(390, 303)">
                <line x1="0" y1="0" x2="-35" y2="0" stroke="#38bdf8" strokeWidth="2" />
                <path
                  d="M -35 0 A 35 35 0 0 1 0 -35"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                />
              </g>

              {/* Puerta Baño Central desde Pasillo */}
              <g transform="translate(416, 335)">
                <line x1="0" y1="0" x2="0" y2="32" stroke="#38bdf8" strokeWidth="2" />
                <path
                  d="M 0 32 A 32 32 0 0 1 32 0"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                />
              </g>

              {/* Puerta Dormitorio 2 (Sur) desde Pasillo */}
              <g transform="translate(390, 413)">
                <line x1="0" y1="0" x2="-35" y2="0" stroke="#38bdf8" strokeWidth="2" />
                <path
                  d="M -35 0 A 35 35 0 0 0 0 35"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                />
              </g>

              {/* ============================================================ */}
              {/* 7. MUROS EXTERIORES E INTERIORES CORTADOS (SECCIÓN CAD)       */}
              {/* ============================================================ */}
              {/* Muros exteriores: e = 12 px (0.20 m). Achurado arquitectónico */}
              {/* Ala Izquierda: x=110 a 350 px, y=300 a 720 px */}
              {/* Ala Derecha: x=350 a 572 px, y=90 a 630 px */}

              {/* Muro exterior perimetral complejo en "L" */}
              <path
                d={`
                  M 110 300
                  L 350 300
                  L 350 90
                  L 572 90
                  L 572 630
                  L 350 630
                  L 350 720
                  L 110 720
                  Z
                `}
                fill="none"
                stroke="#64748b"
                strokeWidth="1"
              />

              {/* Muros sólidos cortados (bloques gruesos seccionados como en el PDF) */}
              {/* Muro Oeste (Izquierda completa de 7.00 m) */}
              <rect x="110" y="300" width="12" height="420" fill={wallFill} stroke={wallStroke} strokeWidth="1.5" />

              {/* Muro Sur Estar (inferior) */}
              <rect x="122" y="708" width="178" height="12" fill={wallFill} stroke={wallStroke} strokeWidth="1.5" />
              {/* Mocheta derecha puerta principal */}
              <rect x="345" y="708" width="17" height="12" fill={wallFill} stroke={wallStroke} strokeWidth="1.5" />

              {/* Muro Norte Estar-Cocina (fondo) */}
              <rect x="122" y="300" width="228" height="12" fill={wallFill} stroke={wallStroke} strokeWidth="1.5" />

              {/* Muro Norte Ala Derecha (Dormitorio 1) */}
              <rect x="350" y="90" width="222" height="12" fill={wallFill} stroke={wallStroke} strokeWidth="1.5" />

              {/* Muro Este Ala Derecha (Lateral derecho completo de 9.00 m) */}
              <rect x="560" y="90" width="12" height="540" fill={wallFill} stroke={wallStroke} strokeWidth="1.5" />

              {/* Muro Sur Ala Derecha (Dormitorio 2) */}
              <rect x="350" y="618" width="222" height="12" fill={wallFill} stroke={wallStroke} strokeWidth="1.5" />

              {/* Muro Oeste de la saliente norte del Ala Derecha (3.50 m) */}
              <rect x="350" y="90" width="12" height="210" fill={wallFill} stroke={wallStroke} strokeWidth="1.5" />

              {/* Muro común intermedio entre Ala Izquierda y Ala Derecha */}
              {/* Muro norte del pasillo */}
              <rect x="350" y="300" width="40" height="10" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
              {/* Muro sur del pasillo */}
              <rect x="350" y="413" width="40" height="10" fill={wallFill} stroke={wallStroke} strokeWidth="1.2" />
              {/* Muro divisorio continuo al sur del pasillo (hacia dormitorio 2) */}
              <rect x="350" y="423" width="12" height="195" fill={wallFill} stroke={wallStroke} strokeWidth="1.5" />

              {/* Tabiques interiores (e = 7 px) */}
              {/* Tabique Dormitorio 1 / Baño */}
              <rect x="390" y="303" width="170" height="7" fill={wallFill} stroke={wallStroke} strokeWidth="1" />

              {/* Tabique Baño / Pasillo */}
              <rect x="416" y="335" width="6" height="78" fill={wallFill} stroke={wallStroke} strokeWidth="1" />

              {/* Tabique Baño / Dormitorio 2 */}
              <rect x="390" y="406" width="170" height="7" fill={wallFill} stroke={wallStroke} strokeWidth="1" />

              {/* ============================================================ */}
              {/* 8. CARPINTERÍAS: VENTANAS (TRIPLE LÍNEA CON ANTEPECHO)       */}
              {/* ============================================================ */}
              {/* Ventana 1: Muro Norte Dormitorio 1 (1.50 m) */}
              <g transform="translate(415, 90)">
                <rect x="0" y="0" width="90" height="12" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                <line x1="0" y1="4" x2="90" y2="4" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="0" y1="8" x2="90" y2="8" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="45" y="-4" fill="#94a3b8" fontSize="7" textAnchor="middle">V: 1.50m</text>
              </g>

              {/* Ventana 2: Gran Ventanal Corredizo Lateral Estar (2.20 m) */}
              <g transform="translate(110, 440)">
                <rect x="0" y="0" width="12" height="120" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                <line x1="4" y1="0" x2="4" y2="120" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="8" y1="0" x2="8" y2="120" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="-8" y="65" fill="#94a3b8" fontSize="7" textAnchor="middle" transform="rotate(-90 -8 65)">
                  V: 2.00m DVH
                </text>
              </g>

              {/* Ventana 3: Ventana de Cocina sobre Mesada (1.20 m) */}
              <g transform="translate(110, 320)">
                <rect x="0" y="0" width="12" height="60" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                <line x1="4" y1="0" x2="4" y2="60" stroke="#38bdf8" strokeWidth="1.2" />
                <line x1="8" y1="0" x2="8" y2="60" stroke="#38bdf8" strokeWidth="1.2" />
              </g>

              {/* Ventana 4: Ventana Frontal Estar (1.50 m) */}
              <g transform="translate(160, 708)">
                <rect x="0" y="0" width="90" height="12" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                <line x1="0" y1="4" x2="90" y2="4" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="0" y1="8" x2="90" y2="8" stroke="#38bdf8" strokeWidth="1.5" />
              </g>

              {/* Ventana 5: Ventana Sur Dormitorio 2 (1.50 m) */}
              <g transform="translate(415, 618)">
                <rect x="0" y="0" width="90" height="12" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                <line x1="0" y1="4" x2="90" y2="4" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="0" y1="8" x2="90" y2="8" stroke="#38bdf8" strokeWidth="1.5" />
              </g>

              {/* ============================================================ */}
              {/* 9. COTAS TÉCNICAS REGLAMENTARIAS EN ROJO (IDÉNTICAS AL PDF)   */}
              {/* ============================================================ */}
              {layerDimensions && (
                <g stroke={dimensionColor} strokeWidth="1">
                  {/* COTA EXTERIOR IZQUIERDA: 7.00 m (Ala Izquierda completa) */}
                  <line x1="85" y1="300" x2="85" y2="720" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <line x1="80" y1="300" x2="110" y2="300" strokeWidth="0.5" />
                  <line x1="80" y1="720" x2="110" y2="720" strokeWidth="0.5" />
                  <rect x="68" y="495" width="34" height="18" fill={dimensionTextBg} stroke="none" />
                  <text x="85" y="508" fill={dimensionColor} fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(-90 85 508)">
                    7.00
                  </text>

                  {/* COTA SALIENTE NORTE: 3.50 m (Entre Ala Derecha y Ala Izquierda) */}
                  <line x1="330" y1="90" x2="330" y2="300" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <line x1="325" y1="90" x2="350" y2="90" strokeWidth="0.5" />
                  <line x1="325" y1="300" x2="350" y2="300" strokeWidth="0.5" />
                  <rect x="313" y="185" width="34" height="18" fill={dimensionTextBg} stroke="none" />
                  <text x="330" y="198" fill={dimensionColor} fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(-90 330 198)">
                    3.50
                  </text>

                  {/* COTA ANCHO EXTERIOR ALA DERECHA: 3.70 m */}
                  <line x1="350" y1="65" x2="572" y2="65" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <line x1="350" y1="60" x2="350" y2="90" strokeWidth="0.5" />
                  <line x1="572" y1="60" x2="572" y2="90" strokeWidth="0.5" />
                  <rect x="444" y="54" width="34" height="16" fill={dimensionTextBg} stroke="none" />
                  <text x="461" y="66" fill={dimensionColor} fontSize="12" fontWeight="bold" textAnchor="middle">
                    3.70
                  </text>

                  {/* COTA LARGO EXTERIOR TOTAL ALA DERECHA: 9.00 m */}
                  <line x1="600" y1="90" x2="600" y2="630" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <line x1="572" y1="90" x2="605" y2="90" strokeWidth="0.5" />
                  <line x1="572" y1="630" x2="605" y2="630" strokeWidth="0.5" />
                  <rect x="583" y="350" width="34" height="18" fill={dimensionTextBg} stroke="none" />
                  <text x="600" y="363" fill={dimensionColor} fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(90 600 363)">
                    9.00
                  </text>

                  {/* COTA DESFASE INFERIOR ENTRE ALAS: 1.50 m */}
                  <line x1="600" y1="630" x2="600" y2="720" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <line x1="350" y1="720" x2="605" y2="720" strokeWidth="0.5" />
                  <rect x="583" y="665" width="34" height="18" fill={dimensionTextBg} stroke="none" />
                  <text x="600" y="678" fill={dimensionColor} fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(90 600 678)">
                    1.50
                  </text>

                  {/* COTA INTERIOR ANCHO ESTAR-COMEDOR: 3.80 m */}
                  <line x1="122" y1="360" x2="350" y2="360" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <rect x="219" y="352" width="34" height="16" fill={dimensionTextBg} stroke="none" />
                  <text x="236" y="364" fill={dimensionColor} fontSize="12" fontWeight="bold" textAnchor="middle">
                    3.80
                  </text>

                  {/* COTA INTERIOR LARGO ESTAR-COMEDOR: 6.60 m */}
                  <line x1="330" y1="312" x2="330" y2="708" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <rect x="313" y="500" width="34" height="18" fill={dimensionTextBg} stroke="none" />
                  <text x="330" y="513" fill={dimensionColor} fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(-90 330 513)">
                    6.60
                  </text>

                  {/* COTA ANCHO PASILLO DISTRIBUIDOR: 0.90 m */}
                  <line x1="362" y1="355" x2="416" y2="355" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <rect x="372" y="347" width="34" height="15" fill={dimensionTextBg} stroke="none" />
                  <text x="389" y="358" fill={dimensionColor} fontSize="10" fontWeight="bold" textAnchor="middle">
                    0.90
                  </text>

                  {/* COTA INTERIOR ANCHO DORMITORIO 1: 3.30 m */}
                  <line x1="362" y1="135" x2="560" y2="135" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <rect x="444" y="127" width="34" height="16" fill={dimensionTextBg} stroke="none" />
                  <text x="461" y="139" fill={dimensionColor} fontSize="11" fontWeight="bold" textAnchor="middle">
                    3.30
                  </text>

                  {/* COTA INTERIOR LARGO DORMITORIO 1: 3.35 m */}
                  <line x1="440" y1="102" x2="440" y2="303" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <rect x="423" y="192" width="34" height="18" fill={dimensionTextBg} stroke="none" />
                  <text x="440" y="205" fill={dimensionColor} fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 440 205)">
                    3.35
                  </text>

                  {/* COTA INTERIOR ANCHO BAÑO: 2.30 m */}
                  <line x1="416" y1="345" x2="560" y2="345" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <rect x="471" y="337" width="34" height="16" fill={dimensionTextBg} stroke="none" />
                  <text x="488" y="349" fill={dimensionColor} fontSize="11" fontWeight="bold" textAnchor="middle">
                    2.30
                  </text>

                  {/* COTA INTERIOR PROFUNDIDAD BAÑO: 1.60 m */}
                  <line x1="428" y1="310" x2="428" y2="406" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <rect x="411" y="348" width="34" height="18" fill={dimensionTextBg} stroke="none" />
                  <text x="428" y="361" fill={dimensionColor} fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 428 361)">
                    1.60
                  </text>

                  {/* COTA INTERIOR ANCHO DORMITORIO 2: 3.30 m */}
                  <line x1="362" y1="445" x2="560" y2="445" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <rect x="444" y="437" width="34" height="16" fill={dimensionTextBg} stroke="none" />
                  <text x="461" y="449" fill={dimensionColor} fontSize="11" fontWeight="bold" textAnchor="middle">
                    3.30
                  </text>

                  {/* COTA INTERIOR LARGO DORMITORIO 2: 3.35 m */}
                  <line x1="440" y1="413" x2="440" y2="614" markerStart="url(#dotMarker)" markerEnd="url(#dotMarker)" />
                  <rect x="423" y="503" width="34" height="18" fill={dimensionTextBg} stroke="none" />
                  <text x="440" y="516" fill={dimensionColor} fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 440 516)">
                    3.35
                  </text>
                </g>
              )}

              {/* ============================================================ */}
              {/* 10. EJES ESTRUCTURALES Y NIVELES CAD (A, B, C / 1, 2, 3, 4)  */}
              {/* ============================================================ */}
              {layerAxes && (
                <g stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="6,3,1,3">
                  {/* Eje 1: Muro Norte Ala Derecha (y=90) */}
                  <line x1="310" y1="90" x2="620" y2="90" />
                  <g transform="translate(635, 90)">
                    <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="none" />
                    <text x="0" y="3.5" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">1</text>
                  </g>

                  {/* Eje 2: Muro Norte Cocina (y=300) */}
                  <line x1="70" y1="300" x2="620" y2="300" />
                  <g transform="translate(635, 300)">
                    <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="none" />
                    <text x="0" y="3.5" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">2</text>
                  </g>

                  {/* Eje 3: Muro Sur Ala Derecha (y=624) */}
                  <line x1="310" y1="624" x2="620" y2="624" />
                  <g transform="translate(635, 624)">
                    <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="none" />
                    <text x="0" y="3.5" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">3</text>
                  </g>

                  {/* Eje 4: Muro Sur Estar (y=714) */}
                  <line x1="70" y1="714" x2="400" y2="714" />
                  <g transform="translate(55, 714)">
                    <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="none" />
                    <text x="0" y="3.5" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">4</text>
                  </g>

                  {/* Eje A: Muro Oeste Estar (x=116) */}
                  <line x1="116" y1="260" x2="116" y2="760" />
                  <g transform="translate(116, 245)">
                    <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="none" />
                    <text x="0" y="3.5" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">A</text>
                  </g>

                  {/* Eje B: Muro Divisorio Central (x=356) */}
                  <line x1="356" y1="50" x2="356" y2="760" />
                  <g transform="translate(356, 35)">
                    <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="none" />
                    <text x="0" y="3.5" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">B</text>
                  </g>

                  {/* Eje C: Muro Este Ala Derecha (x=566) */}
                  <line x1="566" y1="50" x2="566" y2="670" />
                  <g transform="translate(566, 35)">
                    <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="none" />
                    <text x="0" y="3.5" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">C</text>
                  </g>
                </g>
              )}

              {/* ============================================================ */}
              {/* 11. ROSA DE LOS VIENTOS (SÍMBOLO NORTE REGLAMENTARIO)        */}
              {/* ============================================================ */}
              <g transform="translate(680, 110)">
                <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <path d="M 0 -18 L 4 0 L -4 0 Z" fill="#ef4444" stroke="#ef4444" />
                <path d="M 0 18 L 3 0 L -3 0 Z" fill="#64748b" stroke="#64748b" />
                <path d="M -18 0 L 0 3 L 0 -3 Z" fill="#475569" stroke="#475569" />
                <path d="M 18 0 L 0 3 L 0 -3 Z" fill="#475569" stroke="#475569" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                <text x="0" y="-24" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">N</text>
                <text x="0" y="30" fill="#64748b" fontSize="7" textAnchor="middle">NORTE</text>
              </g>

              {/* ============================================================ */}
              {/* 12. PUNTOS EXTERIORES DE CÁMARA 360 (FACHADAS 1, 2, 3, 4)    */}
              {/* ============================================================ */}
              {interactive && (
                <g>
                  {/* Fachada 1: Frente */}
                  <g onClick={() => handleRoomClick('fachada-frontal')} className="cursor-pointer group">
                    <circle cx="236" cy="780" r="14" fill="#047857" stroke="#ffffff" strokeWidth="2" className="transition-transform group-hover:scale-125" />
                    <text x="236" y="784" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                    <text x="236" y="805" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">Fachada Frente</text>
                  </g>

                  {/* Fachada 2: Lateral Galería */}
                  <g onClick={() => handleRoomClick('fachada-lateral')} className="cursor-pointer group">
                    <circle cx="50" cy="500" r="14" fill="#047857" stroke="#ffffff" strokeWidth="2" className="transition-transform group-hover:scale-125" />
                    <text x="50" y="504" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>
                    <text x="50" y="525" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">Lateral</text>
                  </g>

                  {/* Fachada 3: Trasera Jardín */}
                  <g onClick={() => handleRoomClick('fachada-trasera')} className="cursor-pointer group">
                    <circle cx="461" cy="40" r="14" fill="#047857" stroke="#ffffff" strokeWidth="2" className="transition-transform group-hover:scale-125" />
                    <text x="461" y="44" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">3</text>
                    <text x="461" y="22" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">Trasera</text>
                  </g>

                  {/* Fachada 4: Esquina en L */}
                  <g onClick={() => handleRoomClick('fachada-esquina')} className="cursor-pointer group">
                    <circle cx="290" cy="240" r="14" fill="#047857" stroke="#ffffff" strokeWidth="2" className="transition-transform group-hover:scale-125" />
                    <text x="290" y="244" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">4</text>
                    <text x="290" y="265" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">Esquina L</text>
                  </g>

                  {/* Vista Cenital Aérea (Dron) */}
                  <g onClick={() => handleRoomClick('vista-aerea')} className="cursor-pointer group">
                    <circle cx="680" cy="210" r="16" fill="#d97706" stroke="#ffffff" strokeWidth="2" className="transition-transform group-hover:scale-125" />
                    <text x="680" y="215" fill="#ffffff" fontSize="12" textAnchor="middle">🚁</text>
                    <text x="680" y="238" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle">Vista Aérea</text>
                  </g>
                </g>
              )}

              {/* ============================================================ */}
              {/* 13. RÓTULO TÉCNICO ARQUITECTÓNICO (IDÉNTICO AL PDF)          */}
              {/* ============================================================ */}
              <g transform="translate(25, 915)">
                {/* Marco del rótulo */}
                <rect x="0" y="0" width="710" height="75" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <line x1="355" y1="0" x2="355" y2="75" stroke="#334155" strokeWidth="1.5" />

                {/* Mitad izquierda: VIVIENDAS TRATO HECHO • Modulo 2 */}
                <text x="20" y="28" fill="#f8fafc" fontSize="15" fontWeight="bold" letterSpacing="1.5">
                  VIVIENDAS TRATO HECHO
                </text>
                <text x="20" y="48" fill="#94a3b8" fontSize="12" letterSpacing="1">
                  Modulo 2
                </text>
                <text x="20" y="64" fill="#64748b" fontSize="9">
                  Planta Baja Única • Sin Planta Alta • Techo Plano
                </text>

                {/* Mitad derecha: PLANTA - 1 DORMITORIO / 60M2 */}
                <text x="375" y="28" fill="#f8fafc" fontSize="13" fontWeight="bold" letterSpacing="1">
                  PLANTA - 1 DORMITORIO (MODULAR)
                </text>
                <text x="375" y="48" fill="#10b981" fontSize="13" fontWeight="bold">
                  60M2
                </text>
                <text x="500" y="48" fill="#94a3b8" fontSize="10">
                  Escala 1:50 • Cotas en Metros (m)
                </text>
                <text x="375" y="64" fill="#64748b" fontSize="9">
                  Tipología en L • Materialidad: Hormigón, Madera y Piedra
                </text>
              </g>
            </svg>
          </div>

          {/* FICHA TÉCNICA FLOTANTE DEL AMBIENTE SELECCIONADO */}
          {selectedRoom && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md bg-neutral-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-3 duration-200 z-20">
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2 mb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      {selectedRoom.name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                    Medidas: {selectedRoom.dimensions} ({selectedRoom.netArea})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300 mb-3">
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-white/5">
                  <span className="text-neutral-500 block text-[10px]">Altura & Volumen:</span>
                  <span className="font-semibold text-white">H = {selectedRoom.height} • {selectedRoom.volume}</span>
                </div>
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-white/5">
                  <span className="text-neutral-500 block text-[10px]">Orientación:</span>
                  <span className="font-semibold text-white">{selectedRoom.orientation}</span>
                </div>
                <div className="col-span-2 bg-neutral-950/70 p-2 rounded-lg border border-white/5">
                  <span className="text-neutral-500 block text-[10px]">Ventilación & Iluminación:</span>
                  <span className="text-neutral-300">{selectedRoom.ventilation}</span>
                </div>
                <div className="col-span-2 bg-neutral-950/70 p-2 rounded-lg border border-white/5">
                  <span className="text-neutral-500 block text-[10px]">Revestimiento & Aberturas:</span>
                  <span className="text-neutral-300">{selectedRoom.flooring} • {selectedRoom.openings}</span>
                </div>
              </div>

              {interactive && onSelectScene && (
                <button
                  onClick={() => {
                    handleRoomClick(selectedRoom.sceneId);
                    setSelectedRoom(null);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver este ambiente en Visor 360°</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pie interactivo con instrucción rápida */}
      {interactive && variant === 'full' && (
        <div className="p-2.5 bg-neutral-900 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Toca o haz clic en cualquier <strong>ambiente</strong> o <strong>marcador de fachada (1, 2, 3, 4)</strong> para teletransportarte en el visor 360°.
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span>Área Total: 60.00 m²</span>
          </div>
        </div>
      )}
    </div>
  );
};
