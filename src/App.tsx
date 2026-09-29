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
  Cpu
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
  const [currentScene, setCurrentScene] = useState<'interior' | 'exterior' | 'custom'>('interior');
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>('render-360.jpg');

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
  const [showAddHotspotModal, setShowAddHotspotModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Hotspots list
  const [hotspots, setHotspots] = useState<HotspotItem[]>([
    {
      id: 'hs-1',
      pitch: -3.0,
      yaw: 22.0,
      text: 'Sala de Estar y Comedor (3.80m x 6.60m) con vista al jardín',
      type: 'info'
    },
    {
      id: 'hs-2',
      pitch: 1.5,
      yaw: 105.0,
      text: 'Cocina lineal integrada con bacha y mesada de trabajo',
      type: 'info'
    },
    {
      id: 'hs-3',
      pitch: -2.0,
      yaw: -70.0,
      text: 'Distribuidor hacia Dormitorio principal (3.70m x 3.50m) y Baño',
      type: 'info'
    }
  ]);

  const [newHotspotText, setNewHotspotText] = useState('');

  const panoramaRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const sceneInstanceRef = useRef<any>(null);
  const autorotateMovementRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener ruta de la imagen activa
  const getImageSource = () => {
    if (currentScene === 'custom' && customImageUrl) {
      return customImageUrl;
    }
    if (currentScene === 'exterior') {
      return '/exterior-360.jpg';
    }
    return '/render-360.jpg';
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

          const view = new window.Marzipano.RectilinearView(
            { yaw: 0, pitch: 0, fov: (hfov * Math.PI) / 180 },
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
            targetPitch: 0,
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
        className="w-full h-full absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Indicador de carga inicial */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-md pointer-events-none transition-opacity">
          <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium tracking-wider text-neutral-300 uppercase">
            Iniciando Motor {engine === 'marzipano' ? 'Marzipano WebGL' : 'Pannellum WebGL'}...
          </p>
          <span className="text-xs text-neutral-500 mt-1">
            Proyección equirrectangular ({currentScene === 'custom' ? customImageName : currentScene})
          </span>
        </div>
      )}

      {/* 1. BARRA SUPERIOR (HEADER) */}
      <header className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        {/* Título & Selector de Motor */}
        <div className="pointer-events-auto flex items-center gap-3 bg-neutral-900/85 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl shadow-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-white">
                Visor Panorámico 360°
              </h1>
              {/* Badge de librería activa */}
              <div className="flex items-center gap-1 bg-neutral-800/90 border border-emerald-500/30 rounded-full px-2 py-0.5">
                <Cpu className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  {engine === 'marzipano' ? 'Marzipano' : 'Pannellum'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              {currentScene === 'interior' && 'Render Arquitectónico • Estar - Comedor (Vivienda 60 m²)'}
              {currentScene === 'exterior' && 'Render Exterior • Fachada y Patio con Pérgola'}
              {currentScene === 'custom' && `Archivo Activo: ${customImageName}`}
            </p>
          </div>
        </div>

        {/* Acciones principales de la cabecera */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Selector de Motor WebGL */}
          <div className="hidden lg:flex items-center bg-neutral-900/85 backdrop-blur-md border border-white/10 p-1 rounded-2xl shadow-xl">
            <button
              onClick={() => {
                setEngine('marzipano');
                setCodeTab('marzipano');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                engine === 'marzipano'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
              title="Marzipano: Motor WebGL de alto rendimiento creado por Google"
            >
              Marzipano
            </button>
            <button
              onClick={() => {
                setEngine('pannellum');
                setCodeTab('pannellum');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                engine === 'pannellum'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
              title="Pannellum: Motor WebGL ligero y clásico"
            >
              Pannellum
            </button>
          </div>

          {/* Selector de Escenas */}
          <div className="hidden md:flex items-center bg-neutral-900/85 backdrop-blur-md border border-white/10 p-1 rounded-2xl shadow-xl">
            <button
              onClick={() => setCurrentScene('interior')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                currentScene === 'interior'
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              Interior
            </button>
            <button
              onClick={() => setCurrentScene('exterior')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                currentScene === 'exterior'
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              Exterior
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                currentScene === 'custom'
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir 360</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          {/* Botón Plano Arquitectónico de referencia */}
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center gap-1.5 bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 px-3 py-2 rounded-xl text-xs font-medium shadow-xl backdrop-blur-md transition-all"
            title="Ver Plano Arquitectónico (60 m²)"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Plano 60 m²</span>
          </button>

          {/* Botón Código index.html Completo */}
          <button
            onClick={() => {
              setCodeTab(engine);
              setShowCodeModal(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/30 px-3.5 py-2 rounded-xl text-xs font-medium shadow-xl backdrop-blur-md transition-all"
            title="Ver y descargar código index.html autónomo con Marzipano"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Código index.html</span>
          </button>

          {/* Botón Guía Live Server */}
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center justify-center w-9 h-9 bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 rounded-xl shadow-xl backdrop-blur-md transition-all"
            title="Instrucciones: Cómo correr con Live Server y evitar CORS"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Botón Pantalla Completa */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center w-9 h-9 bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 rounded-xl shadow-xl backdrop-blur-md transition-all"
            title="Alternar Pantalla Completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. INSPECTOR DE CÁMARA (Pitch & Yaw en tiempo real) */}
      <div className="absolute top-20 right-4 z-10 pointer-events-none hidden sm:flex flex-col items-end gap-2">
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

      {/* 3. BARRA DE CONTROLES INFERIOR FLOTANTE (HUD) */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-[94%] max-w-xl">
        <div className="pointer-events-auto bg-neutral-900/90 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3">
          {/* Rotación automática */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoRotate}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isRotating
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
              }`}
              title={isRotating ? 'Pausar rotación automática' : 'Iniciar rotación suave'}
            >
              {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRotating ? 'Rotación ON' : 'Rotación OFF'}</span>
            </button>
          </div>

          {/* Controles de Zoom y Reset */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleZoom('out')}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
              title="Alejar Zoom (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono text-neutral-400 px-1.5">
              {hfov}°
            </div>
            <button
              onClick={() => handleZoom('in')}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
              title="Acercar Zoom (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
              title="Restablecer Vista"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Hotspots */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHotspotsEnabled(!hotspotsEnabled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                hotspotsEnabled
                  ? 'bg-cyan-600/80 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title="Activar u ocultar puntos de interés (hotspots)"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Hotspots ({hotspots.length})</span>
            </button>
          </div>
        </div>
      </footer>

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

      {/* 6. MODAL: PLANO ARQUITECTÓNICO & DATOS DEL PROYECTO */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-lg">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Viviendas Trato Hecho • Módulo 2
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Planta Arquitectónica 60 m² (1 Dormitorio / Estar-Comedor / Baño)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-300">
              <div className="bg-neutral-950 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                <div className="w-full max-w-md aspect-3/4 relative flex items-center justify-center border border-white/5 rounded-xl bg-neutral-900/50 p-3">
                  <svg
                    viewBox="0 0 420 540"
                    className="w-full h-full text-neutral-300 stroke-neutral-400"
                    fill="none"
                    strokeWidth="2"
                  >
                    <path
                      d="M 60 160 L 60 490 L 190 490 L 190 380 L 340 380 L 340 50 L 210 50 L 210 160 Z"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="#064e3b"
                      fillOpacity="0.15"
                    />
                    <rect x="250" y="200" width="80" height="70" stroke="#94a3b8" strokeDasharray="3 3" />
                    <text x="290" y="240" fill="#94a3b8" fontSize="10" textAnchor="middle">
                      Baño 2.30x1.60
                    </text>
                    <rect x="220" y="60" width="110" height="130" stroke="#60a5fa" strokeDasharray="3 3" />
                    <text x="275" y="130" fill="#60a5fa" fontSize="11" textAnchor="middle">
                      Dormitorio 3.70 x 3.50
                    </text>
                    <rect x="70" y="220" width="130" height="250" stroke="#34d399" strokeDasharray="3 3" />
                    <text x="135" y="320" fill="#34d399" fontSize="11" textAnchor="middle">
                      Estar - Comedor
                    </text>
                    <text x="135" y="340" fill="#6ee7b7" fontSize="10" textAnchor="middle">
                      3.80 x 6.60 m
                    </text>
                    <rect x="75" y="170" width="125" height="35" stroke="#f59e0b" fill="#f59e0b" fillOpacity="0.2" />
                    <text x="137" y="192" fill="#fbbf24" fontSize="10" textAnchor="middle">
                      Cocina integrada
                    </text>
                    <circle cx="135" cy="300" r="10" fill="#10b981" fillOpacity="0.4" stroke="#10b981" strokeWidth="2" />
                    <circle cx="135" cy="300" r="3" fill="#ffffff" />
                    <text x="135" y="280" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Punto de Cámara 360°
                    </text>
                  </svg>
                </div>
                <span className="text-[11px] text-neutral-400 mt-2">
                  Esquema de distribución arquitectónica según la planimetría de Viviendas Trato Hecho
                </span>
              </div>

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
