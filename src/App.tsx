import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Code2,
  BookOpen,
  MapPin,
  Upload,
  Layers,
  HelpCircle,
  Copy,
  Check,
  Download,
  X,
  Plus,
  Eye,
  Info,
  Sliders,
  ExternalLink,
  Sparkles,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Navigation,
  Smartphone,
  Image as ImageIcon,
  Globe,
  ShieldCheck,
  Menu,
  Grid
} from 'lucide-react';

// Declaraciones globales para los CDN inyectados
declare global {
  interface Window {
    Marzipano?: any;
    pannellum?: {
      viewer: (container: string | HTMLElement, options: any) => any;
    };
  }
}

interface HotspotItem {
  id: string;
  pitch: number;
  yaw: number;
  text: string;
  type: 'info' | 'scene';
}

// -------------------------------------------------------------
// CÓDIGO AUTÓNOMO UNIFICADO CON MARZIPANO (REQUERIDO)
// -------------------------------------------------------------
const MARZIPANO_HTML_CODE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visor Panorámico 360° - Marzipano WebGL</title>

  <!-- 1. CDN Oficial de Marzipano -->
  <script src="https://cdn.jsdelivr.net/npm/marzipano@0.10.2/dist/marzipano.js"></script>

  <!-- 2. Estilos para garantizar visor responsivo al 100% y controles flotantes -->
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-user-select: none;
      user-select: none;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #000000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* Contenedor del visor WebGL a pantalla completa */
    #pano {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      cursor: grab;
    }

    #pano:active {
      cursor: grabbing;
    }

    /* Barra de Controles Visibles en Pantalla (Zoom In, Zoom Out, Rotación, Pantalla Completa) */
    .controls-bar {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(18, 18, 18, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 8px 16px;
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      z-index: 100;
    }

    .ctrl-btn {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: #ffffff;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }

    .ctrl-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.08);
    }

    .ctrl-btn:active {
      transform: scale(0.95);
    }

    .ctrl-btn svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* Estilos para Hotspots (Puntos de Interés con Cuadro de Texto) */
    .hotspot {
      position: relative;
      cursor: pointer;
    }

    .hotspot-pin {
      width: 32px;
      height: 32px;
      background: #10b981;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      animation: pulse 2s infinite ease-in-out;
      transition: transform 0.25s ease;
    }

    .hotspot:hover .hotspot-pin {
      transform: scale(1.2);
      background: #059669;
    }

    .hotspot-tooltip {
      position: absolute;
      bottom: 42px;
      left: 50%;
      transform: translateX(-50%) translateY(5px);
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      white-space: nowrap;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: all 0.25s ease;
    }

    .hotspot-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 6px;
      border-style: solid;
      border-color: rgba(15, 23, 42, 0.95) transparent transparent transparent;
    }

    .hotspot:hover .hotspot-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 14px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
  </style>
</head>
<body>

  <!-- Contenedor 100% responsivo para WebGL -->
  <div id="pano"></div>

  <!-- Barra de Controles Visibles en Pantalla -->
  <div class="controls-bar">
    <!-- Botón Acercar Zoom -->
    <button id="zoomInBtn" class="ctrl-btn" title="Acercar (+)">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
    </button>

    <!-- Botón Alejar Zoom -->
    <button id="zoomOutBtn" class="ctrl-btn" title="Alejar (-)">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
    </button>

    <!-- Botón Rotación Automática Suave -->
    <button id="autorotateBtn" class="ctrl-btn" title="Alternar Rotación Automática">
      <svg id="rotateIcon" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
    </button>

    <!-- Botón Pantalla Completa -->
    <button id="fullscreenBtn" class="ctrl-btn" title="Pantalla Completa">
      <svg id="fsIcon" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
    </button>
  </div>

  <!-- 3. Inicialización del visor con Marzipano -->
  <script>
    // 1. Inicializar el visor de Marzipano en el elemento #pano
    var panoElement = document.getElementById('pano');
    var viewerOpts = {
      controls: {
        mouseViewMode: 'drag' // Interacción intuitiva por arrastre (ratón o táctil)
      }
    };
    var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    // 2. Fuente de la imagen panorámica con soporte CORS
    // { crossOrigin: 'anonymous' } evita bloqueos de seguridad WebGL si la imagen proviene de S3 o Cloud Storage
    var source = Marzipano.ImageUrlSource.fromString(
      'render-360.jpg',
      { crossOrigin: 'anonymous' }
    );

    // 3. Geometría equirrectangular (360° x 180° estándar)
    var geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

    // 4. Vista Rectilínea con limitadores de FOV (Campo de visión)
    var limiter = Marzipano.RectilinearView.limit.traditional(
      4000,
      100 * Math.PI / 180, // Límite máximo FOV
      120 * Math.PI / 180  // Límite Pitch
    );

    var view = new Marzipano.RectilinearView(
      { yaw: 0, pitch: 0, fov: 90 * Math.PI / 180 },
      limiter
    );

    // 5. Creación de la escena
    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // 6. Activar la escena inmediatamente
    scene.switchTo();

    // 7. Configuración de Rotación Automática Suave
    // yawSpeed: 0.03 radianes/segundo (~1.7°/s, giro cinematográfico continuo)
    var autorotate = Marzipano.autorotate({
      yawSpeed: 0.03,
      targetPitch: 0,
      targetFov: 90 * Math.PI / 180
    });

    var isAutorotating = true;
    viewer.startMovement(autorotate);
    // Reanudar automáticamente la rotación tras 3.5 segundos de inactividad
    viewer.setIdleMovement(3500, autorotate);

    // -------------------------------------------------------------
    // 8. EJEMPLO DE PUNTO DE INTERÉS (HOTSPOT) CON CUADRO DE TEXTO:
    // Puedes descomentar este bloque para colocar marcadores interactivos
    // -------------------------------------------------------------
    /*
    var hotspotElement = document.createElement('div');
    hotspotElement.className = 'hotspot';
    hotspotElement.innerHTML = 
      '<div class="hotspot-pin">' +
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4" fill="currentColor"></circle></svg>' +
      '</div>' +
      '<div class="hotspot-tooltip">' +
        '<strong>Estar - Comedor</strong><br>Ambiente principal de 3.80m x 6.60m' +
      '</div>';

    // Se posiciona en coordenadas esféricas (en radianes):
    // yaw: ángulo horizontal (grados * Math.PI / 180)
    // pitch: ángulo vertical (grados * Math.PI / 180)
    scene.hotspotContainer().createHotspot(hotspotElement, {
      yaw: 25 * Math.PI / 180,
      pitch: -3 * Math.PI / 180
    });
    */

    // -------------------------------------------------------------
    // 9. Lógica de los Controles de Zoom, Rotación y Pantalla Completa
    // -------------------------------------------------------------

    // Control de Zoom (+ y -)
    var zoomStep = 10 * Math.PI / 180; // 10 grados en radianes

    document.getElementById('zoomInBtn').addEventListener('click', function() {
      var currentFov = view.fov();
      view.setFov(Math.max(45 * Math.PI / 180, currentFov - zoomStep));
    });

    document.getElementById('zoomOutBtn').addEventListener('click', function() {
      var currentFov = view.fov();
      view.setFov(Math.min(115 * Math.PI / 180, currentFov + zoomStep));
    });

    // Control de Rotación Automática (Play / Pause)
    var autorotateBtn = document.getElementById('autorotateBtn');
    autorotateBtn.addEventListener('click', function() {
      if (isAutorotating) {
        viewer.stopMovement();
        viewer.setIdleMovement(Infinity, null);
        isAutorotating = false;
        autorotateBtn.style.opacity = '0.5';
      } else {
        viewer.startMovement(autorotate);
        viewer.setIdleMovement(3500, autorotate);
        isAutorotating = true;
        autorotateBtn.style.opacity = '1';
      }
    });

    // Control de Pantalla Completa
    var fullscreenBtn = document.getElementById('fullscreenBtn');
    fullscreenBtn.addEventListener('click', function() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function(err) {
          console.warn('Error al activar pantalla completa:', err);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  </script>
</body>
</html>`;

const PANNELLUM_HTML_CODE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visor Panorámico 360° - Pannellum WebGL</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background-color: #000; font-family: sans-serif; }
    #panorama { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; }
  </style>
</head>
<body>
  <div id="panorama"></div>
  <script>
    const viewer = pannellum.viewer('panorama', {
      type: 'equirectangular',
      panorama: 'render-360.jpg',
      autoLoad: true,
      autoRotate: -2,
      crossOrigin: 'anonymous',
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      compass: true,
      mouseZoom: true,
      hfov: 100
    });
  </script>
</body>
</html>`;

export default function App() {
  const [engine, setEngine] = useState<'marzipano' | 'pannellum'>('marzipano');
  const [currentScene, setCurrentScene] = useState<
    | 'vista-aerea'
    | 'fachada-frontal'
    | 'fachada-lateral'
    | 'fachada-trasera'
    | 'fachada-esquina'
    | 'exterior-dusk'
    | 'interior'
    | 'interior-dormitorio'
    | 'interior-bano'
    | 'custom'
  >('fachada-frontal');
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>('render-360.jpg');

  // Modo de visualización: '360' (Visor WebGL Esférico) o 'flat' (Fotografía Plana HD sin distorsión ovalada)
  const [displayMode, setDisplayMode] = useState<'360' | 'flat'>('360');

  // Calibración Antidistorsión en 360 (Fija el campo visual a 65° para paredes 100% rectas)
  const [isAntiDistortionActive, setIsAntiDistortionActive] = useState(false);

  // Menú móvil desplegable para herramientas secundarias en celulares
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Soporte de Giroscopio para celulares
  const [gyroActive, setGyroActive] = useState(false);
  const [hasGyro, setHasGyro] = useState(false);

  // Zoom interactivo para la vista plana
  const [flatZoom, setFlatZoom] = useState<number>(1);
  const touchStartXRef = useRef<number | null>(null);

  // Floating Minimap state
  const [showMinimap, setShowMinimap] = useState(true);
  const [isMinimapExpanded, setIsMinimapExpanded] = useState(false);

  // Scene navigation bar state and refs
  const sceneScrollRef = useRef<HTMLDivElement>(null);
  const [showSceneDropdown, setShowSceneDropdown] = useState(false);

  const scrollScenes = (direction: 'left' | 'right') => {
    if (sceneScrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      sceneScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Viewer state
  const [isRotating, setIsRotating] = useState(true);
  const [rotateSpeed, setRotateSpeed] = useState(0.03); // radians per sec for marzipano, or degrees for pannellum
  const [hfov, setHfov] = useState(90);
  const [currentPitch, setCurrentPitch] = useState(0);
  const [currentYaw, setCurrentYaw] = useState(0);
  const [hotspotsEnabled, setHotspotsEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals & UI
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeTab, setCodeTab] = useState<'marzipano' | 'pannellum'>('marzipano');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planViewMode, setPlanViewMode] = useState<'3d-cutaway' | '2d'>('3d-cutaway');
  const [isCutawayZoomed, setIsCutawayZoomed] = useState(false);
  const [showAddHotspotModal, setShowAddHotspotModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Hotspots list dependientes de la cara/escena seleccionada
  const getInitialHotspots = (scene: string): HotspotItem[] => {
    switch (scene) {
      case 'vista-aerea':
        return [
          {
            id: 'va-1',
            pitch: -28.0,
            yaw: 0.0,
            text: 'Cubierta y Techo Plano: Pendiente mínima de desagüe con pretiles y membrana (Estrictamente Planta Baja Única)',
            type: 'info'
          },
          {
            id: 'va-2',
            pitch: -25.0,
            yaw: 70.0,
            text: 'Pérgola de madera en patio y acceso vehicular sin pisos superiores',
            type: 'info'
          },
          {
            id: 'va-3',
            pitch: -20.0,
            yaw: -60.0,
            text: 'Volumetría en L de 60 m² de un solo nivel, sin escaleras interiores ni planta alta',
            type: 'info'
          }
        ];
      case 'fachada-frontal':
        return [
          {
            id: 'ff-1',
            pitch: -3.5,
            yaw: 15.0,
            text: 'Acceso principal: Puerta de seguridad pivotante con cerradura embutida',
            type: 'info'
          },
          {
            id: 'ff-2',
            pitch: 4.0,
            yaw: 35.0,
            text: 'Pérgola de cubierta metálica con vigas transversales de madera natural',
            type: 'info'
          },
          {
            id: 'ff-3',
            pitch: -5.0,
            yaw: -40.0,
            text: 'Revestimiento en piedra natural rústica y apliques bidireccionales LED cálidos',
            type: 'info'
          },
          {
            id: 'ff-4',
            pitch: -7.5,
            yaw: 125.0,
            text: 'Cochera vehicular y senda peatonal con canteros de lavandas',
            type: 'info'
          }
        ];
      case 'fachada-lateral':
        return [
          {
            id: 'fl-1',
            pitch: -2.0,
            yaw: -15.0,
            text: 'Puerta ventana corrediza DVH con acceso directo desde el living al patio',
            type: 'info'
          },
          {
            id: 'fl-2',
            pitch: 0.5,
            yaw: 45.0,
            text: 'Ventana de cocina y ventilación exterior con marco de aluminio negro',
            type: 'info'
          },
          {
            id: 'fl-3',
            pitch: -8.0,
            yaw: 85.0,
            text: 'Muro perimetral de ladrillo a la vista con acabado gris texturado',
            type: 'info'
          }
        ];
      case 'fachada-trasera':
        return [
          {
            id: 'ft-1',
            pitch: 0.0,
            yaw: -10.0,
            text: 'Ventana del Dormitorio Principal (3.70 x 3.50m) con cortinas black-out',
            type: 'info'
          },
          {
            id: 'ft-2',
            pitch: -1.0,
            yaw: 65.0,
            text: 'Ventana del Baño / Sector de ventilación higiénica',
            type: 'info'
          },
          {
            id: 'ft-3',
            pitch: -9.0,
            yaw: -80.0,
            text: 'Jardín posterior privado con césped natural y retiro reglamentario',
            type: 'info'
          }
        ];
      case 'fachada-esquina':
        return [
          {
            id: 'fe-1',
            pitch: -2.0,
            yaw: 20.0,
            text: 'Volumetría en "L" (Módulo 2 de 60 m²): unión patio lateral y jardín',
            type: 'info'
          },
          {
            id: 'fe-2',
            pitch: -4.0,
            yaw: -55.0,
            text: 'Puerta lateral de servicio y salida técnica al patio',
            type: 'info'
          },
          {
            id: 'fe-3',
            pitch: -8.0,
            yaw: 110.0,
            text: 'Sendero de hormigón peinado y vista al área de estacionamiento',
            type: 'info'
          }
        ];
      case 'exterior-dusk':
        return [
          {
            id: 'ed-1',
            pitch: -2.0,
            yaw: 12.0,
            text: 'Escena nocturna: Apliques de fachada LED iluminando texturas de mampostería',
            type: 'info'
          },
          {
            id: 'ed-2',
            pitch: 3.0,
            yaw: 40.0,
            text: 'Iluminación cálida indirecta bajo pérgola de madera',
            type: 'info'
          }
        ];
      case 'interior':
        return [
          {
            id: 'in-1',
            pitch: -3.0,
            yaw: 22.0,
            text: 'Sala de Estar y Comedor (3.80m x 6.60m) con vista al jardín exterior',
            type: 'info'
          },
          {
            id: 'in-2',
            pitch: 1.5,
            yaw: 105.0,
            text: 'Cocina lineal integrada con bacha, mesada de trabajo y extractor',
            type: 'info'
          },
          {
            id: 'in-3',
            pitch: -2.0,
            yaw: -70.0,
            text: 'Distribuidor hacia Dormitorio principal y Baño completo',
            type: 'info'
          }
        ];
      case 'interior-dormitorio':
        return [
          {
            id: 'id-1',
            pitch: -4.0,
            yaw: 0.0,
            text: 'Cama matrimonial de 2 plazas con respaldo tapizado neutro',
            type: 'info'
          },
          {
            id: 'id-2',
            pitch: 0.0,
            yaw: 90.0,
            text: 'Ventana al jardín con iluminación natural matutina (3.70m x 3.50m)',
            type: 'info'
          },
          {
            id: 'id-3',
            pitch: -2.0,
            yaw: -90.0,
            text: 'Placard empotrado con puertas corredizas y espacio organizador',
            type: 'info'
          }
        ];
      case 'interior-bano':
        return [
          {
            id: 'ib-1',
            pitch: -5.0,
            yaw: 30.0,
            text: 'Box de ducha con mampara de vidrio templado y grifería monocomando',
            type: 'info'
          },
          {
            id: 'ib-2',
            pitch: 1.0,
            yaw: -60.0,
            text: 'Vanitory flotante con espejo retroiluminado LED y revestimiento cerámico',
            type: 'info'
          },
          {
            id: 'ib-3',
            pitch: -6.0,
            yaw: 180.0,
            text: 'Inodoro y bidet en losa blanca de diseño compacto (2.30m x 1.60m)',
            type: 'info'
          }
        ];
      default:
        return [];
    }
  };

  const [hotspots, setHotspots] = useState<HotspotItem[]>(getInitialHotspots('fachada-frontal'));

  // Cambiar hotspots automáticamente al cambiar de escena
  const handleSceneChange = (scene: any) => {
    setCurrentScene(scene);
    setHotspots(getInitialHotspots(scene));
  };

  const [newHotspotText, setNewHotspotText] = useState('');

  const panoramaRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const sceneInstanceRef = useRef<any>(null);
  const autorotateMovementRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener ruta de la imagen activa para todas las caras, áreas interiores y vista aérea
  const getImageSource = () => {
    if (currentScene === 'custom' && customImageUrl) {
      return customImageUrl;
    }
    switch (currentScene) {
      case 'vista-aerea':
        return '/vista-aerea-360.jpg';
      case 'fachada-frontal':
        return '/fachada-frontal-360.jpg';
      case 'fachada-lateral':
        return '/fachada-lateral-360.jpg';
      case 'fachada-trasera':
        return '/fachada-trasera-360.jpg';
      case 'fachada-esquina':
        return '/fachada-esquina-360.jpg';
      case 'exterior-dusk':
        return '/exterior-dusk-360.jpg';
      case 'interior':
        return '/render-360.jpg';
      case 'interior-dormitorio':
        return '/interior-dormitorio-360.jpg';
      case 'interior-bano':
        return '/interior-bano-360.jpg';
      default:
        return '/fachada-frontal-360.jpg';
    }
  };

  const getSceneTitle = (scene: string) => {
    switch (scene) {
      case 'vista-aerea':
        return 'Vista Superior Aérea 360°';
      case 'fachada-frontal':
        return '1. Frente Principal';
      case 'fachada-lateral':
        return '2. Lateral Galería';
      case 'fachada-trasera':
        return '3. Contrafrente / Trasera';
      case 'fachada-esquina':
        return '4. Esquina en L';
      case 'exterior-dusk':
        return 'Exterior Atardecer / Noche';
      case 'interior':
        return 'Estar - Comedor';
      case 'interior-dormitorio':
        return 'Dormitorio Principal';
      case 'interior-bano':
        return 'Baño Completo';
      case 'custom':
        return 'Render Personalizado';
      default:
        return 'Visor Panorámico 360°';
    }
  };

  const getSceneDescription = (scene: string) => {
    switch (scene) {
      case 'vista-aerea':
        return 'Perspectiva Cenital 360° • Techo Plano, Pérgola y Cubierta (Planta Baja Única, sin pisos superiores)';
      case 'fachada-frontal':
        return 'Cara Frontal (Fachada Principal) • Pérgola, Entrada y Cochera (Planta Baja Única)';
      case 'fachada-lateral':
        return 'Cara Lateral (Galería/Patio) • Ventanal Corredizo DVH y Muros (Sin nivel superior)';
      case 'fachada-trasera':
        return 'Cara Trasera (Contrafrente) • Dormitorio y Baño hacia Jardín Privado';
      case 'fachada-esquina':
        return 'Cara Esquina (Patio en L) • Salida de Servicio y Cochera (Un solo nivel)';
      case 'exterior-dusk':
        return 'Vista Nocturna • Iluminación LED Cálida y Pérgola de Madera';
      case 'interior':
        return 'Interior Vivienda 60 m² • Estar - Comedor Integrado (3.80 × 6.60 m, sin escaleras)';
      case 'interior-dormitorio':
        return 'Dormitorio Principal (3.70 × 3.50 m) • Cama Matrimonial y Placard';
      case 'interior-bano':
        return 'Baño Completo (2.30 × 1.60 m) • Box de Ducha y Vanitory';
      case 'custom':
        return `Archivo Activo: ${customImageName}`;
      default:
        return 'Render Panorámico Equirrectangular 360°';
    }
  };

  // Obtener ruta de la imagen en perspectiva plana (sin curvatura esférica/ovalada)
  const getFlatImageSource = (scene: string) => {
    if (scene === 'custom' && customImageUrl) {
      return customImageUrl;
    }
    switch (scene) {
      case 'fachada-frontal':
        return '/foto-frente-plana.jpg';
      case 'interior':
        return '/foto-interior-plana.jpg';
      case 'fachada-lateral':
        return '/foto-lateral-plana.jpg';
      case 'exterior-dusk':
        return '/foto-dusk-plana.jpg';
      case 'vista-aerea':
        return '/corte-isometrico-3d.jpg';
      case 'fachada-trasera':
        return '/foto-lateral-plana.jpg';
      case 'fachada-esquina':
        return '/foto-lateral-plana.jpg';
      case 'interior-dormitorio':
        return '/foto-interior-plana.jpg';
      case 'interior-bano':
        return '/foto-interior-plana.jpg';
      default:
        return '/foto-frente-plana.jpg';
    }
  };

  const ALL_SCENES = [
    { id: 'fachada-frontal', name: '1. Frente Principal', category: 'Exterior', icon: '🏠' },
    { id: 'fachada-lateral', name: '2. Lateral Galería', category: 'Exterior', icon: '🌿' },
    { id: 'fachada-trasera', name: '3. Trasera Jardín', category: 'Exterior', icon: '🌳' },
    { id: 'fachada-esquina', name: '4. Esquina en L', category: 'Exterior', icon: '📐' },
    { id: 'exterior-dusk', name: 'Atardecer / Noche', category: 'Exterior', icon: '🌙' },
    { id: 'interior', name: 'Estar - Comedor', category: 'Interior', icon: '🛋️' },
    { id: 'interior-dormitorio', name: 'Dormitorio Principal', category: 'Interior', icon: '🛏️' },
    { id: 'interior-bano', name: 'Baño Completo', category: 'Interior', icon: '🚿' },
    { id: 'vista-aerea', name: 'Vista Superior (Corte 3D)', category: 'Cenital', icon: '🚁' }
  ];

  const goToNextScene = () => {
    const currentIndex = ALL_SCENES.findIndex((s) => s.id === currentScene);
    const nextIndex = (currentIndex + 1) % ALL_SCENES.length;
    handleSceneChange(ALL_SCENES[nextIndex].id);
  };

  const goToPrevScene = () => {
    const currentIndex = ALL_SCENES.findIndex((s) => s.id === currentScene);
    const prevIndex = (currentIndex - 1 + ALL_SCENES.length) % ALL_SCENES.length;
    handleSceneChange(ALL_SCENES[prevIndex].id);
  };

  // Detección de giroscopio en celular
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setHasGyro(true);
    }
  }, []);

  const toggleGyro = () => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permission: string) => {
          if (permission === 'granted') {
            setGyroActive((prev) => !prev);
          }
        })
        .catch(console.error);
    } else {
      setGyroActive((prev) => !prev);
    }
  };

  // Ajustar campo visual (FOV) en tiempo real
  const applyHfov = (newFov: number) => {
    setHfov(newFov);
    if (engine === 'marzipano' && sceneInstanceRef.current) {
      const view = sceneInstanceRef.current.view();
      if (view) {
        view.setFov((newFov * Math.PI) / 180);
      }
    } else if (engine === 'pannellum' && viewerInstanceRef.current && viewerInstanceRef.current.setHfov) {
      viewerInstanceRef.current.setHfov(newFov);
    }
  };

  // Alternar Corrección Antidistorsión (Vista Recta a 65° sin efecto ovalado)
  const toggleAntiDistortion = () => {
    if (!isAntiDistortionActive) {
      setIsAntiDistortionActive(true);
      applyHfov(65);
    } else {
      setIsAntiDistortionActive(false);
      applyHfov(90);
    }
  };

  // Inicializar visor WebGL según el motor seleccionado
  useEffect(() => {
    let checkInterval: any;
    let coordsInterval: any;

    const initViewer = () => {
      const container = panoramaRef.current;
      if (!container) return;

      // Destruir instancia anterior
      if (viewerInstanceRef.current) {
        try {
          if (viewerInstanceRef.current.destroy) {
            viewerInstanceRef.current.destroy();
          }
        } catch (e) {
          console.warn('Error al destruir instancia anterior:', e);
        }
        viewerInstanceRef.current = null;
        sceneInstanceRef.current = null;
      }

      container.innerHTML = '';
      setIsLoaded(false);

      const activeImage = getImageSource();

      if (engine === 'marzipano' && window.Marzipano) {
        // --- MOTOR MARZIPANO ---
        try {
          const viewerOpts = {
            controls: {
              mouseViewMode: 'drag'
            }
          };
          const viewer = new window.Marzipano.Viewer(container, viewerOpts);
          viewerInstanceRef.current = viewer;

          const source = window.Marzipano.ImageUrlSource.fromString(
            activeImage,
            { crossOrigin: 'anonymous' }
          );

          const geometry = new window.Marzipano.EquirectGeometry([{ width: 4000 }]);

          const limiter = window.Marzipano.RectilinearView.limit.traditional(
            4000,
            110 * Math.PI / 180,
            120 * Math.PI / 180
          );

          const startPitch = currentScene === 'vista-aerea' ? (-25 * Math.PI) / 180 : 0;

          const view = new window.Marzipano.RectilinearView(
            { yaw: 0, pitch: startPitch, fov: (hfov * Math.PI) / 180 },
            limiter
          );

          const scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
          });
          sceneInstanceRef.current = scene;

          scene.switchTo();

          const autorotate = window.Marzipano.autorotate({
            yawSpeed: 0.03,
            targetPitch: startPitch,
            targetFov: (hfov * Math.PI) / 180
          });
          autorotateMovementRef.current = autorotate;

          if (isRotating) {
            viewer.startMovement(autorotate);
            viewer.setIdleMovement(3500, autorotate);
          }

          // Hotspots en Marzipano
          if (hotspotsEnabled) {
            hotspots.forEach((hs) => {
              const hsEl = document.createElement('div');
              hsEl.className = 'hotspot-marker group relative cursor-pointer';
              hsEl.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg shadow-emerald-500/50 flex items-center justify-center text-white transition-transform duration-200 hover:scale-125">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
                </div>
                <div class="absolute bottom-10 left-1/2 -translate-x-1/2 bg-neutral-900/95 border border-white/20 text-neutral-100 text-xs px-3 py-1.5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
                  ${hs.text}
                </div>
              `;
              scene.hotspotContainer().createHotspot(hsEl, {
                yaw: (hs.yaw * Math.PI) / 180,
                pitch: (hs.pitch * Math.PI) / 180
              });
            });
          }

          // Listener de coordenadas en tiempo real
          coordsInterval = setInterval(() => {
            if (view) {
              const p = parseFloat(((view.pitch() * 180) / Math.PI).toFixed(1));
              const y = parseFloat(((view.yaw() * 180) / Math.PI).toFixed(1));
              const f = Math.round((view.fov() * 180) / Math.PI);
              setCurrentPitch(p);
              setCurrentYaw(y);
              setHfov(f);
            }
          }, 200);

          setIsLoaded(true);
        } catch (err) {
          console.error('Error al inicializar Marzipano:', err);
        }
      } else if (engine === 'pannellum' && window.pannellum) {
        // --- MOTOR PANNELLUM ---
        try {
          const config: any = {
            type: 'equirectangular',
            panorama: activeImage,
            autoLoad: true,
            autoRotate: isRotating ? -2 : 0,
            pitch: currentScene === 'vista-aerea' ? -25 : 0,
            yaw: 0,
            crossOrigin: 'anonymous',
            showZoomCtrl: false,
            showFullscreenCtrl: false,
            compass: true,
            mouseZoom: true,
            hfov: hfov,
            minHfov: 45,
            maxHfov: 120,
            hotSpots: hotspotsEnabled
              ? hotspots.map((hs) => ({
                  pitch: hs.pitch,
                  yaw: hs.yaw,
                  type: 'info',
                  text: hs.text
                }))
              : []
          };

          const pViewer = window.pannellum.viewer(container, config);
          viewerInstanceRef.current = pViewer;

          pViewer.on('load', () => setIsLoaded(true));

          coordsInterval = setInterval(() => {
            if (pViewer && pViewer.getPitch) {
              setCurrentPitch(parseFloat(pViewer.getPitch().toFixed(1)));
              setCurrentYaw(parseFloat(pViewer.getYaw().toFixed(1)));
              setHfov(Math.round(pViewer.getHfov()));
            }
          }, 200);
        } catch (err) {
          console.error('Error al inicializar Pannellum:', err);
        }
      }
    };

    // Esperar a que los scripts de los CDN estén cargados
    if (window.Marzipano || window.pannellum) {
      initViewer();
    } else {
      checkInterval = setInterval(() => {
        if (window.Marzipano || window.pannellum) {
          clearInterval(checkInterval);
          initViewer();
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (coordsInterval) clearInterval(coordsInterval);
      if (viewerInstanceRef.current && viewerInstanceRef.current.destroy) {
        try {
          viewerInstanceRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [engine, currentScene, customImageUrl, hotspotsEnabled]);

  // Manejo de Auto-rotación
  const toggleAutoRotate = () => {
    const nextState = !isRotating;
    setIsRotating(nextState);

    if (engine === 'marzipano' && viewerInstanceRef.current) {
      if (nextState) {
        if (autorotateMovementRef.current) {
          viewerInstanceRef.current.startMovement(autorotateMovementRef.current);
          viewerInstanceRef.current.setIdleMovement(3500, autorotateMovementRef.current);
        }
      } else {
        viewerInstanceRef.current.stopMovement();
        viewerInstanceRef.current.setIdleMovement(Infinity, null);
      }
    } else if (engine === 'pannellum' && viewerInstanceRef.current) {
      if (nextState) {
        viewerInstanceRef.current.startAutoRotate(-2);
      } else {
        viewerInstanceRef.current.stopAutoRotate();
      }
    }
  };

  // Manejo de Zoom
  const handleZoom = (direction: 'in' | 'out') => {
    if (engine === 'marzipano' && sceneInstanceRef.current) {
      const view = sceneInstanceRef.current.view();
      if (!view) return;
      const currentFov = view.fov();
      const step = 10 * Math.PI / 180;
      const targetFov = direction === 'in'
        ? Math.max(45 * Math.PI / 180, currentFov - step)
        : Math.min(115 * Math.PI / 180, currentFov + step);
      view.setFov(targetFov);
      setHfov(Math.round((targetFov * 180) / Math.PI));
    } else if (engine === 'pannellum' && viewerInstanceRef.current) {
      const current = viewerInstanceRef.current.getHfov();
      const next = direction === 'in' ? current - 10 : current + 10;
      const clamped = Math.max(45, Math.min(120, next));
      viewerInstanceRef.current.setHfov(clamped);
      setHfov(Math.round(clamped));
    }
  };

  // Reset de orientación
  const handleResetView = () => {
    if (engine === 'marzipano' && sceneInstanceRef.current) {
      const view = sceneInstanceRef.current.view();
      if (view) {
        view.setParameters({ yaw: 0, pitch: 0, fov: 90 * Math.PI / 180 });
      }
    } else if (engine === 'pannellum' && viewerInstanceRef.current) {
      viewerInstanceRef.current.setPitch(0);
      viewerInstanceRef.current.setYaw(0);
      viewerInstanceRef.current.setHfov(90);
    }
    setCurrentPitch(0);
    setCurrentYaw(0);
    setHfov(90);
  };

  // Pantalla completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Error al activar fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Carga de archivo personalizado por el usuario
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImageUrl(url);
      setCustomImageName(file.name);
      setCurrentScene('custom');
    }
  };

  // Copiar código al portapapeles
  const handleCopyCode = () => {
    const code = codeTab === 'marzipano' ? MARZIPANO_HTML_CODE : PANNELLUM_HTML_CODE;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Descargar archivo index.html
  const handleDownloadCode = () => {
    const code = codeTab === 'marzipano' ? MARZIPANO_HTML_CODE : PANNELLUM_HTML_CODE;
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copiar coordenadas actuales
  const handleCopyCoords = () => {
    const coordsStr = `yaw: ${(currentYaw * Math.PI / 180).toFixed(3)}, pitch: ${(currentPitch * Math.PI / 180).toFixed(3)}  /* ${currentYaw}°, ${currentPitch}° */`;
    navigator.clipboard.writeText(coordsStr);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 1800);
  };

  // Agregar nuevo Hotspot
  const handleAddHotspot = () => {
    if (!newHotspotText.trim()) return;

    const newHs: HotspotItem = {
      id: `hs-${Date.now()}`,
      pitch: currentPitch,
      yaw: currentYaw,
      text: newHotspotText.trim(),
      type: 'info'
    };

    setHotspots((prev) => [...prev, newHs]);

    if (engine === 'marzipano' && sceneInstanceRef.current && hotspotsEnabled) {
      const hsEl = document.createElement('div');
      hsEl.className = 'hotspot-marker group relative cursor-pointer';
      hsEl.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white transition-transform hover:scale-125">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
        </div>
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 bg-neutral-900/95 border border-white/20 text-neutral-100 text-xs px-3 py-1.5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
          ${newHs.text}
        </div>
      `;
      sceneInstanceRef.current.hotspotContainer().createHotspot(hsEl, {
        yaw: (newHs.yaw * Math.PI) / 180,
        pitch: (newHs.pitch * Math.PI) / 180
      });
    }

    setNewHotspotText('');
    setShowAddHotspotModal(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans select-none text-neutral-100">
      {/* Contenedor WebGL a pantalla completa */}
      <div
        id="pano-container"
        ref={panoramaRef}
        className={`w-full h-full absolute inset-0 z-0 cursor-grab active:cursor-grabbing ${
          displayMode === 'flat' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* VISTA PLANA HD (FOTOGRAFÍA ARQUITECTÓNICA RECTILÍNEA SIN DISTORSIÓN OVALADA) */}
      {displayMode === 'flat' && (
        <div
          className="absolute inset-0 z-10 bg-neutral-950 flex flex-col justify-between overflow-hidden"
          onTouchStart={(e) => {
            touchStartXRef.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartXRef.current !== null) {
              const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
              if (diffX > 50) {
                goToPrevScene();
              } else if (diffX < -50) {
                goToNextScene();
              }
              touchStartXRef.current = null;
            }
          }}
        >
          {/* Área de Visualización Central de la Fotografía */}
          <div className="relative flex-1 flex items-center justify-center pt-20 pb-20 sm:pb-24 px-3 sm:px-6 overflow-hidden">
            <div className="relative max-w-6xl max-h-full flex items-center justify-center">
              <img
                src={getFlatImageSource(currentScene)}
                alt={getSceneTitle(currentScene)}
                style={{ transform: `scale(${flatZoom})` }}
                className="w-auto h-auto max-h-[64vh] sm:max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/10 transition-transform duration-200 select-none pointer-events-auto"
              />

              {/* Badge superior sobre la imagen */}
              <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-1.5 pointer-events-none">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="hidden xs:inline">Perspectiva Rectilínea • Sin Distorsión Ovalada (0% Ojo de Pez)</span>
                <span className="xs:hidden">Perspectiva Recta Sin Óvalo</span>
              </div>

              {/* Botón flotante para cambiar a 360° */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => setDisplayMode('360')}
                  className="bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 backdrop-blur-md transition-all border border-emerald-400/40 active:scale-95"
                  title="Cambiar al visor inmersivo 360°"
                >
                  <Globe className="w-3.5 h-3.5 animate-pulse" />
                  <span>Ver en 360° 🌐</span>
                </button>
              </div>

              {/* Flechas de navegación previa y siguiente */}
              <button
                onClick={goToPrevScene}
                className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-900/85 hover:bg-neutral-800 border border-white/20 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95"
                title="Habitación o fachada anterior"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={goToNextScene}
                className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-900/85 hover:bg-neutral-800 border border-white/20 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95"
                title="Siguiente habitación o fachada"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Controles de Zoom para la fotografía */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-neutral-900/85 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-lg">
                <button
                  onClick={() => setFlatZoom((prev) => Math.max(1, prev - 0.25))}
                  className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800"
                  title="Reducir zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-neutral-300 px-1 font-semibold">
                  {Math.round(flatZoom * 100)}%
                </span>
                <button
                  onClick={() => setFlatZoom((prev) => Math.min(2.5, prev + 0.25))}
                  className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800"
                  title="Aumentar zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFlatZoom(1)}
                  className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800"
                  title="Reiniciar zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Barra inferior de la Vista Plana (Diseñada para celulares y desktop) */}
          <div className="p-2.5 sm:p-3 bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 pb-safe z-20">
            <div className="text-center sm:text-left flex items-center gap-2">
              <span className="text-xs font-bold text-white">{getSceneTitle(currentScene)}</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Planta Baja Única
              </span>
              <span className="text-[10px] text-neutral-400 hidden sm:inline">
                • Desliza o usa las flechas para explorar
              </span>
            </div>

            {/* Selector rápido de escenas tipo carrusel horizontal */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-0.5">
              {ALL_SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => handleSceneChange(scene.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                    currentScene === scene.id
                      ? 'bg-cyan-600 text-white font-bold shadow-md ring-1 ring-cyan-300'
                      : 'bg-neutral-800/90 text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <span>{scene.icon}</span>
                  <span>{scene.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga inicial en 360 */}
      {displayMode === '360' && !isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-md pointer-events-none transition-opacity">
          <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium tracking-wider text-neutral-300 uppercase">
            Iniciando Motor {engine === 'marzipano' ? 'Marzipano WebGL' : 'Pannellum WebGL'}...
          </p>
          <span className="text-xs text-neutral-500 mt-1">
            Proyección equirrectangular ({currentScene === 'custom' ? customImageName : getSceneTitle(currentScene)})
          </span>
        </div>
      )}

      {/* 1. BARRA SUPERIOR (HEADER PRINCIPAL RESPONSIVO CON SELECTOR DE MODO) */}
      <header className="absolute top-0 left-0 right-0 z-30 p-2 sm:p-3 pointer-events-none pt-safe">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Título & Identificador de Escena */}
          <div className="pointer-events-auto flex items-center gap-2 bg-neutral-900/90 backdrop-blur-xl border border-white/10 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-white truncate">
                  Visor 360° / Foto
                </h1>
                <span className="hidden lg:inline text-emerald-400 text-xs font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Planta Baja Única
                </span>
                {/* Badge de librería activa (en modo 360) */}
                {displayMode === '360' && (
                  <div className="hidden sm:flex items-center gap-1 bg-neutral-800/90 border border-emerald-500/30 rounded-full px-2 py-0.5 shrink-0">
                    <Cpu className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                      {engine === 'marzipano' ? 'Marzipano' : 'Pannellum'}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 hidden xl:block truncate max-w-md">
                {getSceneDescription(currentScene)}
              </p>
            </div>
          </div>

          {/* SELECTOR PRINCIPAL DE MODO: 🌐 360° VS 🖼️ VISTA PLANA (SIN ÓVALO) */}
          <div className="pointer-events-auto flex items-center bg-neutral-900/95 backdrop-blur-xl border border-white/20 p-1 rounded-2xl shadow-2xl">
            <button
              onClick={() => setDisplayMode('360')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                displayMode === '360'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Visor 360° Inmersivo con arrastre táctil y rotación WebGL"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span className="whitespace-nowrap">Visión 360°</span>
            </button>
            <button
              onClick={() => setDisplayMode('flat')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                displayMode === 'flat'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Vista Fotográfica HD: Renders y fotos rectilíneas sin distorsión esférica ni efecto ovalado"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
              <span className="whitespace-nowrap">Vista Plana <span className="hidden sm:inline font-normal text-cyan-100">(Sin Óvalo)</span></span>
            </button>
          </div>

          {/* Acciones principales de la cabecera */}
          <div className="pointer-events-auto flex items-center gap-1 sm:gap-2">
            {/* Botón Destacado: VISTA SUPERIOR 360° */}
            <button
              onClick={() => handleSceneChange('vista-aerea')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-md transition-all border ${
                currentScene === 'vista-aerea'
                  ? 'bg-amber-500 text-neutral-950 border-amber-300 ring-2 ring-amber-400/40 font-bold'
                  : 'bg-neutral-900/85 hover:bg-neutral-800 text-amber-300 hover:text-white border-amber-500/30 hover:border-amber-400'
              }`}
              title="Vista Superior 360°: Ver la casa desde el cielo con dron, observando el techo, jardín y entorno"
            >
              <Navigation className={`w-3.5 h-3.5 ${currentScene === 'vista-aerea' ? 'text-neutral-950 animate-bounce' : 'text-amber-400'}`} />
              <span className="whitespace-nowrap">Vista Superior 360°</span>
            </button>

            {/* Selector de Motor WebGL */}
            <div className="hidden md:flex items-center bg-neutral-900/85 backdrop-blur-md border border-white/10 p-0.5 rounded-xl shadow-xl">
              <button
                onClick={() => {
                  setEngine('marzipano');
                  setCodeTab('marzipano');
                }}
                className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition-all ${
                  engine === 'marzipano'
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Marzipano: Motor WebGL de alto rendimiento de Google"
              >
                Marzipano
              </button>
              <button
                onClick={() => {
                  setEngine('pannellum');
                  setCodeTab('pannellum');
                }}
                className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition-all ${
                  engine === 'pannellum'
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Pannellum: Motor WebGL ligero"
              >
                Pannellum
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {/* Botón Corte Isométrico 3D Arquitectónico */}
            <button
              onClick={() => {
                setPlanViewMode('3d-cutaway');
                setShowPlanModal(true);
              }}
              className="hidden sm:flex items-center gap-1.5 bg-neutral-900/85 hover:bg-neutral-800 text-amber-300 hover:text-white border border-amber-500/30 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-md transition-all"
              title="Ver Corte Isométrico 3D (Render Arquitectónico en L)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Corte 3D</span>
            </button>

            {/* Botón Plano Arquitectónico de referencia */}
            <button
              onClick={() => {
                setPlanViewMode('2d');
                setShowMinimap(true);
                setShowPlanModal(true);
              }}
              className="hidden sm:flex items-center gap-1.5 bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium shadow-xl backdrop-blur-md transition-all"
              title="Ver Plano Arquitectónico 2D (60 m²)"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Plano</span>
            </button>

            {/* Botón Código index.html Completo */}
            <button
              onClick={() => {
                setCodeTab(engine);
                setShowCodeModal(true);
              }}
              className="hidden md:flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/30 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-md transition-all"
              title="Ver y descargar código index.html autónomo"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Código</span>
            </button>

            {/* Botón Subir propio */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="hidden md:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 rounded-xl shadow-xl backdrop-blur-md transition-all"
              title="Subir render 360 propio"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {/* Botón Guía Live Server */}
            <button
              onClick={() => setShowGuideModal(true)}
              className="hidden md:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 rounded-xl shadow-xl backdrop-blur-md transition-all"
              title="Guía: Cómo correr con Live Server y evitar CORS"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {/* Botón Pantalla Completa */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 rounded-xl shadow-xl backdrop-blur-md transition-all"
              title="Alternar Pantalla Completa"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* BOTÓN MENÚ MÓVIL (Exclusivo celular) */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="flex sm:hidden items-center justify-center w-8 h-8 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-white/15 rounded-xl shadow-xl"
              title="Menú y herramientas secundarias"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. BARRA DE NAVEGACIÓN DE ESCENAS (CARRUSEL RESPONSIVO CON DESPLAZAMIENTO SUAVE) */}
      <div className="absolute top-14 sm:top-16 left-0 right-0 z-20 pointer-events-none px-2 sm:px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <div className="pointer-events-auto bg-neutral-900/90 backdrop-blur-xl border border-white/15 p-1 sm:p-1.5 rounded-2xl shadow-2xl flex items-center gap-1 max-w-full">
            {/* Botón flecha izquierda para desplazamiento suave si hay overflow */}
            <button
              onClick={() => scrollScenes('left')}
              className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
              title="Desplazar a la izquierda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Contenedor de todas las escenas con scroll horizontal suave */}
            <div
              ref={sceneScrollRef}
              className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-1 max-w-[85vw] sm:max-w-none"
            >
              {/* GRUPO 1: VISTA SUPERIOR */}
              <button
                onClick={() => handleSceneChange('vista-aerea')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all border shrink-0 ${
                  currentScene === 'vista-aerea'
                    ? 'bg-amber-500 text-neutral-950 border-amber-300 shadow-md font-bold'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                }`}
                title="Vista Superior Aérea 360°: Techo, pendientes y visuales cenitales"
              >
                <Navigation className="w-3 h-3" />
                <span>Vista Superior 360°</span>
              </button>

              <div className="h-5 w-px bg-white/10 mx-1 shrink-0" />

              {/* GRUPO 2: CARAS EXTERIORES */}
              <span className="hidden md:inline text-[9px] font-bold uppercase tracking-wider text-neutral-500 px-1 shrink-0">
                Exterior:
              </span>
              <button
                onClick={() => handleSceneChange('fachada-frontal')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  currentScene === 'fachada-frontal'
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                1. Frente
              </button>
              <button
                onClick={() => handleSceneChange('fachada-lateral')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  currentScene === 'fachada-lateral'
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                2. Lateral
              </button>
              <button
                onClick={() => handleSceneChange('fachada-trasera')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  currentScene === 'fachada-trasera'
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                3. Trasera
              </button>
              <button
                onClick={() => handleSceneChange('fachada-esquina')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  currentScene === 'fachada-esquina'
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                4. Esquina L
              </button>
              <button
                onClick={() => handleSceneChange('exterior-dusk')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  currentScene === 'exterior-dusk'
                    ? 'bg-amber-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                🌙 Noche
              </button>

              <div className="h-5 w-px bg-white/10 mx-1 shrink-0" />

              {/* GRUPO 3: INTERIORES */}
              <span className="hidden md:inline text-[9px] font-bold uppercase tracking-wider text-neutral-500 px-1 shrink-0">
                Interior:
              </span>
              <button
                onClick={() => handleSceneChange('interior')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  currentScene === 'interior'
                    ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                Estar-Comedor
              </button>
              <button
                onClick={() => handleSceneChange('interior-dormitorio')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  currentScene === 'interior-dormitorio'
                    ? 'bg-violet-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                Dormitorio
              </button>
              <button
                onClick={() => handleSceneChange('interior-bano')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  currentScene === 'interior-bano'
                    ? 'bg-teal-600 text-white font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                Baño
              </button>
            </div>

            {/* Botón flecha derecha para desplazamiento suave */}
            <button
              onClick={() => scrollScenes('right')}
              className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
              title="Desplazar a la derecha"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Menú desplegable rápido para móviles */}
            <div className="relative sm:hidden shrink-0">
              <button
                onClick={() => setShowSceneDropdown(!showSceneDropdown)}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs flex items-center gap-1"
                title="Ver lista de todas las escenas"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showSceneDropdown && (
                <div className="absolute right-0 top-9 w-56 bg-neutral-900 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 text-xs">
                  <div className="text-[10px] text-amber-400 font-bold px-2 py-0.5 uppercase tracking-wider">
                    Vista Cenital
                  </div>
                  <button
                    onClick={() => {
                      handleSceneChange('vista-aerea');
                      setShowSceneDropdown(false);
                    }}
                    className={`p-2 rounded-xl text-left font-semibold ${
                      currentScene === 'vista-aerea'
                        ? 'bg-amber-500 text-black'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    🚁 Vista Superior 360°
                  </button>

                  <div className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 uppercase tracking-wider mt-1 border-t border-white/5 pt-1">
                    Caras Exteriores
                  </div>
                  <button
                    onClick={() => {
                      handleSceneChange('fachada-frontal');
                      setShowSceneDropdown(false);
                    }}
                    className={`p-1.5 rounded-xl text-left ${
                      currentScene === 'fachada-frontal'
                        ? 'bg-emerald-600 text-white'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    1. Frente Principal
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('fachada-lateral');
                      setShowSceneDropdown(false);
                    }}
                    className={`p-1.5 rounded-xl text-left ${
                      currentScene === 'fachada-lateral'
                        ? 'bg-emerald-600 text-white'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    2. Fachada Lateral
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('fachada-trasera');
                      setShowSceneDropdown(false);
                    }}
                    className={`p-1.5 rounded-xl text-left ${
                      currentScene === 'fachada-trasera'
                        ? 'bg-emerald-600 text-white'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    3. Fachada Trasera
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('fachada-esquina');
                      setShowSceneDropdown(false);
                    }}
                    className={`p-1.5 rounded-xl text-left ${
                      currentScene === 'fachada-esquina'
                        ? 'bg-emerald-600 text-white'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    4. Esquina y Patio
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('exterior-dusk');
                      setShowSceneDropdown(false);
                    }}
                    className={`p-1.5 rounded-xl text-left ${
                      currentScene === 'exterior-dusk'
                        ? 'bg-amber-600 text-white'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    🌙 Exterior Noche
                  </button>

                  <div className="text-[10px] text-cyan-400 font-bold px-2 py-0.5 uppercase tracking-wider mt-1 border-t border-white/5 pt-1">
                    Interiores 60 m²
                  </div>
                  <button
                    onClick={() => {
                      handleSceneChange('interior');
                      setShowSceneDropdown(false);
                    }}
                    className={`p-1.5 rounded-xl text-left ${
                      currentScene === 'interior'
                        ? 'bg-cyan-600 text-white'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    🛋️ Estar - Comedor
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('interior-dormitorio');
                      setShowSceneDropdown(false);
                    }}
                    className={`p-1.5 rounded-xl text-left ${
                      currentScene === 'interior-dormitorio'
                        ? 'bg-violet-600 text-white'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    🛏️ Dormitorio
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('interior-bano');
                      setShowSceneDropdown(false);
                    }}
                    className={`p-1.5 rounded-xl text-left ${
                      currentScene === 'interior-bano'
                        ? 'bg-teal-600 text-white'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    🚿 Baño Completo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. INSPECTOR DE CÁMARA (Pitch & Yaw en tiempo real) */}
      <div className="absolute top-28 sm:top-32 right-4 z-10 pointer-events-none hidden sm:flex flex-col items-end gap-2">
        <div className="pointer-events-auto bg-neutral-900/85 backdrop-blur-md border border-white/10 px-3.5 py-2.5 rounded-2xl shadow-xl text-right">
          <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-end gap-1.5">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Inspector WebGL</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 font-mono text-xs">
            <span className="text-neutral-300">
              Pitch: <strong className="text-emerald-400">{currentPitch}°</strong>
            </span>
            <span className="text-neutral-300">
              Yaw: <strong className="text-cyan-400">{currentYaw}°</strong>
            </span>
            <span className="text-neutral-300">
              FOV: <strong className="text-amber-400">{hfov}°</strong>
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-white/5">
            <button
              onClick={handleCopyCoords}
              className="text-[10px] text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded-lg border border-white/5 transition-all flex items-center gap-1"
              title="Copiar coordenadas en grados y radianes para pegar en el código"
            >
              {copiedCoords ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCoords ? 'Copiado' : 'Copiar Coordenadas'}</span>
            </button>
            <button
              onClick={() => setShowAddHotspotModal(true)}
              className="text-[10px] text-emerald-300 hover:text-emerald-100 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Nuevo Hotspot</span>
            </button>
          </div>
        </div>
      </div>

      {/* PLANO INTERACTIVO FLOTANTE (MINIMAP) - Click para teletransportarse */}
      {showMinimap && (
        <div
          className={`absolute left-4 bottom-24 z-20 pointer-events-auto transition-all duration-300 bg-neutral-900/95 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col ${
            isMinimapExpanded ? 'w-80 sm:w-96' : 'w-56 sm:w-64'
          }`}
        >
          {/* Header del Minimap */}
          <div className="p-3 bg-neutral-950/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                Plano Interactivo 60m²
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimapExpanded(!isMinimapExpanded)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-[10px]"
                title={isMinimapExpanded ? 'Reducir' : 'Ampliar plano'}
              >
                {isMinimapExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setShowMinimap(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                title="Ocultar plano"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Acceso Rápido a Vista Superior 360° desde el Plano */}
          <div className="w-full px-2.5 pt-2 pb-1 bg-neutral-950/70 border-b border-white/5">
            <button
              onClick={() => handleSceneChange('vista-aerea')}
              className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                currentScene === 'vista-aerea'
                  ? 'bg-amber-500 text-neutral-950 border-amber-300 shadow-md font-bold'
                  : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border-amber-500/30'
              }`}
              title="Ver Vista Aérea 360° desde arriba de la casa"
            >
              <Navigation className={`w-3.5 h-3.5 ${currentScene === 'vista-aerea' ? 'text-neutral-950 animate-bounce' : 'text-amber-400'}`} />
              <span>🚁 Vista Superior 360° (Techo)</span>
            </button>
          </div>

          {/* SVG del plano arquitectónico interactivo */}
          <div className="p-2 sm:p-3 relative bg-neutral-950/90 flex flex-col items-center">
            <svg
              viewBox="0 0 420 540"
              className="w-full h-auto max-h-60 sm:max-h-72 select-none"
            >
              {/* Contorno perimetral */}
              <path
                d="M 60 160 L 60 490 L 190 490 L 190 380 L 340 380 L 340 50 L 210 50 L 210 160 Z"
                stroke="#64748b"
                strokeWidth="2.5"
                fill="#1e293b"
                fillOpacity="0.4"
              />

              {/* VISTA AÉREA EN EL PLANO (Ícono Dron / Techo) */}
              <g
                onClick={() => handleSceneChange('vista-aerea')}
                className="cursor-pointer group"
              >
                <circle
                  cx="200"
                  cy="270"
                  r="16"
                  className={`transition-all ${
                    currentScene === 'vista-aerea'
                      ? 'fill-amber-500 stroke-white stroke-2 shadow-lg'
                      : 'fill-neutral-900/90 stroke-amber-400 hover:fill-amber-600 stroke-1'
                  }`}
                />
                <text x="200" y="274" fill="#ffffff" fontSize="12" textAnchor="middle">🚁</text>
                <text x="200" y="297" fill="#fde68a" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Aérea
                </text>
              </g>

              {/* ÁREA INTERACTIVA 1: LIVING / COMEDOR */}
              <g
                onClick={() => handleSceneChange('interior')}
                className="cursor-pointer group"
              >
                <rect
                  x="65"
                  y="215"
                  width="120"
                  height="265"
                  rx="6"
                  className={`transition-all duration-200 ${
                    currentScene === 'interior'
                      ? 'fill-emerald-500/35 stroke-emerald-400 stroke-2'
                      : 'fill-emerald-950/30 stroke-emerald-600/40 hover:fill-emerald-500/25 stroke-1'
                  }`}
                />
                {/* Muebles esquemáticos del plano */}
                <rect x="85" y="270" width="75" height="50" rx="3" stroke="#6ee7b7" strokeWidth="1" fill="#065f46" fillOpacity="0.3" />
                <rect x="85" y="370" width="75" height="40" rx="3" stroke="#6ee7b7" strokeWidth="1" fill="#065f46" fillOpacity="0.3" />
                <text x="125" y="250" fill="#a7f3d0" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Estar - Comedor
                </text>
                <text x="125" y="350" fill="#6ee7b7" fontSize="10" textAnchor="middle">
                  3.80 × 6.60m
                </text>
                {/* Indicador de cámara si está activo */}
                {currentScene === 'interior' && (
                  <circle cx="125" cy="330" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                )}
              </g>

              {/* ÁREA INTERACTIVA 2: COCINA INTEGRADA */}
              <g
                onClick={() => handleSceneChange('interior')}
                className="cursor-pointer group"
              >
                <rect
                  x="70"
                  y="165"
                  width="115"
                  height="45"
                  rx="4"
                  className="fill-amber-500/20 stroke-amber-400/50 hover:fill-amber-500/35 stroke-1 transition-all"
                />
                <circle cx="150" cy="188" r="8" stroke="#fbbf24" strokeWidth="1" fill="none" />
                <circle cx="170" cy="188" r="8" stroke="#fbbf24" strokeWidth="1" fill="none" />
                <text x="110" y="192" fill="#fde68a" fontSize="10" textAnchor="middle">
                  Cocina
                </text>
              </g>

              {/* ÁREA INTERACTIVA 3: BAÑO */}
              <g
                onClick={() => handleSceneChange('interior-bano')}
                className="cursor-pointer group"
              >
                <rect
                  x="245"
                  y="195"
                  width="90"
                  height="80"
                  rx="5"
                  className={`transition-all duration-200 ${
                    currentScene === 'interior-bano'
                      ? 'fill-cyan-500/35 stroke-cyan-400 stroke-2'
                      : 'fill-cyan-950/30 stroke-cyan-600/40 hover:fill-cyan-500/25 stroke-1'
                  }`}
                />
                <circle cx="270" cy="225" r="9" stroke="#67e8f9" strokeWidth="1" fill="none" />
                <rect x="290" y="210" width="35" height="50" rx="3" stroke="#67e8f9" strokeWidth="1" fill="none" />
                <text x="290" y="250" fill="#a5f3fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Baño
                </text>
                <text x="290" y="265" fill="#67e8f9" fontSize="9" textAnchor="middle">
                  2.30 × 1.60m
                </text>
                {currentScene === 'interior-bano' && (
                  <circle cx="290" cy="235" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                )}
              </g>

              {/* ÁREA INTERACTIVA 4: DORMITORIO PRINCIPAL */}
              <g
                onClick={() => handleSceneChange('interior-dormitorio')}
                className="cursor-pointer group"
              >
                <rect
                  x="215"
                  y="55"
                  width="120"
                  height="135"
                  rx="6"
                  className={`transition-all duration-200 ${
                    currentScene === 'interior-dormitorio'
                      ? 'fill-violet-500/35 stroke-violet-400 stroke-2'
                      : 'fill-violet-950/30 stroke-violet-600/40 hover:fill-violet-500/25 stroke-1'
                  }`}
                />
                {/* Cama 2 plazas */}
                <rect x="235" y="70" width="80" height="95" rx="4" stroke="#c4b5fd" strokeWidth="1" fill="#4c1d95" fillOpacity="0.3" />
                <text x="275" y="115" fill="#ddd6fe" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Dormitorio
                </text>
                <text x="275" y="135" fill="#a78bfa" fontSize="10" textAnchor="middle">
                  3.70 × 3.50m
                </text>
                {currentScene === 'interior-dormitorio' && (
                  <circle cx="275" cy="115" r="7" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                )}
              </g>

              {/* PUNTOS EXTERIORES CLICKEABLES ALREDEDOR DEL PERÍMETRO */}
              {/* Fachada 1. Frente */}
              <g
                onClick={() => handleSceneChange('fachada-frontal')}
                className="cursor-pointer group"
              >
                <circle
                  cx="125"
                  cy="515"
                  r="12"
                  className={`transition-all ${
                    currentScene === 'fachada-frontal'
                      ? 'fill-emerald-500 stroke-white stroke-2'
                      : 'fill-neutral-900 stroke-emerald-400 hover:fill-emerald-600 stroke-1'
                  }`}
                />
                <text x="125" y="519" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">1</text>
                <text x="125" y="534" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">Frente</text>
              </g>

              {/* Fachada 2. Lateral Galería */}
              <g
                onClick={() => handleSceneChange('fachada-lateral')}
                className="cursor-pointer group"
              >
                <circle
                  cx="35"
                  cy="325"
                  r="12"
                  className={`transition-all ${
                    currentScene === 'fachada-lateral'
                      ? 'fill-emerald-500 stroke-white stroke-2'
                      : 'fill-neutral-900 stroke-emerald-400 hover:fill-emerald-600 stroke-1'
                  }`}
                />
                <text x="35" y="329" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">2</text>
                <text x="35" y="344" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">Lateral</text>
              </g>

              {/* Fachada 3. Trasera / Jardín */}
              <g
                onClick={() => handleSceneChange('fachada-trasera')}
                className="cursor-pointer group"
              >
                <circle
                  cx="275"
                  cy="25"
                  r="12"
                  className={`transition-all ${
                    currentScene === 'fachada-trasera'
                      ? 'fill-emerald-500 stroke-white stroke-2'
                      : 'fill-neutral-900 stroke-emerald-400 hover:fill-emerald-600 stroke-1'
                  }`}
                />
                <text x="275" y="29" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">3</text>
                <text x="275" y="44" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">Trasera</text>
              </g>

              {/* Fachada 4. Esquina L */}
              <g
                onClick={() => handleSceneChange('fachada-esquina')}
                className="cursor-pointer group"
              >
                <circle
                  cx="365"
                  cy="215"
                  r="12"
                  className={`transition-all ${
                    currentScene === 'fachada-esquina'
                      ? 'fill-emerald-500 stroke-white stroke-2'
                      : 'fill-neutral-900 stroke-emerald-400 hover:fill-emerald-600 stroke-1'
                  }`}
                />
                <text x="365" y="219" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">4</text>
                <text x="365" y="234" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">Esquina</text>
              </g>
            </svg>

            {/* Ayuda de navegación táctil / clic */}
            <div className="w-full text-center text-[10px] text-neutral-400 mt-1 border-t border-white/5 pt-1.5 flex items-center justify-between">
              <span>Haz clic en una habitación o cara para ver su 360°</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. BARRA DE CONTROLES INFERIOR FLOTANTE (HUD) - OPTIMIZADA PARA MÓVIL Y DESKTOP */}
      {displayMode === '360' && (
        <footer className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[96%] max-w-2xl pb-safe">
          <div className="pointer-events-auto bg-neutral-900/95 backdrop-blur-xl border border-white/15 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-1 sm:gap-2">
            {/* 1. Rotación automática */}
            <button
              onClick={toggleAutoRotate}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isRotating
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
              }`}
              title={isRotating ? 'Pausar rotación automática' : 'Iniciar rotación suave'}
            >
              {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isRotating ? 'Rotación ON' : 'Rotación OFF'}</span>
            </button>

            {/* 2. Botón ANTI-DISTORSIÓN (VISTA RECTA 65° / SIN ÓVALO) */}
            <button
              onClick={toggleAntiDistortion}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                isAntiDistortionActive
                  ? 'bg-amber-500 text-neutral-950 border-amber-300 font-bold shadow-lg ring-1 ring-amber-400'
                  : 'bg-neutral-800/90 text-amber-300 border-amber-500/30 hover:bg-neutral-700 hover:text-white'
              }`}
              title={
                isAntiDistortionActive
                  ? 'Desactivar corrección (Volver a Gran Angular 90°)'
                  : 'Activar Vista Recta Natural 65°: Elimina toda curvatura u óvalo, dejando paredes 100% verticales'
              }
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isAntiDistortionActive ? 'text-neutral-950' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">
                {isAntiDistortionActive ? 'Vista Recta (Sin Óvalo)' : 'Anti-Óvalo'}
              </span>
              <span className="sm:hidden text-[11px]">
                {isAntiDistortionActive ? 'Recta ✓' : 'Anti-Óvalo'}
              </span>
            </button>

            {/* 3. Controles de Zoom y Reset */}
            <div className="flex items-center gap-1 bg-neutral-950/50 p-0.5 rounded-xl border border-white/5">
              <button
                onClick={() => handleZoom('out')}
                className="p-1.5 sm:p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
                title="Alejar Zoom (-)"
              >
                <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <div className="text-[11px] sm:text-xs font-mono text-neutral-300 px-1 font-semibold">
                {hfov}°
              </div>
              <button
                onClick={() => handleZoom('in')}
                className="p-1.5 sm:p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
                title="Acercar Zoom (+)"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1.5 sm:p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
                title="Restablecer Vista"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* 4. Giroscopio (Movimiento en Celular) */}
            {hasGyro && (
              <button
                onClick={toggleGyro}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  gyroActive
                    ? 'bg-cyan-600 text-white shadow-md ring-1 ring-cyan-400'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title="Giroscopio: Controlar visor moviendo el celular físico"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{gyroActive ? 'Giroscopio ON' : 'Giro'}</span>
              </button>
            )}

            {/* 5. Toggle Plano Interactivo (Minimap) */}
            <button
              onClick={() => setShowMinimap(!showMinimap)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                showMinimap
                  ? 'bg-emerald-600/90 text-white shadow-md'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title="Mostrar u ocultar el plano interactivo en pantalla"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showMinimap ? 'Plano ON' : 'Plano'}</span>
            </button>

            {/* 6. Pantalla Completa Móvil */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center p-1.5 sm:p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl transition-all shrink-0"
              title="Alternar Pantalla Completa"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </footer>
      )}

      {/* MENÚ DESPLEGABLE MÓVIL (BOTTOM SHEET PARA CELULARES) */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-sm sm:hidden animate-in fade-in duration-200">
          <div className="bg-neutral-900 border-t border-white/20 rounded-t-3xl p-4 shadow-2xl flex flex-col gap-3.5 pb-safe animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Opciones y Herramientas
                </h3>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selector de Modo en Móvil */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Modo de Visualización:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setDisplayMode('360');
                    setShowMobileMenu(false);
                  }}
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    displayMode === '360'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg ring-1 ring-emerald-300'
                      : 'bg-neutral-800 text-neutral-300 border-white/5'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Visión 360°</span>
                </button>
                <button
                  onClick={() => {
                    setDisplayMode('flat');
                    setShowMobileMenu(false);
                  }}
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    displayMode === 'flat'
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg ring-1 ring-cyan-300'
                      : 'bg-neutral-800 text-neutral-300 border-white/5'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Vista Plana (Sin Óvalo)</span>
                </button>
              </div>
            </div>

            {/* Accesos a Plano y Corte 3D */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setPlanViewMode('3d-cutaway');
                  setShowPlanModal(true);
                  setShowMobileMenu(false);
                }}
                className="p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 bg-neutral-800/90 text-amber-300 border border-amber-500/30"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Corte 3D Isométrico</span>
              </button>

              <button
                onClick={() => {
                  setPlanViewMode('2d');
                  setShowPlanModal(true);
                  setShowMobileMenu(false);
                }}
                className="p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 bg-neutral-800/90 text-neutral-200 border border-white/10"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Plano CAD 2D (60 m²)</span>
              </button>
            </div>

            {/* Motor WebGL */}
            <div className="flex items-center justify-between bg-neutral-950 p-2.5 rounded-xl border border-white/10">
              <span className="text-xs text-neutral-300">Motor WebGL:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEngine('marzipano')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    engine === 'marzipano' ? 'bg-emerald-600 text-white' : 'text-neutral-400 bg-neutral-800'
                  }`}
                >
                  Marzipano
                </button>
                <button
                  onClick={() => setEngine('pannellum')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    engine === 'pannellum' ? 'bg-emerald-600 text-white' : 'text-neutral-400 bg-neutral-800'
                  }`}
                >
                  Pannellum
                </button>
              </div>
            </div>

            {/* Acciones de exportación y guía */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setShowCodeModal(true);
                  setShowMobileMenu(false);
                }}
                className="p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
              >
                <Code2 className="w-4 h-4" />
                <span>Código HTML</span>
              </button>

              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowMobileMenu(false);
                }}
                className="p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 bg-neutral-800 text-cyan-300 border border-white/10"
              >
                <Upload className="w-4 h-4" />
                <span>Subir Render</span>
              </button>

              <button
                onClick={() => {
                  setShowGuideModal(true);
                  setShowMobileMenu(false);
                }}
                className="p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 bg-neutral-800 text-neutral-300 border border-white/10"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Guía Server</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: CÓDIGO INDEX.HTML AUTÓNOMO */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-lg">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header del modal */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Código Fuente Unificado (index.html)
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Archivo autónomo con HTML, CSS, JavaScript y CDN oficial
                  </p>
                </div>
              </div>

              {/* Selector de pestaña de motor */}
              <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setCodeTab('marzipano')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    codeTab === 'marzipano'
                      ? 'bg-emerald-600 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Marzipano (Requerido)
                </button>
                <button
                  onClick={() => setCodeTab('pannellum')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    codeTab === 'pannellum'
                      ? 'bg-emerald-600 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Pannellum
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-all border border-white/5"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? '¡Copiado!' : 'Copiar'}
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar .html</span>
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Código fuente */}
            <div className="p-4 sm:p-5 overflow-auto flex-1 bg-neutral-950 font-mono text-xs text-neutral-300 leading-relaxed border-b border-white/5">
              <pre className="whitespace-pre">
                {codeTab === 'marzipano' ? MARZIPANO_HTML_CODE : PANNELLUM_HTML_CODE}
              </pre>
            </div>

            {/* Footer modal */}
            <div className="p-4 bg-neutral-900/90 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Solo guarda este archivo como <strong>index.html</strong> junto a tu imagen <strong>render-360.jpg</strong>.
                </span>
              </div>
              <button
                onClick={() => {
                  setShowCodeModal(false);
                  setShowGuideModal(true);
                }}
                className="text-emerald-400 hover:text-emerald-300 underline font-medium"
              >
                Ver instrucciones para correr en Live Server &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: GUÍA DE EJECUCIÓN LOCAL & CORS */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-lg">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Guía de Ejecución Local y Prevención de Errores WebGL
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Por qué se requiere un servidor HTTP local y cómo configurarlo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm text-neutral-300">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> ¿Por qué falla si haces doble clic directo en el archivo (.html)?
                </h3>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Por medidas de seguridad de los navegadores (Same-Origin Policy), las texturas WebGL de imágenes no pueden cargarse mediante el protocolo local <code>file:///</code>. Intentarlo produce el error:
                  <br />
                  <code className="text-rose-300 bg-black/40 px-1 py-0.5 rounded mt-1 inline-block">
                    SecurityError: The operation is insecure / Tainted Canvas
                  </code>.
                  <br />
                  Debe servirse siempre mediante un servidor local con protocolo <code>http://</code>.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-medium text-sm">Métodos recomendados de ejecución:</h4>

                {/* Live Server */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-400 text-xs font-semibold">
                      1. Opción más rápida: Visual Studio Code + Live Server
                    </strong>
                    <span className="text-[10px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                      Recomendado
                    </span>
                  </div>
                  <ol className="text-xs text-neutral-400 list-decimal list-inside space-y-1.5 pl-1">
                    <li>Coloca <code>index.html</code> y <code>render-360.jpg</code> en una misma carpeta.</li>
                    <li>Abre esa carpeta en <strong>Visual Studio Code</strong>.</li>
                    <li>En el panel de extensiones (Ctrl+Shift+X), instala <strong>Live Server</strong> (de <em>Ritwick Dey</em>).</li>
                    <li>Haz clic derecho sobre <code>index.html</code> y selecciona <strong>&quot;Open with Live Server&quot;</strong>.</li>
                    <li>Tu navegador se abrirá en <code>http://127.0.0.1:5500/</code> con aceleración WebGL fluida.</li>
                  </ol>
                </div>

                {/* Python */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
                  <strong className="text-cyan-400 text-xs font-semibold">
                    2. En cualquier terminal con Python
                  </strong>
                  <p className="text-xs text-neutral-400">
                    Abre la terminal en la carpeta de tus archivos y escribe:
                  </p>
                  <pre className="bg-neutral-900 p-2.5 rounded-xl font-mono text-xs text-emerald-400 border border-white/5">
                    python -m http.server 8000
                  </pre>
                  <p className="text-xs text-neutral-400">
                    Abre <code>http://localhost:8000</code> en tu navegador.
                  </p>
                </div>

                {/* S3 y Cloud Storage CORS */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
                  <strong className="text-white text-xs font-semibold">
                    ☁️ Si sirves la imagen desde Amazon S3 o Google Cloud Storage:
                  </strong>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    El código incluye <code>crossOrigin: &apos;anonymous&apos;</code>. Configura los encabezados CORS en tu bucket para permitir solicitudes:
                  </p>
                  <pre className="bg-neutral-900 p-2.5 rounded-xl font-mono text-[11px] text-amber-300 border border-white/5 overflow-x-auto">
{`[
  {
    "origin": ["*"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-900/90 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: PLANO ARQUITECTÓNICO & CORTE ISOMÉTRICO 3D */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-lg">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header del modal con selector de vista */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-white">
                    Planimetría y Render Arquitectónico 3D
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Vivienda Modular en L • Una Sola Planta (Single-Story • 60 m²)
                  </p>
                </div>
              </div>

              {/* Selector de Pestañas: Corte 3D vs Planta 2D CAD */}
              <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setPlanViewMode('3d-cutaway')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                    planViewMode === '3d-cutaway'
                      ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Corte Isométrico 3D</span>
                </button>
                <button
                  onClick={() => setPlanViewMode('2d')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                    planViewMode === '2d'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Planta 2D CAD</span>
                </button>
              </div>

              <button
                onClick={() => setShowPlanModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-neutral-300">
              {/* VISTA 1: CORTE ISOMÉTRICO 3D ARQUITECTÓNICO (PLANTA BAJA ÚNICA) */}
              {planViewMode === '3d-cutaway' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div
                    onClick={() => setIsCutawayZoomed(true)}
                    className="relative rounded-2xl overflow-hidden border border-white/15 bg-neutral-950 shadow-2xl group cursor-zoom-in"
                    title="Haz clic para ver el render en pantalla completa a alta resolución"
                  >
                    <img
                      src="/corte-isometrico-3d.jpg"
                      alt="Corte Isométrico 3D de Casa en L - Estrictamente Planta Baja Única"
                      className="w-full h-auto max-h-[52vh] object-contain mx-auto rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-amber-300 font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Corte 3D • Solo Planta Baja</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-[10px] font-bold shadow-lg flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>100% Planta Baja (Sin Piso Alto)</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-neutral-300 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3 h-3" />
                      <span>Ampliar Render</span>
                    </div>
                  </div>

                  {/* Modal de Imagen Ampliada (Lightbox) */}
                  {isCutawayZoomed && (
                    <div
                      onClick={() => setIsCutawayZoomed(false)}
                      className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-6 cursor-zoom-out animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="relative max-w-6xl max-h-[92vh] flex flex-col items-center">
                        <img
                          src="/corte-isometrico-3d.jpg"
                          alt="Corte Isométrico 3D - Vista Ampliada Planta Baja"
                          className="w-full h-auto max-h-[84vh] object-contain rounded-2xl shadow-2xl border border-white/20"
                        />
                        <div className="mt-3 flex items-center justify-between w-full text-xs text-neutral-300 px-2">
                          <span className="font-semibold text-amber-400">
                            Render Isométrico 3D Arquitectónico • Planta Baja Única (Sin primer piso / Sin niveles superiores)
                          </span>
                          <span className="text-neutral-400 bg-neutral-800/80 px-3 py-1 rounded-full text-[11px]">
                            Toca en cualquier parte para cerrar ✕
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ficha técnica y distribución del corte 3D */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-neutral-950 p-3.5 rounded-2xl border border-white/10 space-y-2">
                      <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        Sector Izquierdo (Concepto Abierto):
                      </div>
                      <p className="text-[11px] text-neutral-300 leading-relaxed">
                        • <strong>Estar - Comedor (3.80m × 6.60m):</strong> Conectado a la entrada principal con gran ventanal DVH hacia el exterior.
                        <br />
                        • <strong>Cocina lineal al fondo:</strong> Mesada corrida con bacha, anafe y espacio de guardado.
                        <br />
                        • <strong>Comedor central:</strong> Mesa para 6 personas con iluminación cenital y acceso lateral.
                      </p>
                    </div>

                    <div className="bg-neutral-950 p-3.5 rounded-2xl border border-white/10 space-y-2">
                      <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        Sector Derecho (Área Privada):
                      </div>
                      <p className="text-[11px] text-neutral-300 leading-relaxed">
                        • <strong>Pasillo distribuidor central (0.90m):</strong> Acceso independiente a baño y dormitorios.
                        <br />
                        • <strong>Baño completo central (2.30m × 1.60m):</strong> Vanitory flotante, box de ducha y sanitarios.
                        <br />
                        • <strong>Dormitorios simétricos (3.30m × 3.35m c/u):</strong> Flanqueando el baño con camas de 2 plazas, placares y ventanas.
                      </p>
                    </div>
                  </div>

                  {/* Especificaciones de Materialidad y Regla Estricta */}
                  <div className="bg-neutral-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1.5">
                    <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Especificaciones Arquitectónicas & Reglas de Diseño:</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      • <strong>Volumetría y Fachadas:</strong> Arquitectura moderna minimalista en "L" con cubierta plana y pretiles limpios, revestimiento en piedra natural rústica y listones de madera, grandes ventanales con carpintería de aluminio negro.
                      <br />
                      • <strong>Interiores Seccionados:</strong> Pisos cálidos de madera flotante, tabiquería interna de yeso y excelente iluminación natural diurna.
                      <br />
                      • <strong>Regla Estricta:</strong> Estrictamente una sola planta (planta baja sin desniveles, sin segunda planta, sin escaleras interiores).
                    </p>
                  </div>
                </div>
              )}

              {/* VISTA 2: PLANO 2D CAD INTERACTIVO */}
              {planViewMode === '2d' && (
                <div className="bg-neutral-950 p-4 rounded-2xl border border-white/10 flex flex-col items-center animate-in fade-in duration-200">
                  <div className="w-full max-w-md aspect-3/4 relative flex items-center justify-center border border-white/5 rounded-xl bg-neutral-900/50 p-3">
                    <svg
                      viewBox="0 0 420 540"
                      className="w-full h-full text-neutral-300 stroke-neutral-400 select-none"
                      fill="none"
                      strokeWidth="2"
                    >
                      {/* Contorno perimetral */}
                      <path
                        d="M 60 160 L 60 490 L 190 490 L 190 380 L 340 380 L 340 50 L 210 50 L 210 160 Z"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        fill="#064e3b"
                        fillOpacity="0.15"
                      />

                      {/* Baño interactivo */}
                      <g
                        onClick={() => {
                          handleSceneChange('interior-bano');
                          setShowPlanModal(false);
                        }}
                        className="cursor-pointer group"
                      >
                        <rect
                          x="245"
                          y="195"
                          width="90"
                          height="80"
                          rx="5"
                          className={`transition-all ${
                            currentScene === 'interior-bano'
                              ? 'fill-cyan-500/40 stroke-cyan-400 stroke-2'
                              : 'fill-cyan-950/40 stroke-cyan-500/50 hover:fill-cyan-500/30'
                          }`}
                        />
                        <text x="290" y="235" fill="#a5f3fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                          Baño
                        </text>
                        <text x="290" y="252" fill="#67e8f9" fontSize="9" textAnchor="middle">
                          2.30 × 1.60m
                        </text>
                        <circle cx="290" cy="265" r="4" fill="#06b6d4" />
                      </g>

                      {/* Dormitorio interactivo */}
                      <g
                        onClick={() => {
                          handleSceneChange('interior-dormitorio');
                          setShowPlanModal(false);
                        }}
                        className="cursor-pointer group"
                      >
                        <rect
                          x="215"
                          y="55"
                          width="120"
                          height="135"
                          rx="6"
                          className={`transition-all ${
                            currentScene === 'interior-dormitorio'
                              ? 'fill-violet-500/40 stroke-violet-400 stroke-2'
                              : 'fill-violet-950/40 stroke-violet-500/50 hover:fill-violet-500/30'
                          }`}
                        />
                        <text x="275" y="115" fill="#ddd6fe" fontSize="12" fontWeight="bold" textAnchor="middle">
                          Dormitorio
                        </text>
                        <text x="275" y="135" fill="#a78bfa" fontSize="10" textAnchor="middle">
                          3.70 × 3.50m
                        </text>
                        <circle cx="275" cy="150" r="4" fill="#8b5cf6" />
                      </g>

                      {/* Estar - Comedor interactivo */}
                      <g
                        onClick={() => {
                          handleSceneChange('interior');
                          setShowPlanModal(false);
                        }}
                        className="cursor-pointer group"
                      >
                        <rect
                          x="65"
                          y="215"
                          width="120"
                          height="265"
                          rx="6"
                          className={`transition-all ${
                            currentScene === 'interior'
                              ? 'fill-emerald-500/40 stroke-emerald-400 stroke-2'
                              : 'fill-emerald-950/40 stroke-emerald-500/50 hover:fill-emerald-500/30'
                          }`}
                        />
                        <text x="125" y="310" fill="#a7f3d0" fontSize="12" fontWeight="bold" textAnchor="middle">
                          Estar - Comedor
                        </text>
                        <text x="125" y="330" fill="#6ee7b7" fontSize="10" textAnchor="middle">
                          3.80 × 6.60 m
                        </text>
                        <circle cx="125" cy="355" r="5" fill="#10b981" />
                      </g>

                      {/* Cocina integrada */}
                      <g
                        onClick={() => {
                          handleSceneChange('interior');
                          setShowPlanModal(false);
                        }}
                        className="cursor-pointer group"
                      >
                        <rect x="70" y="165" width="115" height="45" rx="4" className="fill-amber-500/20 stroke-amber-400 hover:fill-amber-500/40" />
                        <text x="125" y="192" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Cocina integrada
                        </text>
                      </g>
                    </svg>
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-2">
                    Toca cualquier habitación en el plano para transportarte a su render 360°
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-neutral-950 p-3 rounded-xl border border-white/5 text-center">
                  <div className="text-[10px] uppercase text-neutral-400">Superficie</div>
                  <div className="text-sm font-semibold text-white mt-0.5">60 m²</div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-white/5 text-center">
                  <div className="text-[10px] uppercase text-neutral-400">Dormitorio</div>
                  <div className="text-sm font-semibold text-white mt-0.5">3.70 × 3.50 m</div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-white/5 text-center">
                  <div className="text-[10px] uppercase text-neutral-400">Estar-Comedor</div>
                  <div className="text-sm font-semibold text-white mt-0.5">3.80 × 6.60 m</div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-white/5 text-center">
                  <div className="text-[10px] uppercase text-neutral-400">Baño</div>
                  <div className="text-sm font-semibold text-white mt-0.5">2.30 × 1.60 m</div>
                </div>
              </div>

              {/* Selector directo de interiores y exteriores */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                {/* Vista Superior Aérea Cenital */}
                <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-300">
                        🚁 Vista Superior 360° (Perspectiva Cenital / Dron)
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Visualiza toda la propiedad desde arriba: cubierta de techos, pérgola, jardín y entorno en 360°.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSceneChange('vista-aerea');
                      setShowPlanModal(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-md shrink-0 transition-all"
                  >
                    Ver Vista Aérea
                  </button>
                </div>

                <div className="text-xs font-semibold text-white pt-1">
                  Áreas Interiores (Planimetría):
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      handleSceneChange('interior');
                      setShowPlanModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      currentScene === 'interior'
                        ? 'bg-emerald-950 border-emerald-400'
                        : 'bg-neutral-950 hover:bg-neutral-800 border-white/5'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-emerald-400">Estar - Comedor</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">3.80 × 6.60 m</div>
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('interior-dormitorio');
                      setShowPlanModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      currentScene === 'interior-dormitorio'
                        ? 'bg-violet-950 border-violet-400'
                        : 'bg-neutral-950 hover:bg-neutral-800 border-white/5'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-violet-400">Dormitorio</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">3.70 × 3.50 m</div>
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('interior-bano');
                      setShowPlanModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      currentScene === 'interior-bano'
                        ? 'bg-cyan-950 border-cyan-400'
                        : 'bg-neutral-950 hover:bg-neutral-800 border-white/5'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-cyan-400">Baño Completo</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">2.30 × 1.60 m</div>
                  </button>
                </div>

                <div className="text-xs font-semibold text-white pt-2">
                  Caras Exteriores de la Vivienda:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      handleSceneChange('fachada-frontal');
                      setShowPlanModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      currentScene === 'fachada-frontal'
                        ? 'bg-emerald-950 border-emerald-400'
                        : 'bg-neutral-950 hover:bg-neutral-800 border-white/5'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-emerald-400">1. Fachada Frontal</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Pérgola, Puerta y Cochera</div>
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('fachada-lateral');
                      setShowPlanModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      currentScene === 'fachada-lateral'
                        ? 'bg-emerald-950 border-emerald-400'
                        : 'bg-neutral-950 hover:bg-neutral-800 border-white/5'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-emerald-400">2. Fachada Lateral</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Galería con ventanal corredizo</div>
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('fachada-trasera');
                      setShowPlanModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      currentScene === 'fachada-trasera'
                        ? 'bg-emerald-950 border-emerald-400'
                        : 'bg-neutral-950 hover:bg-neutral-800 border-white/5'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-emerald-400">3. Fachada Trasera</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Contrafrente hacia jardín</div>
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('fachada-esquina');
                      setShowPlanModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      currentScene === 'fachada-esquina'
                        ? 'bg-emerald-950 border-emerald-400'
                        : 'bg-neutral-950 hover:bg-neutral-800 border-white/5'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-emerald-400">4. Esquina y Patio</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Volumen en L y sendero</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-900/90 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: AGREGAR NUEVO HOTSPOT EN TIEMPO REAL */}
      {showAddHotspotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-lg">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Crear Hotspot en este punto</h3>
              </div>
              <button
                onClick={() => setShowAddHotspotModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-neutral-950 p-3 rounded-xl border border-white/5 space-y-1 font-mono text-xs">
              <div className="text-neutral-400">Coordenadas actuales seleccionadas:</div>
              <div className="text-emerald-400 font-semibold">
                Pitch: {currentPitch}° &nbsp;|&nbsp; Yaw: {currentYaw}°
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Texto explicativo del Hotspot:
              </label>
              <textarea
                value={newHotspotText}
                onChange={(e) => setNewHotspotText(e.target.value)}
                placeholder="Ej: Abertura corrediza de aluminio hacia galería exterior..."
                rows={3}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-neutral-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddHotspotModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddHotspot}
                disabled={!newHotspotText.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-all shadow-md"
              >
                Añadir al Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
