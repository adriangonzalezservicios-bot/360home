import React from 'react';
import { HOUSE_MODELS } from '../../data/models';
import { MapPin, Building, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

export function LotCompatibilityMatrix() {
  return (
    <div className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-6">
      <div className="space-y-1 border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
          <Building className="w-4 h-4" />
          <span>Normativa Urbana & Factibilidad en Monte Hermoso</span>
        </div>
        <h3 className="text-xl md:text-2xl font-light text-white">
          Compatibilidad de Terrenos & Retiros Municipales
        </h3>
        <p className="text-xs text-neutral-400 font-light max-w-2xl leading-relaxed">
          Diseñamos cada modelo respetando estrictamente el Código de Ordenamiento Urbano de Monte Hermoso y Sauce Grande. Cotejá qué modelo se adapta a las dimensiones de tu lote.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-white/20 text-[#8A8D8F] uppercase text-[10px]">
              <th className="py-3 px-3">Modelo</th>
              <th className="py-3 px-3">Sup. Total</th>
              <th className="py-3 px-3">Frente Mínimo</th>
              <th className="py-3 px-3">Lote Sugerido</th>
              <th className="py-3 px-3">Retiro Frente</th>
              <th className="py-3 px-3">Retiros Laterales</th>
              <th className="py-3 px-3">Capacidad Plazas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {HOUSE_MODELS.map((model) => {
              const frenteMin = model.id === 'modelo-01' ? '12.00 m' : model.id === 'modelo-02' ? '15.00 m' : '16.00 m';
              const loteSugerido = model.id === 'modelo-01' ? '≥ 300 m²' : model.id === 'modelo-02' ? '≥ 400 m²' : '≥ 450 m² o esquina';
              const plazas = model.id === 'modelo-01' ? '4 a 6 personas' : model.id === 'modelo-02' ? '6 a 8 personas' : '8 a 10 personas';

              return (
                <tr key={model.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-3 font-semibold text-white">{model.name}</td>
                  <td className="py-4 px-3 text-[#E7E1D8]">{model.surfaceTotal} m²</td>
                  <td className="py-4 px-3 font-medium text-white">{frenteMin}</td>
                  <td className="py-4 px-3">{loteSugerido}</td>
                  <td className="py-4 px-3">3.00 m (Línea Mun.)</td>
                  <td className="py-4 px-3">1.50 m libre</td>
                  <td className="py-4 px-3 text-[#E7E1D8]">{plazas}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
        <div className="p-4 bg-neutral-950 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-2 text-white font-medium">
            <Compass className="w-4 h-4 text-[#E7E1D8]" />
            <span>Orientación Solar en Monte Hermoso</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            La orientación norte y noreste permite recibir radiación solar todo el año, reduciendo el consumo de calefacción en invierno y facilitando la ventilación cruzada en verano.
          </p>
        </div>

        <div className="p-4 bg-neutral-950 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-2 text-white font-medium">
            <ShieldCheck className="w-4 h-4 text-[#E7E1D8]" />
            <span>Estudio de Suelo & Platea</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            El suelo arenoso de Monte Hermoso requiere platea de hormigón armado con vigas perimetrales de encadenado. Todos nuestros presupuestos contemplan el cálculo estructural sobre arena.
          </p>
        </div>

        <div className="p-4 bg-neutral-950 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-2 text-white font-medium">
            <MapPin className="w-4 h-4 text-[#E7E1D8]" />
            <span>Sauce Grande & Zonas de Médano</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Para lotes con desniveles topográficos pronunciados, el sistema Steel Frame permite fundaciones escalonadas o pilotines sin requerir movimientos de suelo masivos.
          </p>
        </div>
      </div>
    </div>
  );
}
