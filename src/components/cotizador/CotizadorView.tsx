import React, { useState, useMemo } from 'react';
import { HouseModel, NavigationTab, QuotationSelection, QuotationResult } from '../../types';
import { HOUSE_MODELS } from '../../data/models';
import {
  FINISHING_TIERS,
  MATERIAL_OPTIONS,
  OPTIONAL_ITEMS,
  PRICING_METADATA
} from '../../data/pricingConfig';
import {
  calculateQuotation,
  formatQuotationSummaryText,
  getWhatsAppQuotationLink
} from '../../services/pricingEngine';
import {
  Check,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Share2,
  FileSpreadsheet,
  Download,
  Send,
  TrendingUp,
  FileText,
  Printer
} from 'lucide-react';
import { TourismRoiCalculator } from './TourismRoiCalculator';
import { DossierModal } from '../dossier/DossierModal';

interface CotizadorViewProps {
  initialModelId?: string;
  onTabChange: (tab: NavigationTab) => void;
  onSendQuotationToContact: (quote: QuotationResult) => void;
}

export function CotizadorView({
  initialModelId = 'modelo-01',
  onTabChange,
  onSendQuotationToContact
}: CotizadorViewProps) {
  // Estado de selección del configurador
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId);
  const [selectedTierId, setSelectedTierId] = useState<'obra-gris' | 'estandar' | 'premium'>('estandar');
  const [selectedMaterials, setSelectedMaterials] = useState<{
    aberturas: string;
    pisos: string;
    exterior: string;
    climatizacion: string;
  }>({
    aberturas: 'ab-modena',
    pisos: 'pi-porcelanato-60',
    exterior: 'ext-eifs',
    climatizacion: 'clim-preinstalacion'
  });
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);
  const [cotizadorTab, setCotizadorTab] = useState<'configurador' | 'rentabilidad'>('configurador');
  const [userName, setUserName] = useState<string>('');

  // Paso activo en la interfaz
  const [activeStep, setActiveStep] = useState<number>(1);

  // Cálculo en tiempo real desacoplado mediante pricingEngine
  const quotationResult: QuotationResult = useMemo(() => {
    const selection: QuotationSelection = {
      modelId: selectedModelId,
      finishingTierId: selectedTierId,
      materials: selectedMaterials,
      selectedOptionals: selectedOptionals
    };
    return calculateQuotation(selection);
  }, [selectedModelId, selectedTierId, selectedMaterials, selectedOptionals]);

  // Manejador de selección de materiales
  const handleMaterialSelect = (category: 'aberturas' | 'pisos' | 'exterior' | 'climatizacion', id: string) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [category]: id
    }));
  };

  // Manejador de toggling de opcionales
  const toggleOptional = (id: string) => {
    setSelectedOptionals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // WhatsApp comercial de MHC
  const MHC_WHATSAPP_PHONE = '5492914000000';
  const whatsappUrl = useMemo(() => {
    const text = formatQuotationSummaryText(quotationResult, userName || undefined);
    return getWhatsAppQuotationLink(MHC_WHATSAPP_PHONE, text);
  }, [quotationResult, userName]);

  const handleProceedToContact = () => {
    onSendQuotationToContact(quotationResult);
    onTabChange('contacto');
  };

  return (
    <div className="w-full bg-[#121415] text-neutral-100 min-h-screen">
      {/* 1. ENCABEZADO DEL COTIZADOR */}
      <div className="border-b border-white/10 bg-[#0D0F10] py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
            <span>Cotizador Online</span>
            <span>·</span>
            <span>Motor Desacoplado 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Personalizá tu Vivienda Steel Frame
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-2xl leading-relaxed">
            Elegí el modelo, definí el nivel de terminación y seleccioná materiales y opcionales. El presupuesto se actualiza en tiempo real con transparencia total.
          </p>

          {/* SELECTOR ENTRE CONFIGURADOR Y SIMULADOR DE RENTA TURÍSTICA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-1.5 bg-neutral-900 p-1 border border-white/10">
              <button
                onClick={() => setCotizadorTab('configurador')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  cotizadorTab === 'configurador'
                    ? 'bg-[#E7E1D8] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                1. Configurador de Vivienda
              </button>
              <button
                onClick={() => setCotizadorTab('rentabilidad')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                  cotizadorTab === 'rentabilidad'
                    ? 'bg-[#2E3B33] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#E7E1D8]" />
                <span>2. Simulador Renta Turística (ROI)</span>
              </button>
            </div>

            {/* BOTÓN DOSSIER PDF */}
            <button
              onClick={() => setShowDossierModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider border border-white/15 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#E7E1D8]" />
              <span>Dossier Ejecutivo PDF</span>
            </button>
          </div>

          {/* INDICADOR DE PASOS SI ESTÁ EN MODO CONFIGURADOR */}
          {cotizadorTab === 'configurador' && (
            <div className="pt-2 flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar text-xs font-mono">
              {[
                { num: 1, label: '1. Modelo' },
                { num: 2, label: '2. Nivel de Terminación' },
                { num: 3, label: '3. Materiales' },
                { num: 4, label: '4. Opcionales' }
              ].map((step) => (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`px-3.5 py-2 border transition-all ${
                    activeStep === step.num
                      ? 'border-[#E7E1D8] text-[#E7E1D8] bg-white/5 font-semibold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. ÁREA DE CONFIGURACIÓN Y PANEL LATERAL EN TIEMPO REAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* COLUMNA IZQUIERDA: PASOS DE SELECCIÓN O SIMULADOR ROI */}
          <div className="lg:col-span-7 space-y-12">
            {cotizadorTab === 'rentabilidad' ? (
              <div className="space-y-6 animate-in fade-in duration-200">
                <TourismRoiCalculator
                  model={quotationResult.model}
                  totalEstimatedInvestmentUSD={quotationResult.totalEstimatedUSD}
                />
              </div>
            ) : (
              <>
            {/* PASO 1: SELECCIÓN DE MODELO */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#E7E1D8] uppercase tracking-wider">
                    Paso 1 de 4
                  </span>
                  <h2 className="text-xl font-medium text-white">Elegir Modelo de Vivienda</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HOUSE_MODELS.map((model) => {
                  const isSelected = model.id === selectedModelId;
                  return (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModelId(model.id)}
                      className={`cursor-pointer border p-4 space-y-3 transition-all ${
                        isSelected
                          ? 'border-[#E7E1D8] bg-white/5 shadow-md ring-1 ring-[#E7E1D8]'
                          : 'border-white/10 bg-neutral-900/60 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-[16/10] bg-black overflow-hidden relative">
                        <img
                          src={model.mainImage}
                          alt={model.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#E7E1D8] text-black flex items-center justify-center font-bold text-xs">
                            ✓
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold text-white text-sm">{model.name}</div>
                        <div className="text-xs text-[#8A8D8F] font-mono">{model.surfaceTotal} m² totales</div>
                      </div>

                      <div className="text-[11px] text-neutral-400 space-y-0.5 border-t border-white/5 pt-2">
                        <div>{model.bedrooms} Dormitorios · {model.bathrooms} Baños</div>
                        <div>Cubiertos: {model.surfaceCovered} m²</div>
                      </div>

                      <div className="text-xs font-semibold text-[#E7E1D8] pt-1">
                        Base: U$S {model.basePriceUSD.toLocaleString('es-AR')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PASO 2: NIVEL DE TERMINACIÓN */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <div>
                <span className="text-[11px] font-mono text-[#E7E1D8] uppercase tracking-wider">
                  Paso 2 de 4
                </span>
                <h2 className="text-xl font-medium text-white">Nivel de Terminación</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Elegí el alcance de la entrega según tu objetivo (obra avanzada o llave en mano completo).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {FINISHING_TIERS.map((tier) => {
                  const isSelected = tier.id === selectedTierId;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`cursor-pointer border p-5 transition-all space-y-3 ${
                        isSelected
                          ? 'border-[#E7E1D8] bg-white/5 shadow-md ring-1 ring-[#E7E1D8]'
                          : 'border-white/10 bg-neutral-900/60 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                              isSelected
                                ? 'border-[#E7E1D8] bg-[#E7E1D8] text-black font-bold'
                                : 'border-neutral-500'
                            }`}
                          >
                            {isSelected ? '✓' : ''}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-white">{tier.name}</h3>
                            <span className="text-xs text-neutral-400">{tier.subtitle}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono text-[#E7E1D8]">
                            ~{tier.pricePerM2USD} U$S/m²
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 font-light leading-relaxed pl-8">
                        {tier.description}
                      </p>

                      <div className="pl-8 pt-2 space-y-1 text-[11px] text-[#8A8D8F]">
                        <div className="font-semibold text-neutral-400 uppercase text-[10px]">
                          Incluye principalmente:
                        </div>
                        {tier.includedItems.slice(0, 4).map((item, idx) => (
                          <div key={idx}>• {item}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PASO 3: SELECCIÓN DE MATERIALES Y ACABADOS */}
            <section className="space-y-6 pt-6 border-t border-white/10">
              <div>
                <span className="text-[11px] font-mono text-[#E7E1D8] uppercase tracking-wider">
                  Paso 3 de 4
                </span>
                <h2 className="text-xl font-medium text-white">Materiales & Terminaciones</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Personalizá aberturas, pisos, fachada exterior y sistema de climatización.
                </p>
              </div>

              {/* Categorías de materiales */}
              {(['aberturas', 'pisos', 'exterior', 'climatizacion'] as const).map((category) => {
                const options = MATERIAL_OPTIONS.filter((o) => o.category === category);
                const categoryTitle = options[0]?.categoryLabel || category;
                const currentSelected = selectedMaterials[category];

                return (
                  <div key={category} className="space-y-3 bg-neutral-900/40 p-4 border border-white/5">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
                      {categoryTitle}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {options.map((opt) => {
                        const isSelected = currentSelected === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => handleMaterialSelect(category, opt.id)}
                            className={`p-3.5 border text-xs cursor-pointer flex flex-col justify-between transition-all ${
                              isSelected
                                ? 'border-[#E7E1D8] bg-white/10 text-white font-medium shadow-sm ring-1 ring-[#E7E1D8]'
                                : 'border-white/10 bg-neutral-950/60 text-neutral-400 hover:text-white hover:border-white/20'
                            }`}
                          >
                            <div className="space-y-2">
                              {/* SWATCH TÁCTIL Y HINT ARQUITECTÓNICO */}
                              <div className="flex items-center gap-2">
                                {opt.swatchColor && (
                                  <div
                                    className="w-4 h-4 rounded-xs shrink-0 border border-white/20 shadow-xs"
                                    style={{ backgroundColor: opt.swatchColor }}
                                    title={opt.textureHint || opt.name}
                                  />
                                )}
                                <span className="text-[10px] font-mono text-[#8A8D8F] uppercase tracking-wider line-clamp-1">
                                  {opt.textureHint || opt.category}
                                </span>
                              </div>

                              <div className="font-semibold text-white leading-snug">{opt.name}</div>

                              {opt.technicalBadge && (
                                <div className="inline-block text-[10px] font-mono text-[#E7E1D8] bg-white/5 px-2 py-0.5 border border-white/10">
                                  {opt.technicalBadge}
                                </div>
                              )}

                              <p className="text-[11px] text-neutral-400 leading-snug">
                                {opt.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-white/5 mt-2 flex items-center justify-between text-[11px] font-mono">
                              <span className="text-neutral-500">Ajuste:</span>
                              <span className="text-[#E7E1D8] font-semibold">
                                {opt.priceDeltaUSD === 0
                                  ? 'Incluido base'
                                  : `+ U$S ${opt.priceDeltaUSD.toLocaleString('es-AR')}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* PASO 4: ADICIONALES Y OPCIONALES */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <div>
                <span className="text-[11px] font-mono text-[#E7E1D8] uppercase tracking-wider">
                  Paso 4 de 4
                </span>
                <h2 className="text-xl font-medium text-white">Adicionales & Opcionales</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Agregá comodidades exteriores para maximizar el disfrute y la rentabilidad en Monte Hermoso.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OPTIONAL_ITEMS.map((opt) => {
                  const isChecked = selectedOptionals.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOptional(opt.id)}
                      className={`p-4 border cursor-pointer flex items-start gap-3 transition-all ${
                        isChecked
                          ? 'border-[#E7E1D8] bg-white/5 shadow-sm'
                          : 'border-white/10 bg-neutral-900/60 hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 mt-0.5 border flex items-center justify-center text-xs shrink-0 ${
                          isChecked
                            ? 'border-[#E7E1D8] bg-[#E7E1D8] text-black font-bold'
                            : 'border-neutral-500'
                        }`}
                      >
                        {isChecked ? '✓' : ''}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-white">{opt.name}</span>
                          <span className="text-xs font-mono text-[#E7E1D8] shrink-0">
                            + U$S {opt.priceUSD.toLocaleString('es-AR')}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug">{opt.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            </>
            )}
          </div>

          {/* COLUMNA DERECHA: PANEL FLOTANTE DE RESUMEN EN TIEMPO REAL */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-neutral-900 border border-white/15 p-6 md:p-8 space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] font-mono text-[#E7E1D8] uppercase tracking-widest block">
                  Resumen de Inversión
                </span>
                <h3 className="text-xl font-light text-white">
                  {quotationResult.model.name} · {quotationResult.model.surfaceTotal} m²
                </h3>
                <div className="text-xs text-[#8A8D8F] font-mono mt-0.5">
                  {quotationResult.finishingTier.name}
                </div>
              </div>

              {/* DESGLOSE DETALLADO */}
              <div className="space-y-2.5 text-xs border-y border-white/10 py-4 font-mono">
                <div className="flex justify-between text-neutral-300">
                  <span>Precio Base Modelo ({quotationResult.model.surfaceCovered} m²):</span>
                  <span>U$S {quotationResult.basePrice.toLocaleString('es-AR')}</span>
                </div>

                {quotationResult.tierDelta !== 0 && (
                  <div className="flex justify-between text-neutral-300">
                    <span>Ajuste {quotationResult.finishingTier.name}:</span>
                    <span>
                      {quotationResult.tierDelta > 0 ? '+' : ''} U$S{' '}
                      {quotationResult.tierDelta.toLocaleString('es-AR')}
                    </span>
                  </div>
                )}

                {quotationResult.materialsTotal > 0 && (
                  <div className="flex justify-between text-neutral-300">
                    <span>Personalización Materiales:</span>
                    <span>+ U$S {quotationResult.materialsTotal.toLocaleString('es-AR')}</span>
                  </div>
                )}

                {quotationResult.optionalsTotal > 0 && (
                  <div className="flex justify-between text-neutral-300">
                    <span>Opcionales Seleccionados ({quotationResult.optionalsBreakdown.length}):</span>
                    <span>+ U$S {quotationResult.optionalsTotal.toLocaleString('es-AR')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-white/5 flex justify-between text-[#8A8D8F] text-[11px]">
                  <span>Plazo Estimado Llave en Mano:</span>
                  <span>~{quotationResult.estimatedDeliveryMonths} meses</span>
                </div>

                <div className="flex justify-between text-[#8A8D8F] text-[11px]">
                  <span>Promedio por m² total:</span>
                  <span>U$S {quotationResult.pricePerM2USD} / m²</span>
                </div>
              </div>

              {/* TOTAL ESTIMADO */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#8A8D8F]">
                  Cotización Estimativa Total
                </div>
                <div className="text-3xl font-light text-white tracking-tight">
                  <span className="text-base text-neutral-400 font-normal mr-1.5">U$S</span>
                  <span className="font-semibold text-[#E7E1D8]">
                    {quotationResult.totalEstimatedUSD.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 leading-normal">
                  Identificación legal: <strong className="text-neutral-300">Estimación de inversión orientativa</strong> sujeta a validación técnica y topográfica del lote por MHC.
                </div>
              </div>

              {/* ACCIONES DEL COTIZADOR */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleProceedToContact}
                  className="w-full py-3.5 bg-[#E7E1D8] hover:bg-white text-black text-xs font-semibold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Solicitar Cotización Formal</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#2E3B33] hover:bg-[#38483e] text-white text-xs font-semibold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 border border-[#3f5145]"
                >
                  <span>Consultar por WhatsApp con este Desglose</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs text-center border border-white/10 transition-colors"
                >
                  Ver Ficha de Desglose Completa
                </button>

                <button
                  onClick={() => setShowDossierModal(true)}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[#E7E1D8] text-xs font-semibold uppercase tracking-wider text-center border border-white/15 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-[#E7E1D8]" />
                  <span>Dossier Técnico en PDF / Imprimir</span>
                </button>
              </div>

              {/* AVISO DE GOOGLE SHEETS / DRIVE DESACOPLADO */}
              <div className="text-[10px] text-[#8A8D8F] flex items-center gap-2 pt-2 border-t border-white/5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#E7E1D8]" />
                <span>Base de precios centralizada y desacoplada de la interfaz.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODAL DE RESUMEN COMPLETO DE COTIZACIÓN */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-white/15 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#E7E1D8] uppercase tracking-wider">
                  MHC Steel Frame Monte Hermoso
                </span>
                <h3 className="text-xl font-medium text-white">Estimación de Inversión</h3>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-neutral-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-3 bg-neutral-950 border border-white/5 space-y-1">
                <div className="text-white font-semibold">{quotationResult.model.name}</div>
                <div className="text-neutral-400">
                  {quotationResult.model.surfaceCovered} m² cubiertos + {quotationResult.model.surfaceSemiCovered} m² semicubiertos ({quotationResult.model.surfaceTotal} m² totales)
                </div>
                <div className="text-[#E7E1D8]">Nivel: {quotationResult.finishingTier.name}</div>
              </div>

              {quotationResult.materialsBreakdown.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-semibold text-neutral-300 uppercase text-[10px]">
                    Materiales Personalizados:
                  </div>
                  {quotationResult.materialsBreakdown.map((m, idx) => (
                    <div key={idx} className="flex justify-between text-neutral-400">
                      <span>• {m.category}: {m.name}</span>
                      <span>U$S {m.price.toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>
              )}

              {quotationResult.optionalsBreakdown.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-semibold text-neutral-300 uppercase text-[10px]">
                    Opcionales Seleccionados:
                  </div>
                  {quotationResult.optionalsBreakdown.map((o, idx) => (
                    <div key={idx} className="flex justify-between text-neutral-400">
                      <span>• {o.name}</span>
                      <span>U$S {o.price.toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 bg-neutral-950 border border-white/10 flex items-center justify-between">
                <span className="text-neutral-300 font-semibold">TOTAL ESTIMADO (USD):</span>
                <span className="text-xl font-bold text-[#E7E1D8]">
                  U$S {quotationResult.totalEstimatedUSD.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  handleProceedToContact();
                }}
                className="px-5 py-2.5 bg-[#2E3B33] hover:bg-[#38483e] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Proceder a Contacto
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 4. MODAL DE DOSSIER EDITORIAL IMPRIMIBLE */}
      {showDossierModal && (
        <DossierModal
          model={quotationResult.model}
          quotation={quotationResult}
          onClose={() => setShowDossierModal(false)}
        />
      )}
    </div>
  );
}
