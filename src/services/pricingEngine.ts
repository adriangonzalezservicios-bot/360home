import { HOUSE_MODELS } from '../data/models';
import { FINISHING_TIERS, MATERIAL_OPTIONS, OPTIONAL_ITEMS } from '../data/pricingConfig';
import { QuotationResult, QuotationSelection } from '../types';

/**
 * MOTOR DE CÁLCULO DE COTIZACIÓN COMERCIAL DESACOPLADO
 *
 * Mantiene la pureza de reglas de cálculo sin ninguna dependencia de React.
 * Permite cambiar fórmulas o conectar con servicios externos fácilmente.
 */

export function calculateQuotation(selection: QuotationSelection): QuotationResult {
  // 1. Encontrar el modelo seleccionado
  const model =
    HOUSE_MODELS.find((m) => m.id === selection.modelId) || HOUSE_MODELS[0];

  // 2. Encontrar el nivel de terminación
  const finishingTier =
    FINISHING_TIERS.find((t) => t.id === selection.finishingTierId) || FINISHING_TIERS[1]; // default Estándar

  // 3. Precio base de la vivienda según modelo y m²
  const basePrice = model.basePriceUSD;

  // 4. Ajuste por nivel de terminación (con base en multiplicador respecto a Estándar)
  const tierAdjustedPrice = Math.round(basePrice * finishingTier.multiplier);
  const tierDelta = tierAdjustedPrice - basePrice;

  // 5. Adicionales por materiales seleccionados
  const materialsBreakdown: { category: string; name: string; price: number }[] = [];
  let materialsTotal = 0;

  const categories = ['aberturas', 'pisos', 'exterior', 'climatizacion'] as const;

  for (const cat of categories) {
    const selectedMatId = selection.materials[cat];
    const option = MATERIAL_OPTIONS.find((o) => o.id === selectedMatId && o.category === cat);
    if (option && option.priceDeltaUSD > 0) {
      // Ajustar proporcionalmente según la superficie del modelo (si el modelo es mayor a 84m², escalamos levemente)
      const scaleFactor = Math.max(1, model.surfaceCovered / 84);
      const scaledPrice = Math.round(option.priceDeltaUSD * Math.pow(scaleFactor, 0.7));

      materialsBreakdown.push({
        category: option.categoryLabel,
        name: option.name,
        price: scaledPrice
      });
      materialsTotal += scaledPrice;
    }
  }

  // 6. Opcionales seleccionados
  const optionalsBreakdown: { name: string; price: number }[] = [];
  let optionalsTotal = 0;

  for (const optId of selection.selectedOptionals) {
    const opt = OPTIONAL_ITEMS.find((o) => o.id === optId);
    if (opt) {
      optionalsBreakdown.push({
        name: opt.name,
        price: opt.priceUSD
      });
      optionalsTotal += opt.priceUSD;
    }
  }

  // 7. Total estimado
  const totalEstimatedUSD = tierAdjustedPrice + materialsTotal + optionalsTotal;
  const pricePerM2USD = Math.round(totalEstimatedUSD / model.surfaceTotal);

  // 8. Plazo de entrega estimado en meses
  const deliveryDays = model.deliveryTimeDays + (finishingTier.id === 'premium' ? 20 : 0);
  const estimatedDeliveryMonths = Math.ceil(deliveryDays / 30);

  return {
    model,
    finishingTier,
    basePrice,
    tierDelta,
    materialsTotal,
    materialsBreakdown,
    optionalsTotal,
    optionalsBreakdown,
    totalEstimatedUSD,
    pricePerM2USD,
    estimatedDeliveryMonths
  };
}

/**
 * Genera el texto estructurado del lead para WhatsApp o correo
 */
export function formatQuotationSummaryText(result: QuotationResult, userName?: string): string {
  const lines: string[] = [
    `*MHC STEEL FRAME — ESTIMACIÓN DE INVERSIÓN*`,
    `----------------------------------------`,
    `*Modelo:* ${result.model.name} (${result.model.surfaceTotal} m² totales)`,
    `*Superficie:* ${result.model.surfaceCovered} m² cubiertos + ${result.model.surfaceSemiCovered} m² semicubiertos`,
    `*Nivel de Terminación:* ${result.finishingTier.name}`,
    `*Presupuesto Estimado:* U$S ${result.totalEstimatedUSD.toLocaleString('es-AR')}`,
    `*Promedio por m²:* U$S ${result.pricePerM2USD.toLocaleString('es-AR')} / m²`,
    `*Plazo Estimado:* ~${result.estimatedDeliveryMonths} meses llave en mano`,
    ``
  ];

  if (result.materialsBreakdown.length > 0) {
    lines.push(`*Materiales y Acabados Seleccionados:*`);
    result.materialsBreakdown.forEach((m) => {
      lines.push(`• ${m.category}: ${m.name}`);
    });
    lines.push(``);
  }

  if (result.optionalsBreakdown.length > 0) {
    lines.push(`*Opcionales Añadidos:*`);
    result.optionalsBreakdown.forEach((o) => {
      lines.push(`• ${o.name}`);
    });
    lines.push(``);
  }

  lines.push(`_Cotización estimativa sujeta a validación técnica y de lote por MHC._`);

  if (userName) {
    lines.unshift(`*Cliente:* ${userName}`);
  }

  return lines.join('\n');
}

/**
 * Genera enlace directo a WhatsApp de MHC con el mensaje preformateado
 */
export function getWhatsAppQuotationLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
