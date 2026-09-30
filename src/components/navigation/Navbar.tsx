import React, { useState } from 'react';
import { NavigationTab } from '../../types';
import { Menu, X, ArrowUpRight, Compass } from 'lucide-react';

interface NavbarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpen360Tour: () => void;
}

export function Navbar({ currentTab, onTabChange, onOpen360Tour }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { tab: NavigationTab; label: string }[] = [
    { tab: 'inicio', label: 'Inicio' },
    { tab: 'modelos', label: 'Modelos' },
    { tab: 'cotizador', label: 'Cotizador' },
    { tab: 'nosotros', label: 'Nosotros' },
    { tab: 'contacto', label: 'Contacto' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121415]/95 backdrop-blur-md border-b border-white/10 text-neutral-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO MHC ARQUITECTÓNICO */}
          <button
            onClick={() => onTabChange('inicio')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 border border-[#E7E1D8]/40 bg-neutral-900 flex items-center justify-center font-mono font-bold text-lg tracking-widest text-[#E7E1D8] group-hover:border-[#E7E1D8] transition-colors">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-semibold tracking-widest text-white">MHC</span>
                <span className="text-[10px] uppercase tracking-wider text-[#8A8D8F] border-l border-white/20 pl-2">
                  Steel Frame
                </span>
              </div>
              <div className="text-[10px] tracking-wider uppercase text-[#8A8D8F]">
                Monte Hermoso · Bs. As.
              </div>
            </div>
          </button>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentTab === link.tab;
              return (
                <button
                  key={link.tab}
                  onClick={() => onTabChange(link.tab)}
                  className={`relative py-1 text-xs tracking-wider uppercase transition-colors ${
                    isActive
                      ? 'text-[#E7E1D8] font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E7E1D8]" />
                  )}
                </button>
              );
            })}

            {/* SECCIONES PREPARADAS PARA EL FUTURO (Sutiles y sin romper) */}
            <div className="hidden lg:flex items-center gap-4 text-[11px] text-neutral-500 uppercase tracking-widest border-l border-white/10 pl-6">
              <span className="hover:text-neutral-400 cursor-not-allowed title-future" title="Próximamente">Inversión</span>
              <span className="text-white/20">·</span>
              <span className="hover:text-neutral-400 cursor-not-allowed title-future" title="Próximamente">Lotes</span>
              <span className="text-white/20">·</span>
              <span className="hover:text-neutral-400 cursor-not-allowed title-future" title="Próximamente">Obras</span>
            </div>
          </nav>

          {/* ACCIONES DIRECTAS */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpen360Tour}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#E7E1D8] bg-white/5 hover:bg-white/10 border border-white/15 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#E7E1D8]" />
              <span>Tour 360°</span>
            </button>

            <button
              onClick={() => onTabChange('cotizador')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#2E3B33] hover:bg-[#38483e] border border-[#3f5145] transition-all"
            >
              <span>Cotizar Online</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpen360Tour}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#E7E1D8] bg-white/5 border border-white/15 rounded"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>360°</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white"
              aria-label="Menú principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#121415] px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.tab}
                onClick={() => {
                  onTabChange(link.tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-sm uppercase tracking-wider transition-colors ${
                  currentTab === link.tab
                    ? 'text-[#E7E1D8] font-semibold bg-white/5'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                onOpen360Tour();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#E7E1D8] bg-white/5 border border-white/15"
            >
              <Compass className="w-4 h-4" />
              <span>Ver Experiencia 360°</span>
            </button>

            <button
              onClick={() => {
                onTabChange('cotizador');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#2E3B33] border border-[#3f5145]"
            >
              <span>Personalizar y Cotizar</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
