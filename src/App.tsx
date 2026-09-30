import React, { useState } from 'react';
import { NavigationTab, QuotationResult } from './types';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HomeView } from './components/home/HomeView';
import { ModelsView } from './components/models/ModelsView';
import { CotizadorView } from './components/cotizador/CotizadorView';
import { AboutView } from './components/about/AboutView';
import { ContactView } from './components/contact/ContactView';
import { PanoramicViewer } from './components/viewer360/PanoramicViewer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('inicio');
  const [selectedModelId, setSelectedModelId] = useState<string>('modelo-01');
  const [is360ViewerActive, setIs360ViewerActive] = useState<boolean>(false);
  const [prefilledQuotation, setPrefilledQuotation] = useState<QuotationResult | null>(null);

  // Manejador de navegación de pestañas
  const handleTabChange = (tab: NavigationTab) => {
    setIs360ViewerActive(false);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Abrir la experiencia panorámica 360° existente
  const handleOpen360Tour = () => {
    setIs360ViewerActive(true);
  };

  const handleClose360Tour = () => {
    setIs360ViewerActive(false);
  };

  // Selección de modelo desde Home o Catálogo
  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  // Enviar cotización al formulario de contacto
  const handleSendQuotationToContact = (quote: QuotationResult) => {
    setPrefilledQuotation(quote);
    setSelectedModelId(quote.model.id);
  };

  return (
    <div className="min-h-screen bg-[#121415] text-neutral-100 flex flex-col font-sans selection:bg-[#E7E1D8] selection:text-black">
      {/* VISOR PANORÁMICO 360° INMERSIVO (PRESERVADO SIN PÉRDIDAS) */}
      {is360ViewerActive ? (
        <PanoramicViewer
          onBackToSite={handleClose360Tour}
          modelName="MODELO 01 · 84 m²"
          initialScene="fachada-frontal"
        />
      ) : (
        <>
          {/* BARRA DE NAVEGACIÓN PRINCIPAL */}
          <Navbar
            currentTab={currentTab}
            onTabChange={handleTabChange}
            onOpen360Tour={handleOpen360Tour}
          />

          {/* CUERPO SEGÚN SECCIÓN ACTIVA */}
          <main className="flex-1">
            {currentTab === 'inicio' && (
              <HomeView
                onTabChange={handleTabChange}
                onSelectModel={handleSelectModel}
                onOpen360Tour={handleOpen360Tour}
              />
            )}

            {currentTab === 'modelos' && (
              <ModelsView
                selectedModelId={selectedModelId}
                onSelectModel={handleSelectModel}
                onTabChange={handleTabChange}
                onOpen360Tour={handleOpen360Tour}
              />
            )}

            {currentTab === 'cotizador' && (
              <CotizadorView
                initialModelId={selectedModelId}
                onTabChange={handleTabChange}
                onSendQuotationToContact={handleSendQuotationToContact}
              />
            )}

            {currentTab === 'nosotros' && (
              <AboutView
                onTabChange={handleTabChange}
                onOpen360Tour={handleOpen360Tour}
              />
            )}

            {currentTab === 'contacto' && (
              <ContactView
                prefilledQuotation={prefilledQuotation}
                initialModelInterest={selectedModelId}
              />
            )}
          </main>

          {/* PIE DE PÁGINA ARQUITECTÓNICO */}
          <Footer
            onTabChange={handleTabChange}
            onOpen360Tour={handleOpen360Tour}
          />
        </>
      )}
    </div>
  );
}
