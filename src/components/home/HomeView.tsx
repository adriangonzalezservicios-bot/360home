import React from 'react';
import { HouseModel, NavigationTab } from '../../types';
import { HOUSE_MODELS } from '../../data/models';
import { ArrowRight, Compass, ShieldCheck, Clock, Sun, Home, Layers, CheckCircle2 } from 'lucide-react';

interface HomeViewProps {
  onTabChange: (tab: NavigationTab) => void;
  onSelectModel: (modelId: string) => void;
  onOpen360Tour: () => void;
}

export function HomeView({ onTabChange, onSelectModel, onOpen360Tour }: HomeViewProps) {
  const modelo01 = HOUSE_MODELS[0];

  return (
    <div className="w-full bg-[#121415] text-neutral-100">
      {/* 1. HERO ARQUITECTÓNICO PRINCIPAL */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Imagen de fondo arquitectónica con gradiente sutil */}
        <div className="absolute inset-0 z-0">
          <img
            src="/foto-frente-plana.jpg"
            alt="Vivienda contemporánea Steel Frame en Monte Hermoso"
            className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121415] via-[#121415]/40 to-black/60" />
        </div>

        {/* Contenido Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              <span>Monte Hermoso, Buenos Aires</span>
              <span className="text-white/30">/</span>
              <span>Construcción Llave en Mano</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
              Viviendas contemporáneas en <span className="font-semibold text-[#E7E1D8]">Steel Frame</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl">
              Arquitectura sobria, precisión milimétrica y máxima aislación bioclimática para la costa. Modelos prediseñados, personalización de terminaciones y cotización online transparente.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onTabChange('modelos')}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-[#E7E1D8] hover:bg-white text-black text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>Conocer Modelos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpen360Tour}
                className="flex items-center gap-2 px-6 py-3.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-[#E7E1D8] border border-white/20 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <Compass className="w-4 h-4 text-[#E7E1D8]" />
                <span>Recorrido Virtual 360°</span>
              </button>

              <button
                onClick={() => onTabChange('cotizador')}
                className="flex items-center gap-2 px-5 py-3.5 text-xs text-neutral-300 hover:text-white transition-colors"
              >
                <span>Cotizar en tiempo real →</span>
              </button>
            </div>

            {/* Metadatos arquitectónicos discretos (sin pills) */}
            <div className="pt-8 flex flex-wrap items-center gap-6 text-xs text-[#8A8D8F] font-mono border-t border-white/10">
              <div>Entrega en 120 días</div>
              <span className="text-white/20">·</span>
              <div>Aislación Térmica A++</div>
              <span className="text-white/20">·</span>
              <div>Convenios con Inmobiliarias</div>
              <span className="text-white/20">·</span>
              <div>Monte Hermoso & Sauce Grande</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILOSOFÍA UX DE MHC: EL VIAJE DEL PROPIETARIO */}
      <section className="py-12 bg-[#0D0F10] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#8A8D8F] mb-4">
            Proceso de Experiencia MHC
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
            {[
              { step: '01', title: 'Descubrir', desc: 'Sistema constructivo' },
              { step: '02', title: 'Conocer', desc: 'Modelos 01, 02 y 03' },
              { step: '03', title: 'Recorrer 360°', desc: 'Inmersión espacial' },
              { step: '04', title: 'Ver el Plano', desc: 'Corte CAD e isometría' },
              { step: '05', title: 'Personalizar', desc: 'Materiales y acabados' },
              { step: '06', title: 'Cotizar', desc: 'Inversión en tiempo real' },
              { step: '07', title: 'Contactar', desc: 'Validación con MHC' }
            ].map((item, idx) => (
              <div key={item.step} className="p-3 bg-neutral-900/60 border border-white/5 space-y-1">
                <div className="font-mono text-[10px] text-[#8A8D8F]">{item.step}</div>
                <div className="font-medium text-white">{item.title}</div>
                <div className="text-[11px] text-neutral-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROPUESTA DE VALOR: MÁS QUE UNA CONSTRUCTORA */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              Arquitectura & Tecnología
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              Construir en la costa sin incertidumbre de plazos ni costos
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              MHC nace para responder a la necesidad de construir en Monte Hermoso con estándares arquitectónicos de vanguardia, presupuesto cerrado y tiempos récord que permiten aprovechar la próxima temporada estival.
            </p>

            <div className="pt-2 space-y-3 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E7E1D8] shrink-0 mt-0.5" />
                <span>Steel Frame galvanizado: Nula deformación por humedad o salinidad marina.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E7E1D8] shrink-0 mt-0.5" />
                <span>Excelente aislación térmica: Confort en verano abrasador y en invierno ventoso.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E7E1D8] shrink-0 mt-0.5" />
                <span>Llave en mano integral: Desde el estudio de suelo hasta la colocación del último artefacto.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E7E1D8] shrink-0 mt-0.5" />
                <span>Convenios inmobiliarios: Si aún no tenés lote, te asesoramos en la compra en Monte Hermoso o Sauce Grande.</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onTabChange('nosotros')}
                className="text-xs font-semibold uppercase tracking-wider text-[#E7E1D8] hover:underline flex items-center gap-1.5"
              >
                <span>Conocé más sobre nuestro método</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Destaque visual: El Modelo Insignia con acceso al Tour 360 */}
          <div className="lg:col-span-7 bg-neutral-900 border border-white/10 overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={modelo01.mainImage}
                alt={modelo01.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-[#E7E1D8] uppercase tracking-wider border border-white/15">
                Modelo Insignia 01 · 84 m²
              </div>
              <button
                onClick={onOpen360Tour}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2 px-5 py-3 bg-[#121415]/90 border border-white/20 text-[#E7E1D8] group-hover:scale-105 transition-transform shadow-2xl">
                  <Compass className="w-5 h-5 text-[#E7E1D8]" />
                  <span className="text-xs font-semibold tracking-wider uppercase">Ingresar al Tour 360°</span>
                </div>
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{modelo01.name}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{modelo01.tagline}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Inversión Base Desde</div>
                  <div className="text-base font-semibold text-[#E7E1D8]">
                    U$S {modelo01.basePriceUSD.toLocaleString('es-AR')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/10 text-xs">
                <div>
                  <span className="text-[#8A8D8F] block text-[10px] uppercase">Superficie Total</span>
                  <span className="font-semibold text-white">{modelo01.surfaceTotal} m²</span>
                </div>
                <div>
                  <span className="text-[#8A8D8F] block text-[10px] uppercase">Dormitorios</span>
                  <span className="font-semibold text-white">{modelo01.bedrooms} Dormitorios</span>
                </div>
                <div>
                  <span className="text-[#8A8D8F] block text-[10px] uppercase">Plazo Llave en Mano</span>
                  <span className="font-semibold text-white">~120 días</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectModel(modelo01.id);
                    onTabChange('modelos');
                  }}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                >
                  Ver Ficha Completa & Planos
                </button>
                <button
                  onClick={() => onTabChange('cotizador')}
                  className="px-4 py-2.5 bg-[#2E3B33] hover:bg-[#38483e] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Personalizar y Cotizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATÁLOGO DE MODELOS DESTACADOS */}
      <section className="py-20 bg-[#0D0F10] border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
                Línea de Viviendas
              </span>
              <h2 className="text-3xl font-light text-white tracking-tight">
                Tres modelos concebidos para Monte Hermoso
              </h2>
            </div>
            <button
              onClick={() => onTabChange('modelos')}
              className="text-xs font-semibold uppercase tracking-wider text-[#E7E1D8] hover:underline flex items-center gap-1 self-start md:self-auto"
            >
              <span>Ver comparativa completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOUSE_MODELS.map((model) => (
              <div
                key={model.id}
                className="bg-neutral-900 border border-white/10 flex flex-col justify-between group hover:border-white/25 transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={model.mainImage}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {model.badge && (
                      <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 text-[10px] font-mono uppercase text-[#E7E1D8] border border-white/10">
                        {model.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">{model.name}</h3>
                        <span className="text-xs font-mono text-[#E7E1D8]">{model.surfaceTotal} m² tot.</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{model.tagline}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-xs text-neutral-300">
                      <div>
                        <span className="text-[10px] text-[#8A8D8F] block">Cubiertos</span>
                        <span className="font-medium">{model.surfaceCovered} m²</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A8D8F] block">Dormitorios</span>
                        <span className="font-medium">{model.bedrooms}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A8D8F] block">Baños</span>
                        <span className="font-medium">{model.bathrooms}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-400 space-y-1">
                      <div>• {model.idealFor[0]}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs py-2">
                    <span className="text-[#8A8D8F]">Estimación Base:</span>
                    <span className="font-semibold text-white">U$S {model.basePriceUSD.toLocaleString('es-AR')}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onSelectModel(model.id);
                        onTabChange('modelos');
                      }}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium text-center border border-white/10 transition-colors"
                    >
                      Ver Ficha
                    </button>
                    <button
                      onClick={() => {
                        onSelectModel(model.id);
                        onTabChange('cotizador');
                      }}
                      className="w-full py-2 bg-[#2E3B33] hover:bg-[#38483e] text-white text-xs font-semibold text-center transition-colors"
                    >
                      Cotizar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LLAMADO A LA ACCIÓN FINAL: COTIZADOR & CONTACTO */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 border border-white/15 p-8 md:p-14 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              Cotización Transparente
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              ¿Tenés un lote en Monte Hermoso o estás planificando tu inversión?
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              Utilizá nuestro cotizador interactivo para simular la inversión según modelo, tipo de terminación y opcionales. Recibirás un desglose completo sin sorpresas.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onTabChange('cotizador')}
                className="px-6 py-3 bg-[#E7E1D8] hover:bg-white text-black text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Iniciar Cotizador Online
              </button>
              <button
                onClick={() => onTabChange('contacto')}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs font-medium uppercase tracking-wider transition-all"
              >
                Hablar con un Asesor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
