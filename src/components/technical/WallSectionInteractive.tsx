import React, { useState } from 'react';
import { Layers, ShieldCheck, Thermometer, Wind, Volume2, CheckCircle2 } from 'lucide-react';

interface WallLayer {
  id: string;
  name: string;
  category: 'exterior' | 'aislacion' | 'estructura' | 'interior';
  thicknessMm: number;
  material: string;
  role: string;
  specs: string;
  color: string;
  accentColor: string;
}

export const WALL_LAYERS: WallLayer[] = [
  {
    id: 'layer-1',
    name: '1. Revoque Acrílico Elastomérico EIFS',
    category: 'exterior',
    thicknessMm: 3,
    material: 'Polímeros acrílicos con áridos de cuarzo seleccionados',
    role: 'Impermeabilización total exterior contra lluvia costera y salitre marino. Elasticidad permanente que absorbe dilataciones sin fisuras.',
    specs: 'Permeable al vapor de agua, 100% impermeable al agua de lluvia, resistente a radiación UV costera.',
    color: '#D8CEBE',
    accentColor: '#C4B5A5'
  },
  {
    id: 'layer-2',
    name: '2. Base Coat + Malla de Fibra de Vidrio',
    category: 'exterior',
    thicknessMm: 4,
    material: 'Mortero cementicio polimerizado con malla álcali-resistente 160 g/m²',
    role: 'Distribución uniforme de tensiones mecánicas y resistencia al impacto de granizo o viento fuerte.',
    specs: 'Resistencia a tracción > 2000 N/5cm, refuerzo continuo en esquinas y dinteles.',
    color: '#8A8D8F',
    accentColor: '#707477'
  },
  {
    id: 'layer-3',
    name: '3. Placa EPS Alta Densidad (Aislación Continua)',
    category: 'aislacion',
    thicknessMm: 30,
    material: 'Poliestireno expandido autoextinguible (20 kg/m³)',
    role: 'Aislación térmica exterior ininterrumpida. Elimina el 100% de los puentes térmicos en la perfilería.',
    specs: 'Conductividad térmica λ = 0.035 W/mK. Evita condensaciones intersticiales en invierno.',
    color: '#E2E3E5',
    accentColor: '#C5C7CA'
  },
  {
    id: 'layer-4',
    name: '4. Membrana Hidrófuga & Barrera de Viento (Tyvek)',
    category: 'aislacion',
    thicknessMm: 1,
    material: 'Polietileno de alta densidad no tejido spunbonded (Tyvek / Wichi)',
    role: 'Permite que el vapor interno respire hacia afuera pero impide el paso de viento y agua líquida.',
    specs: 'Barrera activa de estanqueidad al aire costero. Cumple norma IRAM 11.595.',
    color: '#F4F5F7',
    accentColor: '#D1D5DB'
  },
  {
    id: 'layer-5',
    name: '5. Placa Estructural OSB 11.1 mm (Diafragma)',
    category: 'estructura',
    thicknessMm: 11,
    material: 'Virutas de madera orientadas unidas con resinas fenólicas resistentes a humedad',
    role: 'Rigidización contra cargas horizontales de sismo y fuertes ráfagas de viento costero.',
    specs: 'Calidad APA / LP OSB Home Plus. Fijada con tornillos T2 autoperforantes cada 15 cm en bordes.',
    color: '#A98D68',
    accentColor: '#8C6F4B'
  },
  {
    id: 'layer-6',
    name: '6. Estructura Portante PGC 100 mm Acero Galvanizado',
    category: 'estructura',
    thicknessMm: 100,
    material: 'Chapa de acero galvanizado por inmersión en caliente Z275 (Espesor 0.94 - 1.25 mm)',
    role: 'Esqueleto portante estructural. Absorbe las cargas gravitatorias y climáticas de la vivienda.',
    specs: 'Normas IRAM-IAS U 500-205. Inalterable a la corrosión salina marina y ataque biológico.',
    color: '#4B5563',
    accentColor: '#374151'
  },
  {
    id: 'layer-7',
    name: '7. Aislación Termoacústica Lana de Vidrio 100 mm',
    category: 'aislacion',
    thicknessMm: 100,
    material: 'Lana de vidrio mineral con foil de aluminio como barrera de vapor',
    role: 'Máximo confort acústico y térmico dentro de la cavidad del panel. Atenúa ruidos de viento y lluvia.',
    specs: 'Densidad 14 kg/m³. Resistencia térmica R = 2.85 m²K/W. Aislación acústica Rw > 48 dB.',
    color: '#EAB308',
    accentColor: '#CA8A04'
  },
  {
    id: 'layer-8',
    name: '8. Placa de Yeso Knauf / Durlock 12.5 mm',
    category: 'interior',
    thicknessMm: 13,
    material: 'Núcleo de yeso bihidratado revestido en celulosa de alta resistencia',
    role: 'Superficie interior de terminación perfectamente plana y lisa. Placas verdes RH en baños y cocina.',
    specs: 'Ignífuga Clase RE2. Resistencia al fuego F-30 a F-60 según configuración.',
    color: '#E5E7EB',
    accentColor: '#9CA3AF'
  },
  {
    id: 'layer-9',
    name: '9. Enlucido y Pintura Interior al Látex',
    category: 'interior',
    thicknessMm: 1,
    material: 'Masilla para juntas con cinta microperforada + Látex profesional mate lavable',
    role: 'Acabado estético visual continuo de alta blancura y calidez táctil.',
    specs: 'Acabado Q3 / Q4 arquitectónico libre de sombras o irregularidades.',
    color: '#FAFAFA',
    accentColor: '#F3F4F6'
  }
];

export function WallSectionInteractive() {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-6');

  const selectedLayer =
    WALL_LAYERS.find((l) => l.id === selectedLayerId) || WALL_LAYERS[5];

  const totalThicknessMm = WALL_LAYERS.reduce((acc, l) => acc + l.thicknessMm, 0);

  return (
    <div className="bg-neutral-900 border border-white/10 p-6 md:p-8 space-y-8">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E7E1D8]">
            <Layers className="w-4 h-4" />
            <span>Detalle Constructivo 1:10 · Envolvente Bioclimática</span>
          </div>
          <h3 className="text-xl md:text-2xl font-light text-white">
            Corte del Muro Exterior Steel Frame MHC
          </h3>
          <p className="text-xs text-neutral-400 font-light max-w-xl">
            Inspeccioná capa por capa el paquete tecnológico que protege la vivienda del viento, el salitre y las temperaturas extremas de Monte Hermoso.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-neutral-300">
          <div className="p-2.5 bg-neutral-950 border border-white/10">
            <span className="text-[#8A8D8F] text-[10px] uppercase block">Espesor Total</span>
            <span className="font-semibold text-[#E7E1D8]">{totalThicknessMm} mm (~26 cm)</span>
          </div>
          <div className="p-2.5 bg-neutral-950 border border-white/10">
            <span className="text-[#8A8D8F] text-[10px] uppercase block">Aislación Acústica</span>
            <span className="font-semibold text-white">&gt; 48 dB (Rw)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* GRÁFICO VISUAL DEL CORTE DE CAPAS */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8D8F] px-1">
            <span>EXTERIOR (Mar / Viento)</span>
            <span>INTERIOR (Ambiente Climatizado)</span>
          </div>

          {/* DIAGRAMA EXPLOTADO DE CAPAS */}
          <div className="p-4 bg-neutral-950 border border-white/10 space-y-2">
            {WALL_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`group cursor-pointer p-2.5 border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#E7E1D8] bg-white/10 shadow-md ring-1 ring-[#E7E1D8]'
                      : 'border-white/5 bg-neutral-900/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-7 rounded-xs shrink-0 shadow-sm border border-black/30"
                      style={{ backgroundColor: layer.color }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-[#E7E1D8] transition-colors">
                        {layer.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {layer.material}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-[#E7E1D8]">
                      {layer.thicknessMm} mm
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETALLE TÉCNICO DE LA CAPA SELECCIONADA */}
        <div className="lg:col-span-6 bg-neutral-950 border border-white/10 p-6 md:p-7 space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#E7E1D8] uppercase tracking-wider">
                Especificación Técnica
              </span>
              <h4 className="text-lg font-medium text-white">{selectedLayer.name}</h4>
              <div className="text-xs text-[#8A8D8F] font-mono">
                Espesor: {selectedLayer.thicknessMm} mm · Material: {selectedLayer.material}
              </div>
            </div>

            <div
              className="w-10 h-10 border border-white/20 shrink-0 flex items-center justify-center font-mono font-bold text-xs"
              style={{ backgroundColor: selectedLayer.color, color: '#000000' }}
            >
              {selectedLayer.thicknessMm}mm
            </div>
          </div>

          <div className="space-y-4 text-xs text-neutral-300">
            <div>
              <span className="text-[#8A8D8F] uppercase text-[10px] font-mono block mb-1">
                Función en la Costa de Monte Hermoso:
              </span>
              <p className="leading-relaxed bg-white/5 p-3 border border-white/5 text-white">
                {selectedLayer.role}
              </p>
            </div>

            <div>
              <span className="text-[#8A8D8F] uppercase text-[10px] font-mono block mb-1">
                Normativa & Comportamiento:
              </span>
              <p className="leading-relaxed text-neutral-300">
                {selectedLayer.specs}
              </p>
            </div>
          </div>

          {/* MÉTRICAS BIOCLIMÁTICAS COMPARTIDAS */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-neutral-900 border border-white/5">
              <Thermometer className="w-4 h-4 text-[#E7E1D8] mx-auto mb-1" />
              <div className="text-[10px] text-[#8A8D8F]">Transmitancia K</div>
              <div className="font-mono font-semibold text-white">0.32 W/m²K</div>
            </div>

            <div className="p-2.5 bg-neutral-900 border border-white/5">
              <Wind className="w-4 h-4 text-[#E7E1D8] mx-auto mb-1" />
              <div className="text-[10px] text-[#8A8D8F]">Hermeticidad</div>
              <div className="font-mono font-semibold text-white">Clase 4 (Estanca)</div>
            </div>

            <div className="p-2.5 bg-neutral-900 border border-white/5">
              <ShieldCheck className="w-4 h-4 text-[#E7E1D8] mx-auto mb-1" />
              <div className="text-[10px] text-[#8A8D8F]">Salinidad</div>
              <div className="font-mono font-semibold text-white">Z275 Marino</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
