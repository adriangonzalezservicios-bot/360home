import React, { useState } from 'react';
import { HouseModel } from '../../types';
import { TrendingUp, DollarSign, Calendar, ShieldCheck, ArrowUpRight, HelpCircle } from 'lucide-react';

interface TourismRoiCalculatorProps {
  model: HouseModel;
  totalEstimatedInvestmentUSD: number;
}

export function TourismRoiCalculator({
  model,
  totalEstimatedInvestmentUSD
}: TourismRoiCalculatorProps) {
  // Tarifas estimadas por noche en Monte Hermoso según modelo
  const defaultDailyRates: Record<string, number> = {
    'modelo-01': 130, // 2 dormitorios (4-6 personas)
    'modelo-02': 180, // 3 dormitorios (6-8 personas)
    'modelo-03': 240  // Premium 2 niveles (8-10 personas)
  };

  const initialRate = defaultDailyRates[model.id] || 150;

  const [dailyRateUSD, setDailyRateUSD] = useState<number>(initialRate);
  const [highSeasonNights, setHighSeasonNights] = useState<number>(50); // Enero + Febrero
  const [midSeasonNights, setMidSeasonNights] = useState<number>(18); // Fines de semana largos
  const [managementCostPercent, setManagementCostPercent] = useState<number>(20); // Limpieza, comisiones, mantenimiento

  // Cálculos de rendimiento
  const totalNights = highSeasonNights + midSeasonNights;
  const grossAnnualIncomeUSD = Math.round(
    highSeasonNights * dailyRateUSD + midSeasonNights * (dailyRateUSD * 0.75)
  );
  const operatingCostsUSD = Math.round(grossAnnualIncomeUSD * (managementCostPercent / 100));
  const netAnnualIncomeUSD = grossAnnualIncomeUSD - operatingCostsUSD;

  const roiPercent =
    totalEstimatedInvestmentUSD > 0
      ? ((netAnnualIncomeUSD / totalEstimatedInvestmentUSD) * 100).toFixed(1)
      : '0.0';

  const paybackYears =
    netAnnualIncomeUSD > 0 ? (totalEstimatedInvestmentUSD / netAnnualIncomeUSD).toFixed(1) : '0';

  return (
    <div className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
            <TrendingUp className="w-4 h-4" />
            <span>Simulador de Inversión y Renta Temporaria</span>
          </div>
          <h3 className="text-xl md:text-2xl font-light text-white">
            Rendimiento Turístico en Monte Hermoso
          </h3>
          <p className="text-xs text-neutral-400 font-light max-w-xl">
            Calculá el retorno anual proyectado alquilando tu vivienda durante la temporada estival y fines de semana largos.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#8A8D8F] uppercase font-mono block">Inversión Considerada</span>
          <span className="text-lg font-mono font-semibold text-[#E7E1D8]">
            U$S {totalEstimatedInvestmentUSD.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* CONTROLES INTERACTIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* TARIFA DIARIA */}
        <div className="p-4 bg-neutral-950 border border-white/5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">Tarifa por Noche (Verano):</span>
            <span className="font-mono text-sm font-semibold text-[#E7E1D8]">U$S {dailyRateUSD}</span>
          </div>
          <input
            type="range"
            min={80}
            max={350}
            step={5}
            value={dailyRateUSD}
            onChange={(e) => setDailyRateUSD(Number(e.target.value))}
            className="w-full accent-[#E7E1D8] cursor-pointer"
          />
          <div className="text-[10px] text-[#8A8D8F] flex justify-between">
            <span>U$S 80</span>
            <span>Promedio: U$S {initialRate}</span>
            <span>U$S 350</span>
          </div>
        </div>

        {/* NOCHES ENERO + FEBRERO */}
        <div className="p-4 bg-neutral-950 border border-white/5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">Noches Enero & Febrero:</span>
            <span className="font-mono text-sm font-semibold text-white">{highSeasonNights} noches</span>
          </div>
          <input
            type="range"
            min={30}
            max={60}
            step={2}
            value={highSeasonNights}
            onChange={(e) => setHighSeasonNights(Number(e.target.value))}
            className="w-full accent-[#E7E1D8] cursor-pointer"
          />
          <div className="text-[10px] text-[#8A8D8F] flex justify-between">
            <span>30 (Ocup. 50%)</span>
            <span>50 (Ocup. 85%)</span>
            <span>60 (Plena)</span>
          </div>
        </div>

        {/* FINES DE SEMANA LARGOS */}
        <div className="p-4 bg-neutral-950 border border-white/5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">Noches Temporada Media:</span>
            <span className="font-mono text-sm font-semibold text-white">{midSeasonNights} noches</span>
          </div>
          <input
            type="range"
            min={0}
            max={35}
            step={2}
            value={midSeasonNights}
            onChange={(e) => setMidSeasonNights(Number(e.target.value))}
            className="w-full accent-[#E7E1D8] cursor-pointer"
          />
          <div className="text-[10px] text-[#8A8D8F] flex justify-between">
            <span>0</span>
            <span>18 noches (~6 findes)</span>
            <span>35 noches</span>
          </div>
        </div>
      </div>

      {/* RESULTADOS CLAVE DEL RETORNO */}
      <div className="p-6 bg-neutral-950 border border-[#2E3B33] grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
        <div>
          <span className="text-[10px] text-[#8A8D8F] uppercase font-mono block">Ocupación Anual</span>
          <span className="text-xl font-bold font-mono text-white">{totalNights}</span>
          <span className="text-[11px] text-neutral-400 block">noches / año</span>
        </div>

        <div>
          <span className="text-[10px] text-[#8A8D8F] uppercase font-mono block">Ingreso Bruto Anual</span>
          <span className="text-xl font-bold font-mono text-white">
            U$S {grossAnnualIncomeUSD.toLocaleString('es-AR')}
          </span>
          <span className="text-[11px] text-neutral-400 block">facturación estival</span>
        </div>

        <div>
          <span className="text-[10px] text-[#8A8D8F] uppercase font-mono block">Renta Neta Estimada</span>
          <span className="text-xl font-bold font-mono text-[#E7E1D8]">
            U$S {netAnnualIncomeUSD.toLocaleString('es-AR')}
          </span>
          <span className="text-[11px] text-neutral-400 block">después de gastos (-20%)</span>
        </div>

        <div className="bg-[#2E3B33]/40 border border-[#2E3B33] p-3 rounded-lg">
          <span className="text-[10px] text-[#E7E1D8] uppercase font-mono font-semibold block">
            Rendimiento Anual (ROI)
          </span>
          <span className="text-2xl font-bold font-mono text-white">{roiPercent}%</span>
          <span className="text-[11px] text-[#E7E1D8] block">recupero en ~{paybackYears} años</span>
        </div>
      </div>

      {/* COMPARATIVA CON RENTA TRADICIONAL */}
      <div className="p-4 bg-white/5 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-semibold text-white">¿Por qué invertir en Steel Frame en Monte Hermoso?</span>
          <p className="text-neutral-400">
            Frente al rendimiento de un departamento tradicional en Bahía Blanca o CABA (~3.0% a 4.0% anual en USD), una vivienda costera en Monte Hermoso ofrece tasas del <strong>{roiPercent}% anual</strong> más el uso personal para vacaciones de tu familia.
          </p>
        </div>

        <div className="text-[11px] text-[#8A8D8F] shrink-0 font-mono text-right">
          <div>Obra lista en 120 días</div>
          <div>Mantenimiento mínimo</div>
        </div>
      </div>
    </div>
  );
}
