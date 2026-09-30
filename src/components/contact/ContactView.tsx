import React, { useState, useEffect } from 'react';
import { LeadFormData, QuotationResult } from '../../types';
import { HOUSE_MODELS } from '../../data/models';
import {
  Send,
  MessageSquare,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  FileCheck,
  Building
} from 'lucide-react';
import { getWhatsAppQuotationLink } from '../../services/pricingEngine';

interface ContactViewProps {
  prefilledQuotation?: QuotationResult | null;
  initialModelInterest?: string;
}

export function ContactView({ prefilledQuotation, initialModelInterest }: ContactViewProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    whatsapp: '',
    email: '',
    location: '',
    hasLot: 'si-monte-hermoso',
    modelInterest: initialModelInterest || prefilledQuotation?.model.id || 'modelo-01',
    constructionPurpose: 'segunda-residencia',
    message: '',
    quotationSummary: prefilledQuotation || undefined
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledQuotation) {
      setFormData((prev) => ({
        ...prev,
        modelInterest: prefilledQuotation.model.id,
        quotationSummary: prefilledQuotation
      }));
    }
  }, [prefilledQuotation]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // WhatsApp comercial oficial de MHC Monte Hermoso
  const MHC_PHONE = '5492914000000';

  // Generar texto estructurado para WhatsApp
  const generateWhatsAppMessage = () => {
    const selectedModel = HOUSE_MODELS.find((m) => m.id === formData.modelInterest);
    const lines = [
      `*NUEVA CONSULTA DESDE MHC.COM.AR*`,
      `----------------------------------------`,
      `*Nombre:* ${formData.fullName || 'No especificado'}`,
      `*WhatsApp:* ${formData.whatsapp || 'No especificado'}`,
      `*Email:* ${formData.email || 'No especificado'}`,
      `*Localidad de Residencia:* ${formData.location || 'No especificada'}`,
      `*Dispone de Terreno:* ${
        formData.hasLot === 'si-monte-hermoso'
          ? 'Sí, en Monte Hermoso'
          : formData.hasLot === 'busco-lote-monte-hermoso'
          ? 'Busco lote en Monte Hermoso con MHC'
          : formData.hasLot === 'otra-localidad'
          ? 'Tengo lote en otra localidad'
          : 'Aún no tengo terreno'
      }`,
      `*Modelo de Interés:* ${selectedModel?.name || formData.modelInterest}`,
      `*Finalidad del Proyecto:* ${
        formData.constructionPurpose === 'segunda-residencia'
          ? 'Segunda residencia de veraneo'
          : formData.constructionPurpose === 'inversion-turistica'
          ? 'Inversión de alquiler turístico'
          : 'Vivienda permanente'
      }`
    ];

    if (formData.quotationSummary) {
      lines.push(
        ``,
        `*PRESUPUESTO PREVIO EN COTIZADOR:*`,
        `• Total Estimado: U$S ${formData.quotationSummary.totalEstimatedUSD.toLocaleString('es-AR')}`,
        `• Nivel: ${formData.quotationSummary.finishingTier.name}`,
        `• Superficie: ${formData.quotationSummary.model.surfaceTotal} m²`
      );
    }

    if (formData.message) {
      lines.push(``, `*Mensaje:* ${formData.message}`);
    }

    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.whatsapp.trim()) {
      setSubmitError('Por favor completá tu nombre y número de WhatsApp para contactarte.');
      return;
    }
    setSubmitError(null);
    setIsSubmitted(true);
  };

  const handleOpenWhatsAppDirect = () => {
    const msg = generateWhatsAppMessage();
    const url = getWhatsAppQuotationLink(MHC_PHONE, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="w-full bg-[#121415] text-neutral-100 min-h-screen">
      {/* 1. ENCABEZADO */}
      <div className="border-b border-white/10 bg-[#0D0F10] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
            Equipo Comercial MHC · Monte Hermoso
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Iniciar Conversación
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-2xl leading-relaxed">
            Completá tus datos para recibir una cotización formal y asesoramiento personalizado sobre tu terreno o convenios de lotes en Monte Hermoso y Sauce Grande.
          </p>
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* FORMULARIO DE CONTACTO / LEAD QUALIFICATION */}
          <div className="lg:col-span-7 bg-neutral-900 border border-white/10 p-6 md:p-10 space-y-6">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-[#2E3B33] text-white mx-auto flex items-center justify-center rounded-full">
                  <CheckCircle2 className="w-7 h-7 text-[#E7E1D8]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-light text-white">¡Consulta recibida con éxito!</h3>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Gracias <strong className="text-white">{formData.fullName}</strong>. Un asesor de arquitectura e ingeniería de MHC se comunicará al <strong>{formData.whatsapp}</strong> para coordinar la evaluación técnica.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleOpenWhatsAppDirect}
                    className="px-6 py-3 bg-[#2E3B33] hover:bg-[#38483e] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-[#E7E1D8]" />
                    <span>Abrir Chat en WhatsApp Ahora</span>
                  </button>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-3 text-xs text-neutral-400 hover:text-white"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Datos de Contacto y Proyecto</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Información necesaria para elaborar una respuesta precisa y calificada.
                  </p>
                </div>

                {/* RESUMEN DE COTIZADOR PREVIO SI EXISTE */}
                {formData.quotationSummary && (
                  <div className="p-4 bg-neutral-950 border border-[#2E3B33] text-xs font-mono space-y-1">
                    <div className="flex items-center gap-2 text-[#E7E1D8] font-semibold">
                      <FileCheck className="w-4 h-4" />
                      <span>Configuración previa del Cotizador adjunta</span>
                    </div>
                    <div className="text-neutral-300">
                      {formData.quotationSummary.model.name} · {formData.quotationSummary.finishingTier.name}
                    </div>
                    <div className="text-[#E7E1D8] font-bold">
                      Presupuesto estimado: U$S {formData.quotationSummary.totalEstimatedUSD.toLocaleString('es-AR')}
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ej: Martín Rodríguez"
                      required
                      className="w-full bg-neutral-950 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#E7E1D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      WhatsApp con código de área *
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="Ej: +54 9 291 555-1234"
                      required
                      className="w-full bg-neutral-950 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#E7E1D8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@email.com"
                      className="w-full bg-neutral-950 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#E7E1D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Localidad de residencia actual
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ej: Bahía Blanca, CABA, La Plata..."
                      className="w-full bg-neutral-950 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#E7E1D8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      ¿Tenés terreno? *
                    </label>
                    <select
                      name="hasLot"
                      value={formData.hasLot}
                      onChange={handleChange}
                      className="w-full bg-neutral-950 border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E7E1D8]"
                    >
                      <option value="si-monte-hermoso">Sí, ya tengo terreno en Monte Hermoso</option>
                      <option value="busco-lote-monte-hermoso">Busco lote (interesado en convenios MHC)</option>
                      <option value="otra-localidad">Tengo lote en otra localidad de la zona</option>
                      <option value="no-tengo">Todavía no tengo lote definido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Modelo de Interés
                    </label>
                    <select
                      name="modelInterest"
                      value={formData.modelInterest}
                      onChange={handleChange}
                      className="w-full bg-neutral-950 border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E7E1D8]"
                    >
                      {HOUSE_MODELS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.surfaceTotal} m² totales)
                        </option>
                      ))}
                      <option value="a-medida">Proyecto personalizado a medida</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    ¿Querés construir para vivienda propia o inversión?
                  </label>
                  <select
                    name="constructionPurpose"
                    value={formData.constructionPurpose}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E7E1D8]"
                  >
                    <option value="segunda-residencia">Segunda residencia / Casa de veraneo</option>
                    <option value="inversion-turistica">Inversión para renta turística temporal</option>
                    <option value="vivienda-permanente">Vivienda familiar permanente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Mensaje o detalles adicionales
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Contanos sobre tu idea, orientación deseada, características del terreno o dudas constructivas..."
                    className="w-full bg-neutral-950 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#E7E1D8]"
                  />
                </div>

                {/* LOS DOS CTAs REQUERIDOS EN EL BRIEF: SOLICITAR COTIZACIÓN y HABLAR CON MHC */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#E7E1D8] hover:bg-white text-black text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>Solicitar Cotización</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenWhatsAppDirect}
                    className="w-full py-3.5 bg-[#2E3B33] hover:bg-[#38483e] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-[#3f5145]"
                  >
                    <MessageSquare className="w-4 h-4 text-[#E7E1D8]" />
                    <span>Hablar con MHC</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* INFORMACIÓN DE CONTACTO Y CONVENIOS CON INMOBILIARIAS */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-neutral-900/60 border border-white/10 p-6 md:p-8 space-y-5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
                Atención Directa
              </span>
              <h3 className="text-xl font-light text-white">MHC Monte Hermoso</h3>

              <div className="space-y-4 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#8A8D8F] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Zona de Cobertura Principal</div>
                    <div className="text-neutral-400">Monte Hermoso, Sauce Grande y corredor costero regional, Bs. As.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#8A8D8F] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">WhatsApp Comercial</div>
                    <div className="text-neutral-400">+54 9 291 400-0000</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#8A8D8F] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Correo Institucional</div>
                    <div className="text-neutral-400">contacto@mhc.com.ar</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#8A8D8F] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Horarios de Atención</div>
                    <div className="text-neutral-400">Lunes a Sábados de 09:00 a 19:00 hs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CONVENIOS DE LOTES */}
            <div className="p-6 bg-neutral-900 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E7E1D8] uppercase tracking-wider">
                <Building className="w-4 h-4" />
                <span>Convenios con Inmobiliarias</span>
              </div>
              <h4 className="text-sm font-semibold text-white">¿Todavía no tenés lote?</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                MHC posee alianzas estratégicas con inmobiliarias líderes en Monte Hermoso. Podemos gestionar la búsqueda de terrenos aptos para Steel Frame con excelente orientación solar y cotejar la factibilidad técnica y municipal antes de tu compra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
