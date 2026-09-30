import React from 'react';
import { NavigationTab } from '../../types';
import {
  ShieldCheck,
  Zap,
  Clock,
  Compass,
  CheckCircle2,
  Building,
  MapPin,
  Flame,
  Wind,
  Layers,
  Award
} from 'lucide-react';

interface AboutViewProps {
  onTabChange: (tab: NavigationTab) => void;
  onOpen360Tour: () => void;
}

export function AboutView({ onTabChange, onOpen360Tour }: AboutViewProps) {
  return (
    <div className="w-full bg-[#121415] text-neutral-100 min-h-screen">
      {/* 1. ENCABEZADO NOSOTROS */}
      <div className="border-b border-white/10 bg-[#0D0F10] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
            Identidad & Filosofía MHC
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight max-w-3xl">
            Arquitectura de precisión y construcción inteligente en Monte Hermoso
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-2xl leading-relaxed">
            No somos una constructora convencional. Integramos diseño arquitectónico contemporáneo, ingeniería Steel Frame y tecnología digital para hacer realidad tu casa de veraneo o inversión con certidumbre absoluta.
          </p>
        </div>
      </div>

      {/* 2. EL CONTEXTO MONTE HERMOSO: POR QUÉ STEEL FRAME EN LA COSTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              Desafío Costero & Solución Bioclimática
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Construir para el clima marítimo de Monte Hermoso
            </h2>
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              Monte Hermoso presenta particularidades climáticas únicas: vientos marinos de alta intensidad, brisa con salitre, veranos con alta radiación solar e inviernos fríos. La construcción tradicional húmeda suele sufrir fisuras por asentamiento en médanos, puentes térmicos y salinidad que degrada los revoques.
            </p>
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              El sistema <strong>Steel Frame galvanizado</strong> resuelve estos factores estructuralmente: estructura inerte a la humedad, aislación multicapa continua (lana de vidrio, barreras de vapor Tyvek y sistema EIFS exterior) y carpinterías herméticas que garantizan un confort térmico constante con un consumo energético hasta un 70% menor.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-neutral-900/60 border border-white/5 space-y-1">
                <div className="text-lg font-mono font-semibold text-[#E7E1D8]">120 Días</div>
                <div className="text-xs text-neutral-400">Plazo promedio llave en mano</div>
              </div>
              <div className="p-4 bg-neutral-900/60 border border-white/5 space-y-1">
                <div className="text-lg font-mono font-semibold text-[#E7E1D8]">Clase A++</div>
                <div className="text-xs text-neutral-400">Eficiencia térmica y acústica</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] bg-black border border-white/10 overflow-hidden">
              <img
                src="/foto-lateral-plana.jpg"
                alt="Detalle arquitectónico de galería y pérgola Steel Frame"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-mono text-[#E7E1D8] border border-white/10">
                Detalle constructivo de galería · Monte Hermoso
              </div>
            </div>
          </div>
        </div>

        {/* 3. LOS PILARES FUNDAMENTALES DE MHC */}
        <div className="space-y-8 border-t border-white/10 pt-16">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              Nuestra Propuesta
            </span>
            <h3 className="text-2xl font-light text-white">Pilares de Confianza y Calidad</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-neutral-900/60 border border-white/10 space-y-3">
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center font-mono text-[#E7E1D8] font-bold">
                01
              </div>
              <h4 className="text-base font-semibold text-white">Construcción Llave en Mano Real</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Nos ocupamos de todo: anteproyecto, cálculo estructural, platea de hormigón armado, montaje de perfilería, instalaciones completas, aberturas DVH y pintura final. Vos recibís la llave de una casa lista para disfrutar.
              </p>
            </div>

            <div className="p-6 bg-neutral-900/60 border border-white/10 space-y-3">
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center font-mono text-[#E7E1D8] font-bold">
                02
              </div>
              <h4 className="text-base font-semibold text-white">Convenios con Inmobiliarias Locales</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Si aún no tenés terreno en Monte Hermoso o Sauce Grande, tenemos acuerdos con las principales inmobiliarias de la ciudad para ayudarte a seleccionar el lote con mejor orientación solar, altimetría y rentabilidad.
              </p>
            </div>

            <div className="p-6 bg-neutral-900/60 border border-white/10 space-y-3">
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center font-mono text-[#E7E1D8] font-bold">
                03
              </div>
              <h4 className="text-base font-semibold text-white">Tecnología 360° & Transparencia</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Podés recorrer cada ambiente de tu futuro hogar en 360° antes de clavar el primer tornillo. Controlás costos en tiempo real con nuestro cotizador online, sin sorpresas presupuestarias en obra.
              </p>
            </div>
          </div>
        </div>

        {/* 4. SECCIÓN INVERSIÓN TURÍSTICA & SEGUNDA RESIDENCIA */}
        <div className="p-8 md:p-12 bg-neutral-900 border border-white/15 space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              Renta & Veraneo
            </span>
            <h3 className="text-2xl font-light text-white">
              Diseñadas para maximizar la renta temporal en temporada alta
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Monte Hermoso es uno de los destinos turísticos con mayor crecimiento y ocupación de la provincia de Buenos Aires. Construir una vivienda con diseño contemporáneo y bajo mantenimiento permite captar las tarifas de alquiler temporario más altas del mercado durante el verano y disfrutarla los fines de semana largos del año.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onTabChange('cotizador')}
              className="px-6 py-3 bg-[#E7E1D8] hover:bg-white text-black text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Simular Inversión en Cotizador
            </button>
            <button
              onClick={() => onTabChange('contacto')}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs font-medium uppercase tracking-wider transition-all"
            >
              Consultar Opciones con Lote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
