import React from 'react';
import { HouseModel, QuotationResult } from '../../types';
import { Printer, Download, X, CheckCircle2, Building, ShieldCheck, MapPin } from 'lucide-react';

interface DossierModalProps {
  model: HouseModel;
  quotation?: QuotationResult | null;
  onClose: () => void;
}

export function DossierModal({ model, quotation, onClose }: DossierModalProps) {
  const currentDate = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const estimatedTotal = quotation
    ? quotation.totalEstimatedUSD
    : model.basePriceUSD;

  const finishingTierName = quotation
    ? quotation.finishingTier.name
    : 'Llave en Mano Estándar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-[#121415] border border-white/20 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* BARRA DE ACCIONES SUPERIOR (Oculta al imprimir) */}
        <div className="flex items-center justify-between p-4 bg-neutral-900 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E7E1D8]" />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-200">
              Dossier Técnico Ejecutivo · {model.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#2E3B33] hover:bg-[#38483e] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#E7E1D8]" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CUERPO DEL DOSSIER EDITORIAL IMPRIMIBLE */}
        <div id="printable-dossier" className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-white text-neutral-900 font-sans">
          {/* CABECERA EDITORIAL */}
          <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-lg">
                  M
                </div>
                <div>
                  <h1 className="font-mono text-2xl font-bold tracking-widest text-neutral-900">MHC</h1>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
                    Steel Frame Arquitectura · Monte Hermoso, Bs. As.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-neutral-600">
              <div>Fecha de Emisión: {currentDate}</div>
              <div>Validez presupuestaria: 15 días corridos</div>
              <div className="font-semibold text-neutral-900">REF: DOSSIER-MHC-{model.id.toUpperCase()}</div>
            </div>
          </div>

          {/* TITULO DEL PROYECTO */}
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Memoria Técnica Descriptiva & Estimación de Inversión
            </span>
            <h2 className="text-3xl font-light text-neutral-900 tracking-tight">
              {model.name} — <span className="font-semibold">{model.surfaceTotal} m² Totales</span>
            </h2>
            <p className="text-xs text-neutral-600 italic">
              {model.tagline}
            </p>
          </div>

          {/* RENDER Y PLANO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-neutral-300 overflow-hidden bg-neutral-100 aspect-[16/10]">
              <img
                src={model.mainImage}
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="border border-neutral-300 overflow-hidden bg-neutral-100 aspect-[16/10] flex items-center justify-center">
              <img
                src={model.floorPlanImage}
                alt="Planta técnica"
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>

          {/* TABLA DE METRAJES Y AMBIENTES */}
          <div className="grid grid-cols-4 gap-3 py-3 border-y border-neutral-300 text-xs font-mono">
            <div>
              <span className="text-neutral-500 text-[10px] block uppercase">Sup. Cubierta</span>
              <span className="font-bold text-neutral-900">{model.surfaceCovered} m²</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block uppercase">Semicubierta</span>
              <span className="font-bold text-neutral-900">{model.surfaceSemiCovered} m²</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block uppercase">Dormitorios / Baños</span>
              <span className="font-bold text-neutral-900">{model.bedrooms} Dorm. · {model.bathrooms} Baños</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block uppercase">Plazo Llave en Mano</span>
              <span className="font-bold text-neutral-900">~{model.deliveryTimeDays} días</span>
            </div>
          </div>

          {/* ESPECIFICACIONES CONSTRUCTIVAS */}
          <div className="space-y-3 text-xs">
            <h3 className="font-mono font-bold text-neutral-900 uppercase text-[11px] tracking-wider border-b border-neutral-200 pb-1">
              Especificación Constructiva Estándar MHC
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-neutral-700">
              {model.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-neutral-900 font-bold shrink-0">•</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PRESUPUESTO ESTIMATIVO DETALLADO */}
          <div className="p-5 bg-neutral-50 border border-neutral-300 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-baseline border-b border-neutral-200 pb-2">
              <span className="font-bold text-neutral-900 uppercase">
                Estimación de Inversión ({finishingTierName})
              </span>
              <span className="text-xl font-bold text-neutral-900">
                U$S {estimatedTotal.toLocaleString('es-AR')}
              </span>
            </div>

            {quotation && (
              <div className="space-y-1.5 text-[11px] text-neutral-600">
                <div className="flex justify-between">
                  <span>• Base Modelo {model.name}:</span>
                  <span>U$S {quotation.basePrice.toLocaleString('es-AR')}</span>
                </div>
                {quotation.tierDelta !== 0 && (
                  <div className="flex justify-between">
                    <span>• Ajuste Nivel {quotation.finishingTier.name}:</span>
                    <span>{quotation.tierDelta > 0 ? '+' : ''} U$S {quotation.tierDelta.toLocaleString('es-AR')}</span>
                  </div>
                )}
                {quotation.materialsTotal > 0 && (
                  <div className="flex justify-between">
                    <span>• Personalización de Materiales:</span>
                    <span>+ U$S {quotation.materialsTotal.toLocaleString('es-AR')}</span>
                  </div>
                )}
                {quotation.optionalsTotal > 0 && (
                  <div className="flex justify-between">
                    <span>• Opcionales Añadidos:</span>
                    <span>+ U$S {quotation.optionalsTotal.toLocaleString('es-AR')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-semibold text-neutral-900">
                  <span>Promedio por m² total:</span>
                  <span>U$S {quotation.pricePerM2USD} / m²</span>
                </div>
              </div>
            )}

            <div className="text-[10px] text-neutral-500 pt-2 border-t border-neutral-200">
              * Nota: Valores orientativos en dólares estadounidenses (USD) para construcción en Monte Hermoso y Sauce Grande. No incluye costo del terreno ni derechos municipales. Sujeto a estudio de suelo definitivo.
            </div>
          </div>

          {/* FIRMA Y CONTACTO */}
          <div className="pt-6 border-t border-neutral-300 flex justify-between items-end text-[11px] text-neutral-600 font-mono">
            <div>
              <div className="font-bold text-neutral-900">MHC STEEL FRAME MONTE HERMOSO</div>
              <div>Web: https://mhc.com.ar · Email: contacto@mhc.com.ar</div>
              <div>WhatsApp Comercial: +54 9 291 400-0000</div>
            </div>

            <div className="text-right">
              <div className="border-t border-neutral-400 pt-1 w-48 text-center text-[10px] text-neutral-500">
                Firma Autorizada MHC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
