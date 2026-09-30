import React, { useState } from 'react';
import { HouseModel, NavigationTab } from '../../types';
import { HOUSE_MODELS } from '../../data/models';
import {
  Compass,
  ArrowRight,
  Grid,
  CheckCircle2,
  Maximize2,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  FileText
} from 'lucide-react';
import { ArchitecturalFloorPlan } from '../ArchitecturalFloorPlan';

interface ModelsViewProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  onTabChange: (tab: NavigationTab) => void;
  onOpen360Tour: () => void;
}

export function ModelsView({
  selectedModelId,
  onSelectModel,
  onTabChange,
  onOpen360Tour
}: ModelsViewProps) {
  const [activeTabModelId, setActiveTabModelId] = useState<string>(selectedModelId || 'modelo-01');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [showPlanCadModal, setShowPlanCadModal] = useState<boolean>(false);
  const [planMode, setPlanMode] = useState<'corte-3d' | 'cad-2d'>('corte-3d');

  const activeModel =
    HOUSE_MODELS.find((m) => m.id === activeTabModelId) || HOUSE_MODELS[0];

  const handleModelChange = (id: string) => {
    setActiveTabModelId(id);
    onSelectModel(id);
    setActiveGalleryIndex(0);
  };

  return (
    <div className="w-full bg-[#121415] text-neutral-100 min-h-screen">
      {/* 1. ENCABEZADO DE SECCIÓN */}
      <div className="border-b border-white/10 bg-[#0D0F10] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
            Catálogo de Arquitectura MHC · Steel Frame
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Modelos de Vivienda
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-2xl leading-relaxed">
            Proyectos prediseñados y calculados con precisión milimétrica para Monte Hermoso. Cada modelo cuenta con optimización bioclimática, planos técnicos y posibilidad de personalización integral.
          </p>

          {/* SELECTOR SEGMENTADO DE MODELOS */}
          <div className="pt-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {HOUSE_MODELS.map((m) => {
              const isSelected = m.id === activeModel.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModelChange(m.id)}
                  className={`px-5 py-3 text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2.5 border ${
                    isSelected
                      ? 'bg-[#E7E1D8] text-black border-[#E7E1D8] font-bold shadow-lg'
                      : 'bg-neutral-900/80 text-neutral-400 border-white/10 hover:text-white hover:border-white/25'
                  }`}
                >
                  <span>{m.name}</span>
                  <span className="text-[11px] opacity-70">({m.surfaceTotal} m²)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. FICHA TÉCNICA PRINCIPAL DEL MODELO SELECCIONADO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* GALERÍA DE IMÁGENES Y VISUALIZADOR */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] bg-black border border-white/10 overflow-hidden">
              <img
                src={activeModel.galleryImages[activeGalleryIndex] || activeModel.mainImage}
                alt={activeModel.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Botón flotante para ingresar al Recorrido 360 si es Modelo 01 */}
              {activeModel.has360Tour && (
                <button
                  onClick={onOpen360Tour}
                  className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2.5 bg-black/80 hover:bg-black text-[#E7E1D8] border border-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <Compass className="w-4 h-4 text-[#E7E1D8]" />
                  <span>Explorar en Tour 360°</span>
                </button>
              )}

              {/* Botón de ver plano CAD */}
              <button
                onClick={() => setShowPlanCadModal(true)}
                className="absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-2.5 bg-neutral-900/80 hover:bg-neutral-900 text-white border border-white/20 backdrop-blur-md text-xs font-medium transition-all"
              >
                <Grid className="w-4 h-4 text-[#E7E1D8]" />
                <span className="hidden sm:inline">Ver Plano CAD</span>
              </button>
            </div>

            {/* MINIATURAS DE LA GALERÍA */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {activeModel.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`aspect-[16/10] bg-neutral-900 border overflow-hidden transition-all ${
                    activeGalleryIndex === idx
                      ? 'border-[#E7E1D8] opacity-100 ring-1 ring-[#E7E1D8]'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* AVISO DEL VISOR 360 INTEGRADO */}
            {activeModel.has360Tour && (
              <div className="p-4 bg-neutral-900/70 border border-[#2E3B33] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#E7E1D8]" />
                    <span>Experiencia Inmersiva 360° Disponible</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Recorré el exterior, living, cocina integrada, suite y baño completo con vistas equirrectangulares HD y fotografías rectilíneas sin distorsión.
                  </div>
                </div>
                <button
                  onClick={onOpen360Tour}
                  className="px-4 py-2 bg-[#2E3B33] hover:bg-[#38483e] text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors"
                >
                  Abrir Tour
                </button>
              </div>
            )}
          </div>

          {/* ESPECIFICACIONES TÉCNICAS Y BOTONES COMERCIALES */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#8A8D8F] uppercase tracking-wider">
                <span>Monte Hermoso</span>
                <span>·</span>
                <span>Llave en Mano en ~{activeModel.deliveryTimeDays} días</span>
              </div>
              <h2 className="text-3xl font-light text-white">{activeModel.name}</h2>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                {activeModel.tagline}
              </p>
            </div>

            {/* TABLA DE SUPERFICIES Y AMBIENTES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-white/10 text-xs">
              <div className="p-3 bg-neutral-900/60 border border-white/5">
                <span className="text-[10px] text-[#8A8D8F] uppercase block">Sup. Cubierta</span>
                <span className="text-base font-semibold text-white">{activeModel.surfaceCovered} m²</span>
              </div>
              <div className="p-3 bg-neutral-900/60 border border-white/5">
                <span className="text-[10px] text-[#8A8D8F] uppercase block">Semicubierta</span>
                <span className="text-base font-semibold text-white">{activeModel.surfaceSemiCovered} m²</span>
              </div>
              <div className="p-3 bg-neutral-900/60 border border-white/5">
                <span className="text-[10px] text-[#8A8D8F] uppercase block">Dormitorios</span>
                <span className="text-base font-semibold text-white">{activeModel.bedrooms} Dorm.</span>
              </div>
              <div className="p-3 bg-neutral-900/60 border border-white/5">
                <span className="text-[10px] text-[#8A8D8F] uppercase block">Baños</span>
                <span className="text-base font-semibold text-white">{activeModel.bathrooms} Baños</span>
              </div>
            </div>

            {/* PRECIO ESTIMATIVO Y ACCIONES CLAVE */}
            <div className="p-5 bg-neutral-900 border border-white/10 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8A8D8F]">
                    Estimación de Inversión Desde
                  </div>
                  <div className="text-2xl font-semibold text-[#E7E1D8]">
                    U$S {activeModel.basePriceUSD.toLocaleString('es-AR')}
                  </div>
                </div>
                <div className="text-right text-[11px] text-neutral-400">
                  Total {activeModel.surfaceTotal} m²
                  <span className="block text-[10px] text-[#8A8D8F]">
                    (~{Math.round(activeModel.basePriceUSD / activeModel.surfaceTotal)} U$S/m²)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => {
                    onSelectModel(activeModel.id);
                    onTabChange('cotizador');
                  }}
                  className="w-full py-3 bg-[#2E3B33] hover:bg-[#38483e] text-white text-xs font-semibold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Personalizar y Cotizar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    onSelectModel(activeModel.id);
                    onTabChange('contacto');
                  }}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-medium uppercase tracking-wider text-center border border-white/10 transition-colors"
                >
                  Solicitar Información
                </button>
              </div>

              <div className="text-[10px] text-neutral-400 text-center leading-normal">
                Cotización estimativa hasta validación técnica de lote por parte de MHC.
              </div>
            </div>

            {/* CARACTERÍSTICAS TÉCNICAS CONSTRUCTIVAS */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
                Características Constructivas
              </h4>
              <div className="space-y-2 text-xs text-neutral-300">
                {activeModel.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8A8D8F] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* APTITUD Y FINALIDAD */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#8A8D8F]">
                Propósito Ideal
              </h4>
              <div className="space-y-1 text-xs text-neutral-400">
                {activeModel.idealFor.map((item, idx) => (
                  <div key={idx}>• {item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. DESGLOSE DETALLADO DE AMBIENTES */}
        <div className="border-t border-white/10 pt-12 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              Distribución Arquitectónica
            </span>
            <h3 className="text-2xl font-light text-white">Dimensiones y Ambientes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeModel.roomsBreakdown.map((room, idx) => (
              <div key={idx} className="p-5 bg-neutral-900/80 border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-white">{room.name}</h4>
                  <span className="text-xs font-mono text-[#E7E1D8]">{room.surface}</span>
                </div>
                <div className="text-[11px] text-[#8A8D8F] font-mono">Dimensiones: {room.dimensions}</div>
                <div className="pt-2 border-t border-white/5 space-y-1">
                  {room.features.map((f, fIdx) => (
                    <div key={fIdx} className="text-xs text-neutral-400">
                      • {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. MODAL PLANO CAD & CORTE ISOMÉTRICO */}
      {showPlanCadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-white/15 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 bg-neutral-950 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#E7E1D8]" />
                <h3 className="text-sm md:text-base font-semibold text-white">
                  Plano & Volumetría — {activeModel.name}
                </h3>
              </div>
              <button
                onClick={() => setShowPlanCadModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPlanMode('corte-3d')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg ${
                    planMode === 'corte-3d'
                      ? 'bg-[#2E3B33] text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Corte Isométrico 3D
                </button>
                <button
                  onClick={() => setPlanMode('cad-2d')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg ${
                    planMode === 'cad-2d'
                      ? 'bg-[#2E3B33] text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Plano CAD 2D Interactivo
                </button>
              </div>

              {planMode === 'corte-3d' ? (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                  <img
                    src={activeModel.floorPlanImage}
                    alt="Corte 3D"
                    className="w-full max-h-[500px] object-contain"
                  />
                </div>
              ) : (
                <ArchitecturalFloorPlan
                  currentScene="fachada-frontal"
                  onSelectScene={() => {}}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
