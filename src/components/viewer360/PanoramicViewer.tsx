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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Navigation,
  Smartphone,
  Image as ImageIcon,
  ShieldCheck,
  Menu,
  Grid,
  ArrowLeft
} from 'lucide-react';
import { ArchitecturalFloorPlan } from '../ArchitecturalFloorPlan';

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

interface PanoramicViewerProps {
  onBackToSite?: () => void;
  isEmbedded?: boolean;
  initialScene?: string;
  modelName?: string;
}

export function PanoramicViewer({
  onBackToSite,
  isEmbedded = false,
  initialScene = 'fachada-frontal',
  modelName = 'MODELO 01'
}: PanoramicViewerProps) {
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
    | 'interior-dormitorio-2'
    | 'interior-bano'
    | 'custom'
  >(initialScene as any || 'fachada-frontal');

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
  const [rotateSpeed, setRotateSpeed] = useState(0.03);
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
            yaw: 90.0,
            text: 'Volumen Compacto en L: 84 m² cubiertos sin desniveles ni escaleras interiores',
            type: 'info'
          }
        ];
      case 'fachada-frontal':
        return [
          {
            id: 'ff-1',
            pitch: 2.5,
            yaw: -5.0,
            text: 'Acceso Principal PB: Puerta pivotante de aluminio negro y paño fijo vidriado DVH',
            type: 'info'
          },
          {
            id: 'ff-2',
            pitch: 8.0,
            yaw: 42.0,
            text: 'Pérgola Semicubierta: Estructura metálica para cochera y protección solar',
            type: 'info'
          }
        ];
      case 'fachada-lateral':
        return [
          {
            id: 'fl-1',
            pitch: -2.0,
            yaw: 15.0,
            text: 'Galería Semicubierta Integrada: Expansión directa desde cocina-comedor con asador',
            type: 'info'
          },
          {
            id: 'fl-2',
            pitch: 10.0,
            yaw: -28.0,
            text: 'Aleros y Pérgolas de Madera Tratada: Sombreamiento pasivo bioclimático',
            type: 'info'
          }
        ];
      case 'fachada-trasera':
        return [
          {
            id: 'ft-1',
            pitch: 0.0,
            yaw: 0.0,
            text: 'Ventilación Cruzada: Aberturas de piso a techo orientadas al patio posterior',
            type: 'info'
          }
        ];
      case 'fachada-esquina':
        return [
          {
            id: 'fe-1',
            pitch: 5.0,
            yaw: 20.0,
            text: 'Encuentro de Volúmenes en L: Galería exterior continua con solado antideslizante',
            type: 'info'
          }
        ];
      case 'exterior-dusk':
        return [
          {
            id: 'ed-1',
            pitch: 4.0,
            yaw: -10.0,
            text: 'Iluminación Escenográfica Nocturna: Bañadores LED perimetrales y apliques cálidos',
            type: 'info'
          }
        ];
      case 'interior':
        return [
          {
            id: 'in-1',
            pitch: -8.0,
            yaw: -25.0,
            text: 'Cocina Integrada: Isla central con mesada de granito / silestone y bacha embutida',
            type: 'info'
          },
          {
            id: 'in-2',
            pitch: 2.0,
            yaw: 65.0,
            text: 'Gran Salón Estar-Comedor: Conexión franca a jardín mediante ventanales corredizos DVH',
            type: 'info'
          }
        ];
      case 'interior-dormitorio':
        return [
          {
            id: 'id-1',
            pitch: -5.0,
            yaw: 0.0,
            text: 'Master Bedroom: Placard embutido de piso a techo y aislación acústica reforzada',
            type: 'info'
          }
        ];
      case 'interior-dormitorio-2':
        return [
          {
            id: 'id2-1',
            pitch: -4.0,
            yaw: -15.0,
            text: 'Dormitorio Secundario: Configuración para 2 camas twin con luz natural directa',
            type: 'info'
          }
        ];
      case 'interior-bano':
        return [
          {
            id: 'ib-1',
            pitch: -4.0,
            yaw: 0.0,
            text: 'Baño Completo Compartimentado: Box de ducha con mampara y vanitory flotante',
            type: 'info'
          }
        ];
      default:
        return [
          {
            id: 'default-1',
            pitch: 0,
            yaw: 0,
            text: 'Punto de Interés Arquitectónico MHC',
            type: 'info'
          }
        ];
    }
  };

  const [hotspots, setHotspots] = useState<HotspotItem[]>(getInitialHotspots(currentScene));
  const [newHotspotText, setNewHotspotText] = useState('');

  // Refs para los visores WebGL
  const containerRef = useRef<HTMLDivElement>(null);
  const marzipanoViewerRef = useRef<any>(null);
  const marzipanoSceneRef = useRef<any>(null);
  const autorotateMovementRef = useRef<any>(null);
  const pannellumViewerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mapeo de rutas de imágenes 360 y fotos planas
  const getImageSource = (): string => {
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
      case 'interior-dormitorio-2':
        return '/interior-dormitorio-360.jpg';
      case 'interior-bano':
        return '/interior-bano-360.jpg';
      default:
        return '/fachada-frontal-360.jpg';
    }
  };

  const getFlatImageSource = (): string => {
    if (currentScene === 'custom' && customImageUrl) {
      return customImageUrl;
    }
    switch (currentScene) {
      case 'vista-aerea':
        return '/corte-isometrico-3d.jpg';
      case 'fachada-frontal':
        return '/foto-frente-plana.jpg';
      case 'fachada-lateral':
        return '/foto-lateral-plana.jpg';
      case 'fachada-trasera':
        return '/foto-trasera-plana.jpg';
      case 'fachada-esquina':
        return '/foto-esquina-plana.jpg';
      case 'exterior-dusk':
        return '/foto-dusk-plana.jpg';
      case 'interior':
        return '/foto-interior-plana.jpg';
      case 'interior-dormitorio':
        return '/foto-dormitorio-plana.jpg';
      case 'interior-dormitorio-2':
        return '/foto-dorm2-plana.jpg';
      case 'interior-bano':
        return '/foto-bano-plana.jpg';
      default:
        return '/foto-frente-plana.jpg';
    }
  };

  const getSceneTitle = (): string => {
    switch (currentScene) {
      case 'vista-aerea':
        return 'Vista Aérea (Cubierta y Entorno)';
      case 'fachada-frontal':
        return '1. Acceso Principal y Fachada Frente';
      case 'fachada-lateral':
        return '2. Fachada Lateral y Galería Asador';
      case 'fachada-trasera':
        return '3. Fachada Posterior y Jardín';
      case 'fachada-esquina':
        return '4. Esquina y Patio Volumétrico';
      case 'exterior-dusk':
        return '5. Vista Crepúsculo y Escenografía';
      case 'interior':
        return '6. Interior: Living, Comedor y Cocina';
      case 'interior-dormitorio':
        return '7. Interior: Dormitorio Principal (Suite)';
      case 'interior-dormitorio-2':
        return '8. Interior: Dormitorio 2 (Huéspedes)';
      case 'interior-bano':
        return '9. Interior: Baño Completo Compartimentado';
      case 'custom':
        return `Archivo Personalizado: ${customImageName}`;
      default:
        return 'Experiencia 360° MHC';
    }
  };

  const getSceneDescription = (): string => {
    switch (currentScene) {
      case 'vista-aerea':
        return 'Techo plano con pretil • Distribución compacta en una sola planta • Monte Hermoso';
      case 'fachada-frontal':
        return 'Ingreso principal jerarquizado con alero y carpintería de seguridad DVH';
      case 'fachada-lateral':
        return 'Galería apergolada en voladizo con parrilla de mampostería integrada';
      case 'fachada-trasera':
        return 'Gran apertura visual hacia patio privado con orientación bioclimática favorable';
      case 'fachada-esquina':
        return 'Volumen en L de 84 m² cubiertos sin desniveles de suelo';
      case 'exterior-dusk':
        return 'Iluminación arquitectónica cálida al atardecer en la costa';
      case 'interior':
        return 'Estar-Comedor-Cocina integrada (27.10 m²) • Isla desayunadora • Amplitud espacial';
      case 'interior-dormitorio':
        return 'Dormitorio Principal (12.05 m²) • Ventanal hacia jardín • Confort acústico';
      case 'interior-dormitorio-2':
        return 'Dormitorio Huéspedes (11.05 m²) • Espacio para 2 camas y placard embutido';
      case 'interior-bano':
        return 'Baño Completo (4.44 m²) • Box de ducha y vanitory flotante';
      case 'custom':
        return 'Panorámica 360° cargada localmente';
      default:
        return '';
    }
  };

  const ALL_SCENES = [
    { id: 'fachada-frontal', name: '1. Frente', icon: '🏛️' },
    { id: 'fachada-lateral', name: '2. Galería', icon: '☀️' },
    { id: 'fachada-trasera', name: '3. Trasera', icon: '🌿' },
    { id: 'fachada-esquina', name: '4. Esquina', icon: '📐' },
    { id: 'exterior-dusk', name: '5. Atardecer', icon: '🌙' },
    { id: 'interior', name: '6. Estar Cocina', icon: '🛋️' },
    { id: 'interior-dormitorio', name: '7. Suite', icon: '🛏️' },
    { id: 'interior-dormitorio-2', name: '8. Dorm 2', icon: '🛌' },
    { id: 'interior-bano', name: '9. Baño', icon: '🚿' },
    { id: 'vista-aerea', name: '10. Aérea 3D', icon: '🚁' }
  ];

  // Actualizar hotspots al cambiar de escena
  useEffect(() => {
    setHotspots(getInitialHotspots(currentScene));
    setFlatZoom(1);
  }, [currentScene]);

  // Manejo de Giroscopio en Mobile
  const toggleGyroscope = () => {
    if (!gyroActive) {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        (DeviceOrientationEvent as any)
          .requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              setGyroActive(true);
            } else {
              alert('Permiso denegado para el sensor de movimiento.');
            }
          })
          .catch(console.error);
      } else {
        setGyroActive(true);
      }
    } else {
      setGyroActive(false);
    }
  };

  // Escuchar DeviceOrientation si el giroscopio está activo
  useEffect(() => {
    if (!gyroActive || displayMode !== '360') return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!marzipanoViewerRef.current) return;
      const view = marzipanoViewerRef.current.view();
      if (!view) return;

      const alpha = event.alpha ? (event.alpha * Math.PI) / 180 : 0;
      const beta = event.beta ? (event.beta * Math.PI) / 180 : 0;

      view.setYaw(-alpha);
      view.setPitch(Math.max(-Math.PI / 3, Math.min(Math.PI / 3, beta - Math.PI / 2)));
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gyroActive, displayMode]);

  // Inicializar o actualizar el visor 360 cuando se cambia de escena o motor
  useEffect(() => {
    if (displayMode !== '360') return;

    let isMounted = true;
    setIsLoaded(false);

    const initViewer = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';

      if (engine === 'marzipano' && window.Marzipano) {
        try {
          const viewerOpts = {
            controls: {
              mouseViewMode: 'drag',
              scrollZoom: true
            }
          };
          const viewer = new window.Marzipano.Viewer(containerRef.current, viewerOpts);
          marzipanoViewerRef.current = viewer;

          const source = window.Marzipano.ImageUrlSource.fromString(getImageSource(), {
            crossOrigin: 'anonymous'
          });

          const geometry = new window.Marzipano.EquirectGeometry([{ width: 4000 }]);

          const limiter = window.Marzipano.RectilinearView.limit.traditional(
            4000,
            (isAntiDistortionActive ? 65 : 100) * (Math.PI / 180),
            (isAntiDistortionActive ? 70 : 120) * (Math.PI / 180)
          );

          const initialFov = isAntiDistortionActive ? 65 : hfov;
          const view = new window.Marzipano.RectilinearView(
            { yaw: currentYaw * (Math.PI / 180), pitch: currentPitch * (Math.PI / 180), fov: (initialFov * Math.PI) / 180 },
            limiter
          );

          const scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
          });

          marzipanoSceneRef.current = scene;
          scene.switchTo({ transitionDuration: 300 });

          // Configurar autorrotación suave
          const autorotate = window.Marzipano.autorotate({
            yawSpeed: rotateSpeed,
            targetPitch: 0,
            targetFov: (initialFov * Math.PI) / 180
          });
          autorotateMovementRef.current = autorotate;

          if (isRotating) {
            viewer.startMovement(autorotate);
            viewer.setIdleMovement(3000, autorotate);
          }

          view.addEventListener('change', () => {
            if (!isMounted) return;
            const yawDeg = Math.round(view.yaw() * (180 / Math.PI));
            const pitchDeg = Math.round(view.pitch() * (180 / Math.PI));
            const fovDeg = Math.round(view.fov() * (180 / Math.PI));
            setCurrentYaw(yawDeg);
            setCurrentPitch(pitchDeg);
            setHfov(fovDeg);
          });

          // Hotspots
          if (hotspotsEnabled) {
            hotspots.forEach((hs) => {
              const hotspotEl = document.createElement('div');
              hotspotEl.className = 'hotspot-marker';
              hotspotEl.innerHTML = `
                <div style="position: relative; cursor: pointer;">
                  <div style="width: 28px; height: 28px; background: #2b3a32; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 14px rgba(43,58,50,0.8); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
                    MHC
                  </div>
                  <div style="position: absolute; bottom: 34px; left: 50%; transform: translateX(-50%); background: rgba(18,20,21,0.94); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 6px 12px; border-radius: 8px; font-size: 12px; white-space: nowrap; box-shadow: 0 6px 18px rgba(0,0,0,0.5); pointer-events: none;">
                    ${hs.text}
                  </div>
                </div>
              `;
              scene.hotspotContainer().createHotspot(hotspotEl, {
                yaw: (hs.yaw * Math.PI) / 180,
                pitch: (hs.pitch * Math.PI) / 180
              });
            });
          }

          setIsLoaded(true);
        } catch (e) {
          console.error('Error inicializando Marzipano:', e);
        }
      } else if (engine === 'pannellum' && window.pannellum) {
        try {
          const viewer = window.pannellum.viewer(containerRef.current, {
            type: 'equirectangular',
            panorama: getImageSource(),
            autoLoad: true,
            autoRotate: isRotating ? -2 : 0,
            crossOrigin: 'anonymous',
            showZoomCtrl: false,
            showFullscreenCtrl: false,
            compass: true,
            mouseZoom: true,
            hfov: isAntiDistortionActive ? 65 : hfov,
            pitch: currentPitch,
            yaw: currentYaw,
            hotSpots: hotspotsEnabled
              ? hotspots.map((hs) => ({
                  pitch: hs.pitch,
                  yaw: hs.yaw,
                  type: hs.type,
                  text: hs.text
                }))
              : []
          });

          pannellumViewerRef.current = viewer;

          viewer.on('load', () => {
            if (isMounted) setIsLoaded(true);
          });
        } catch (e) {
          console.error('Error inicializando Pannellum:', e);
        }
      }
    };

    const timer = setTimeout(initViewer, 60);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (marzipanoViewerRef.current) {
        marzipanoViewerRef.current.destroy();
        marzipanoViewerRef.current = null;
      }
      if (pannellumViewerRef.current) {
        try {
          pannellumViewerRef.current.destroy();
        } catch (_) {}
        pannellumViewerRef.current = null;
      }
    };
  }, [engine, currentScene, displayMode, isAntiDistortionActive, hotspotsEnabled, customImageUrl]);

  // Controles de zoom y rotación
  const handleZoomIn = () => {
    if (displayMode === 'flat') {
      setFlatZoom((z) => Math.min(2.5, z + 0.25));
      return;
    }
    if (engine === 'marzipano' && marzipanoViewerRef.current) {
      const view = marzipanoViewerRef.current.view();
      if (view) {
        view.setFov(Math.max(40 * (Math.PI / 180), view.fov() - 10 * (Math.PI / 180)));
      }
    } else if (engine === 'pannellum' && pannellumViewerRef.current) {
      pannellumViewerRef.current.setHfov(Math.max(40, hfov - 10));
    }
  };

  const handleZoomOut = () => {
    if (displayMode === 'flat') {
      setFlatZoom((z) => Math.max(1, z - 0.25));
      return;
    }
    if (engine === 'marzipano' && marzipanoViewerRef.current) {
      const view = marzipanoViewerRef.current.view();
      if (view) {
        view.setFov(Math.min(115 * (Math.PI / 180), view.fov() + 10 * (Math.PI / 180)));
      }
    } else if (engine === 'pannellum' && pannellumViewerRef.current) {
      pannellumViewerRef.current.setHfov(Math.min(115, hfov + 10));
    }
  };

  const toggleRotation = () => {
    const nextState = !isRotating;
    setIsRotating(nextState);

    if (engine === 'marzipano' && marzipanoViewerRef.current) {
      if (nextState) {
        if (autorotateMovementRef.current) {
          marzipanoViewerRef.current.startMovement(autorotateMovementRef.current);
          marzipanoViewerRef.current.setIdleMovement(3000, autorotateMovementRef.current);
        }
      } else {
        marzipanoViewerRef.current.stopMovement();
        marzipanoViewerRef.current.setIdleMovement(Infinity, null);
      }
    } else if (engine === 'pannellum' && pannellumViewerRef.current) {
      pannellumViewerRef.current.startAutoRotate(nextState ? -2 : 0);
    }
  };

  const resetView = () => {
    if (displayMode === 'flat') {
      setFlatZoom(1);
      return;
    }
    if (engine === 'marzipano' && marzipanoViewerRef.current) {
      const view = marzipanoViewerRef.current.view();
      if (view) {
        view.setParameters({
          yaw: 0,
          pitch: 0,
          fov: (isAntiDistortionActive ? 65 : 90) * (Math.PI / 180)
        });
      }
    } else if (engine === 'pannellum' && pannellumViewerRef.current) {
      pannellumViewerRef.current.setPitch(0);
      pannellumViewerRef.current.setYaw(0);
      pannellumViewerRef.current.setHfov(isAntiDistortionActive ? 65 : 90);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImageUrl(url);
      setCustomImageName(file.name);
      setCurrentScene('custom');
    }
  };

  const handleAddHotspot = () => {
    if (!newHotspotText.trim()) return;
    const newHs: HotspotItem = {
      id: `hs-${Date.now()}`,
      pitch: currentPitch,
      yaw: currentYaw,
      text: newHotspotText,
      type: 'info'
    };
    setHotspots((prev) => [...prev, newHs]);
    setNewHotspotText('');
    setShowAddHotspotModal(false);
  };

  return (
    <div className={`relative w-full ${isEmbedded ? 'h-[700px] rounded-2xl overflow-hidden border border-white/10' : 'h-screen fixed inset-0 z-50 bg-[#121415]'}`}>
      {/* 1. BARRA SUPERIOR DE ESTADO Y ACCIONES */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-3">
          {onBackToSite && (
            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-medium transition-colors border border-white/15"
              title="Volver al sitio web MHC"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Sitio</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-bold tracking-widest text-[#E7E1D8]">MHC</span>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-xs text-neutral-200 font-medium">{modelName}</span>
            <span className="text-white/30 text-xs hidden sm:inline">/</span>
            <span className="text-xs text-[#8A8D8F] hidden sm:inline">{getSceneTitle()}</span>
          </div>
        </div>

        {/* SELECTOR DE MODO: 360 INTERACTIVO vs FOTO PLANA HD */}
        <div className="flex items-center gap-1.5 bg-neutral-900/85 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-xl">
          <button
            onClick={() => setDisplayMode('360')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              displayMode === '360'
                ? 'bg-[#2E3B33] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tour 360°</span>
          </button>
          <button
            onClick={() => setDisplayMode('flat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              displayMode === 'flat'
                ? 'bg-[#2E3B33] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Foto Plana HD</span>
          </button>
        </div>

        {/* HERRAMIENTAS ADICIONALES */}
        <div className="flex items-center gap-2">
          {/* Botón Plano CAD */}
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 text-xs font-medium border border-white/10 backdrop-blur-md transition-colors"
          >
            <Grid className="w-3.5 h-3.5 text-[#E7E1D8]" />
            <span className="hidden sm:inline">Plano CAD</span>
          </button>

          {/* Calibración Antidistorsión en 360 */}
          {displayMode === '360' && (
            <button
              onClick={() => setIsAntiDistortionActive(!isAntiDistortionActive)}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isAntiDistortionActive
                  ? 'bg-neutral-800 text-[#E7E1D8] border-[#2E3B33]'
                  : 'bg-neutral-900/80 text-neutral-400 border-white/10 hover:text-white'
              }`}
              title="Fija el FOV a 65° para eliminar la distorsión curva esférica en paredes y esquinas"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Paredes Rectas</span>
            </button>
          )}

          {/* Menú móvil */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg bg-neutral-900/80 text-neutral-200 border border-white/10"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. ÁREA DE VISUALIZACIÓN PRINCIPAL */}
      <div className="w-full h-full relative">
        {displayMode === '360' ? (
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        ) : (
          <div className="w-full h-full overflow-hidden flex items-center justify-center bg-black relative">
            <img
              src={getFlatImageSource()}
              alt={getSceneTitle()}
              style={{ transform: `scale(${flatZoom})`, transition: 'transform 0.25s ease' }}
              className="max-w-full max-h-full object-contain select-none"
            />
            {/* Overlay informativo de la fotografía plana */}
            <div className="absolute top-16 left-4 md:left-6 z-20 bg-neutral-900/80 backdrop-blur-md border border-white/10 p-3 rounded-xl max-w-sm">
              <div className="text-[11px] font-semibold text-[#E7E1D8] uppercase tracking-wider">
                Fotografía Plana Rectilínea HD
              </div>
              <div className="text-xs text-white font-medium mt-0.5">{getSceneTitle()}</div>
              <div className="text-[11px] text-neutral-400 mt-1">{getSceneDescription()}</div>
            </div>
          </div>
        )}
      </div>

      {/* 3. MINIMAPA ARQUITECTÓNICO FLOTANTE (SINCRONIZADO) */}
      {showMinimap && (
        <div className="absolute bottom-24 right-4 md:right-6 z-30 pointer-events-auto">
          <div
            className={`transition-all duration-300 rounded-2xl overflow-hidden border border-white/15 bg-neutral-950/90 backdrop-blur-lg shadow-2xl ${
              isMinimapExpanded ? 'w-80 md:w-96' : 'w-48 md:w-56'
            }`}
          >
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/90 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#E7E1D8]" />
                <span className="text-[11px] font-semibold tracking-wide text-white">Planta Baja 84m²</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimapExpanded(!isMinimapExpanded)}
                  className="text-neutral-400 hover:text-white p-1 text-xs"
                  title="Expandir / Minimizar Minimapa"
                >
                  {isMinimapExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => setShowMinimap(false)}
                  className="text-neutral-400 hover:text-white p-1 text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-3">
              <svg viewBox="0 0 400 280" className="w-full h-auto select-none">
                {/* Contorno exterior */}
                <rect x="20" y="20" width="360" height="240" fill="#181A1B" stroke="#444" strokeWidth="2" rx="6" />

                {/* Living / Cocina */}
                <rect
                  x="30"
                  y="30"
                  width="180"
                  height="140"
                  fill={currentScene === 'interior' ? '#2E3B33' : '#222527'}
                  stroke={currentScene === 'interior' ? '#E7E1D8' : '#333'}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-colors"
                  onClick={() => setCurrentScene('interior')}
                />
                <text x="75" y="105" fill="#E7E1D8" fontSize="11" fontWeight="bold" pointerEvents="none">
                  Estar / Cocina
                </text>

                {/* Dormitorio Principal */}
                <rect
                  x="220"
                  y="30"
                  width="160"
                  height="100"
                  fill={currentScene === 'interior-dormitorio' ? '#2E3B33' : '#222527'}
                  stroke={currentScene === 'interior-dormitorio' ? '#E7E1D8' : '#333'}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-colors"
                  onClick={() => setCurrentScene('interior-dormitorio')}
                />
                <text x="250" y="85" fill="#E7E1D8" fontSize="11" fontWeight="bold" pointerEvents="none">
                  Dormitorio 1
                </text>

                {/* Dormitorio 2 */}
                <rect
                  x="220"
                  y="140"
                  width="160"
                  height="110"
                  fill={currentScene === 'interior-dormitorio-2' ? '#2E3B33' : '#222527'}
                  stroke={currentScene === 'interior-dormitorio-2' ? '#E7E1D8' : '#333'}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-colors"
                  onClick={() => setCurrentScene('interior-dormitorio-2')}
                />
                <text x="250" y="200" fill="#E7E1D8" fontSize="11" fontWeight="bold" pointerEvents="none">
                  Dormitorio 2
                </text>

                {/* Baño */}
                <rect
                  x="30"
                  y="180"
                  width="180"
                  height="70"
                  fill={currentScene === 'interior-bano' ? '#2E3B33' : '#222527'}
                  stroke={currentScene === 'interior-bano' ? '#E7E1D8' : '#333'}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-colors"
                  onClick={() => setCurrentScene('interior-bano')}
                />
                <text x="85" y="220" fill="#E7E1D8" fontSize="11" fontWeight="bold" pointerEvents="none">
                  Baño Completo
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 4. BARRA DE NAVEGACIÓN DE ESCENAS (CARRUSEL INFERIOR) */}
      <div className="absolute bottom-4 left-4 right-4 md:left-12 md:right-12 z-30 flex items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-neutral-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
          {ALL_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setCurrentScene(scene.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentScene === scene.id
                  ? 'bg-[#2E3B33] text-white shadow-md font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{scene.icon}</span>
              <span>{scene.name}</span>
            </button>
          ))}
        </div>

        {/* CONTROLES FLOTANTES DE CÁMARA */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10"
            title="Acercar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10"
            title="Alejar Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {displayMode === '360' && (
            <button
              onClick={toggleRotation}
              className={`p-2 rounded-xl transition-colors ${
                isRotating ? 'bg-[#2E3B33] text-white' : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
              title="Alternar Rotación Automática"
            >
              {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={resetView}
            className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10"
            title="Restablecer Vista"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10"
            title="Pantalla Completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 5. MODAL DE PLANO CAD COMPLETO */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-white/15 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 bg-neutral-950 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#E7E1D8]" />
                <h3 className="text-sm md:text-base font-semibold text-white">
                  Planimetría CAD & Corte Isométrico — {modelName} (84 m²)
                </h3>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPlanViewMode('3d-cutaway')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold ${
                    planViewMode === '3d-cutaway'
                      ? 'bg-[#2E3B33] text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Corte Isométrico 3D
                </button>
                <button
                  onClick={() => setPlanViewMode('2d')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold ${
                    planViewMode === '2d'
                      ? 'bg-[#2E3B33] text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Plano CAD 2D Interactivo
                </button>
              </div>

              {planViewMode === '3d-cutaway' ? (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                  <img
                    src="/corte-isometrico-3d.jpg"
                    alt="Corte Isométrico 3D"
                    className="w-full max-h-[500px] object-contain"
                  />
                </div>
              ) : (
                <ArchitecturalFloorPlan
                  currentScene={currentScene}
                  onSelectScene={(sceneId) => {
                    setCurrentScene(sceneId as any);
                    setShowPlanModal(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
