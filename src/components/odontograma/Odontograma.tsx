import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toothMap } from './toothMap';
import type { ToothInfo, ToothStatus } from './types';

interface OdontogramaProps {
  width?: number; // canvas width in px (default 100%)
  height?: number; // canvas height in px
  baseImageUrl?: string; // optional background (overrides baseDir)
  value?: Record<string, ToothInfo>;
  onChange?: (next: Record<string, ToothInfo>) => void;
  onToothClick?: (id: string) => void;
  multiSelect?: boolean;
  assetBase?: 'root' | 'dentes'; // deprecated (mantido por compatibilidade)
  baseDir?: string;  // ex: '/odontograma/base'
  teethDir?: string; // ex: '/odontograma/dentes'
  iconsDir?: string; // ex: '/odontograma/icones'
  facesDir?: string; // ex: '/odontograma/faces'
  toothMapFile?: string; // caminho opcional para um JSON com mapeamento { "11": "Dente 11.png" }
}

const statusColors: Record<ToothStatus, string> = {
  saudavel: 'ring-green-500',
  carie: 'ring-red-500',
  restaurado: 'ring-blue-500',
  ausente: 'ring-gray-400',
  implante: 'ring-amber-500',
  fraturado: 'ring-rose-500',
  planejado: 'ring-purple-500',
};

export const Odontograma: React.FC<OdontogramaProps> = ({
  width,
  height = 560,
  baseImageUrl,
  value,
  onChange,
  onToothClick,
  multiSelect = true,
  assetBase = 'dentes',
  baseDir = '/odontograma/base',
  teethDir = '/odontograma/dentes',
  iconsDir = '/odontograma/icones',
  facesDir = '/odontograma/faces',
  toothMapFile = '/odontograma/map.json',
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const model = useMemo(() => value ?? {}, [value]);
  const [errorImages, setErrorImages] = useState<Record<string, number>>({}); // 0: ok, 1: try alt, 2: fail
  const [zoom, setZoom] = useState(1);
  const [baseErrorCount, setBaseErrorCount] = useState(0);
  const [assetMap, setAssetMap] = useState<Record<string, string>>({});

  // Tenta carregar um mapeamento customizado de arquivos -> id de dente
  useEffect(() => {
    const tryFetch = async (url: string) => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            setAssetMap(data as Record<string, string>);
          }
        }
      } catch {
        // silencioso
      }
    };
    // ordem de tentativa
    tryFetch(toothMapFile);
    if (toothMapFile !== '/odontograma/dentes/map.json') tryFetch('/odontograma/dentes/map.json');
    if (toothMapFile !== '/odontograma/map.json') tryFetch('/odontograma/map.json');
  }, [toothMapFile]);

  // Layout scaling to keep teeth inside dialog and aligned with background
  const BASE_W = 1200;
  const BASE_H = 600;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [imageBox, setImageBox] = useState<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setContainerSize({ w: rect.width, h: rect.height });
    });
    ro.observe(el);
    // Initial measure
    const rect = el.getBoundingClientRect();
    setContainerSize({ w: rect.width, h: rect.height });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const { w: cw, h: ch } = containerSize;
    if (!cw || !ch) return;
    const aspect = BASE_W / BASE_H;
    const cAspect = cw / ch;
    let iw = 0, ih = 0, ix = 0, iy = 0;
    if (cAspect > aspect) {
      // container mais largo: imagem ocupa toda altura
      ih = ch;
      iw = ih * aspect;
      ix = (cw - iw) / 2;
      iy = 0;
    } else {
      // container mais alto: imagem ocupa toda largura
      iw = cw;
      ih = iw / aspect;
      ix = 0;
      iy = (ch - ih) / 2;
    }
    setImageBox({ x: ix, y: iy, w: iw, h: ih });
  }, [containerSize.w, containerSize.h]);

  const missingCount = Object.values(errorImages).filter(v => v >= 2).length;
  const basicMode = missingCount >= 8 || baseErrorCount >= 3; // fallback quando não há assets

  const scaleX = (imageBox.w || containerSize.w) / BASE_W;
  const scaleY = (imageBox.h || containerSize.h) / BASE_H;
  const display = {
    w: imageBox.w * zoom,
    h: imageBox.h * zoom,
    x: Math.max((containerSize.w - imageBox.w * zoom) / 2, 0),
    y: Math.max((containerSize.h - imageBox.h * zoom) / 2, 0),
  };

  const getToothCandidates = (id: string) => {
    // Se existir mapeamento explícito, respeitar caminhos informados
    const explicit = assetMap[id];
    if (explicit) {
      const p = explicit.startsWith('/') ? explicit : `${teethDir}/${explicit}`;
      return [encodeURI(p)];
    }

    const names = [
      `tooth-${id}`, `tooth_${id}`, `tooth${id}`, `tooth ${id}`,
      `dente-${id}`, `dente_${id}`, `dente${id}`, `dente ${id}`,
      `${id}`,
      `FDI-${id}`, `FDI_${id}`,
    ];
    const exts = ['png', 'PNG', 'webp', 'svg'];
    const dirs = [
      teethDir,
      '/odontograma/dentes',
      '/odontograma/icons',
      '/odontograma',
    ];
    const combos: string[] = [];
    for (const d of dirs) for (const n of names) for (const e of exts) combos.push(`${d}/${n}.${e}`);
    return combos.map((p) => encodeURI(p));
  };

  const getToothSrc = (id: string) => {
    const tries = errorImages[id] ?? 0;
    const candidates = getToothCandidates(id);
    return candidates[tries] ?? '';
  };

  // Log único de assets faltando para ajudar debug
  useEffect(() => {
    // Após primeiras tentativas de carregamento (pequeno delay)
    const timer = setTimeout(() => {
      const expected = Object.keys(toothMap);
      const missing = expected.filter(id => (errorImages[id] ?? 0) >= 2);
      if (missing.length) {
        console.warn('[Odontograma] PNGs não encontrados para dentes:', missing.join(', '));
        console.warn('Verifique se eles estão em: public/odontograma/dentes/tooth-<id>.png');
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [errorImages]);

  // Sincroniza seleção com o valor controlado
  useEffect(() => {
    const keys = Object.keys(model);
    setSelected(keys);
  }, [model]);

  const toggleTooth = (id: string) => {
    const exists = selected.includes(id);
    // atualiza selected (UI)
    setSelected((prev) => {
      if (multiSelect) {
        return exists ? prev.filter((t) => t !== id) : [...prev, id];
      }
      return exists ? [] : [id];
    });
    // atualiza modelo externo (dados)
    if (exists) {
      const next: Record<string, ToothInfo> = { ...model };
      delete next[id];
      onChange?.(next);
    } else {
      const next: Record<string, ToothInfo> = { ...model, [id]: { id, status: model[id]?.status ?? 'saudavel' } };
      onChange?.(next);
    }
  };

  const cycleStatus = (id: string) => {
    const order: ToothStatus[] = ['saudavel', 'carie', 'restaurado', 'ausente', 'implante', 'fraturado', 'planejado'];
    const current = model[id]?.status ?? 'saudavel';
    const next = order[(order.indexOf(current) + 1) % order.length];
    const nextModel: Record<string, ToothInfo> = { ...model, [id]: { id, status: next } };
    onChange?.(nextModel);
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-auto rounded-lg border border-neutral-300 bg-neutral-50" style={{ height }}>
      {/* base background positioned/scaled to fit */}
      {!basicMode && (
        <img
          src={baseImageUrl || `${baseDir}/odontograma-base.png`}
          alt="base"
          className="absolute pointer-events-none select-none"
          style={{ left: display.x, top: display.y, width: display.w, height: display.h }}
          onError={(e) => {
            // tenta caminho alternativo se base não existir
            setBaseErrorCount((n)=>n+1);
            const t = e.currentTarget as HTMLImageElement;
            const seq = [
              baseImageUrl || `${baseDir}/odontograma-base.png`,
              `${baseDir}/odontograma_base.png`,
              `${baseDir}/odontograma perfeito.png`,
              `${baseDir}/odontograma perfeito sem fundo.png`,
              `${baseDir}/odontograma perfeito pouca opacidadeo.png`,
              '/odontograma/odontograma-base.png',
              '/odontograma/dentes/odontograma-base.png',
              `${baseDir}/odontograma-base.webp`,
              `${baseDir}/odontograma_base.webp`,
              '/odontograma/odontograma-base.webp',
              '/odontograma/odontograma.svg',
            ].map((p) => encodeURI(p));
            const idx = parseInt(t.dataset.baseidx || '0', 10);
            const next = seq[idx + 1];
            if (next) {
              t.dataset.baseidx = String(idx + 1);
              t.src = next;
            }
          }}
        />
      )}

      {/* teeth */}
      <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
        {Object.entries(toothMap).map(([id, b]) => {
          const x = display.x + b.x * scaleX * zoom;
          const y = display.y + b.y * scaleY * zoom;
          const w = Math.max(22, b.w * scaleX * zoom);
          const h = Math.max(22, b.h * scaleY * zoom);
          return { id, x, y, w, h };
        }).map(({id, x, y, w, h}) => (
          <button
            key={id}
            onClick={() => { toggleTooth(id); onToothClick?.(id); }}
            onDoubleClick={() => cycleStatus(id)}
            className={`absolute rounded-full ring-2 transition-shadow bg-white/80 border border-neutral-300 ${selected.includes(id) ? 'ring-primary-600' : 'ring-transparent'} hover:ring-primary-400 group`}
            style={{ left: x, top: y, width: w, height: h }}
            title={`Dente ${id}`}
          >
            {(errorImages[id] ?? 0) < 2 ? (
              <img
                src={getToothSrc(id)}
                alt={`Dente ${id}`}
                className="w-full h-full object-contain select-none"
                onError={() =>
                  setErrorImages((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-200 text-[11px] font-semibold text-neutral-700 border border-neutral-300 rounded relative">
                {id}
              </div>
            )}
            {model[id]?.status && (
              <span className={`pointer-events-none absolute -inset-1 rounded-full ring-2 ${statusColors[model[id].status]}`} />
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm rounded-md p-2 text-xs text-neutral-700 shadow max-w-[40%]">
        <p><strong>Dicas:</strong> Clique para selecionar; duplo clique alterna status.</p>
      </div>

      {/* Aviso quando imagens não são encontradas */}
      {missingCount > 8 && (
        <div className="absolute top-2 left-2 bg-amber-50 text-amber-800 border border-amber-300 rounded px-2 py-1 text-xs shadow">
          Faltam imagens. Usando círculos com número dos dentes.
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-md p-1 text-xs text-neutral-700 shadow flex items-center gap-1">
        <button
          className="px-2 py-1 rounded border hover:bg-white"
          onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))}
          title="Diminuir"
        >−</button>
        <span className="px-2 select-none w-14 text-center">{Math.round(zoom * 100)}%</span>
        <button
          className="px-2 py-1 rounded border hover:bg-white"
          onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2)))}
          title="Aumentar"
        >+</button>
        <button
          className="ml-1 px-2 py-1 rounded border hover:bg-white"
          onClick={() => setZoom(1)}
          title="Reset"
        >Reset</button>
      </div>
    </div>
  );
};

export default Odontograma;
