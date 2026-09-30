import React from 'react';
import { NavigationTab } from '../../types';
import { ArrowUpRight, MapPin, Mail, Phone, Clock } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: NavigationTab) => void;
  onOpen360Tour: () => void;
}

export function Footer({ onTabChange, onOpen360Tour }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0D0F10] border-t border-white/10 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* COLUMNA 1: IDENTIDAD MHC */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-[#E7E1D8]/40 bg-neutral-900 flex items-center justify-center font-mono font-bold text-base tracking-widest text-[#E7E1D8]">
                M
              </div>
              <div>
                <div className="font-mono text-base font-semibold tracking-widest text-white">MHC</div>
                <div className="text-[10px] uppercase tracking-wider text-[#8A8D8F]">Steel Frame Arquitectura</div>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Diseño contemporáneo y construcción en seco Steel Frame en Monte Hermoso, Buenos Aires. Especialistas en segundas residencias, casas de veraneo y proyectos de alta rentabilidad turística.
            </p>

            <div className="pt-2 text-[11px] text-[#8A8D8F] space-y-1">
              <div>Construcción llave en mano en 120 - 160 días.</div>
              <div>Convenios con inmobiliarias para adquisición de lotes.</div>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN Y MODELOS */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              Modelos & Arquitectura
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onTabChange('modelos')}
                  className="hover:text-white transition-colors text-left"
                >
                  Modelo 01 · 84 m² (Tour 360°)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('modelos')}
                  className="hover:text-white transition-colors text-left"
                >
                  Modelo 02 · 118 m² (Familiar)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('modelos')}
                  className="hover:text-white transition-colors text-left"
                >
                  Modelo 03 · 145 m² (Exclusivo)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpen360Tour}
                  className="text-[#E7E1D8] hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>Recorrer experiencia 360°</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: HERRAMIENTAS Y PROPUESTA */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              Herramientas
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onTabChange('cotizador')}
                  className="hover:text-white transition-colors text-left"
                >
                  Cotizador Online en Tiempo Real
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('nosotros')}
                  className="hover:text-white transition-colors text-left"
                >
                  Ventajas del Steel Frame Costero
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('contacto')}
                  className="hover:text-white transition-colors text-left"
                >
                  Convenios de Lotes en Monte Hermoso
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('contacto')}
                  className="hover:text-white transition-colors text-left"
                >
                  Solicitar Cotización Estimativa
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: CONTACTO & LOCALIDAD */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
              Contacto Monte Hermoso
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8A8D8F] shrink-0 mt-0.5" />
                <span>Monte Hermoso / Sauce Grande, Pcia. de Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8A8D8F] shrink-0" />
                <a
                  href="https://wa.me/5492914000000?text=Hola%20MHC,%20quiero%20información%20sobre%20construcción%20en%20Steel%20Frame%20en%20Monte%20Hermoso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +54 9 291 (Atención Comercial)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#8A8D8F] shrink-0" />
                <span>contacto@mhc.com.ar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#8A8D8F] shrink-0" />
                <span>Lunes a Sábados · 09:00 a 19:00 hs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* LÍNEA DE CRÉDITO Y LEGAL */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <div>
            © {currentYear} MHC Steel Frame. Todos los derechos reservados. Monte Hermoso, Buenos Aires.
          </div>
          <div className="text-neutral-500 flex items-center gap-4">
            <span>Arquitectura · Tecnología · Transparencia</span>
            <span>·</span>
            <span>mhc.com.ar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
