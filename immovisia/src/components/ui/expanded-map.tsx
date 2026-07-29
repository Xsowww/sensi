import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

/* Adapted from the upstream expanded-map block.

   Changes required to run here:
   - `next/image` replaced with `<img>`; this is a Vite app, not Next.js
   - the shadcn theme classes it used (`bg-background`, `text-foreground`,
     `border-border`, `bg-muted`, `text-muted-foreground`) do not exist in this
     project, which never ran `shadcn init`. Tailwind would not have emitted
     them at all, so the card would have rendered unstyled. Replaced with the
     site's own palette
   - fluid width instead of animating between fixed 240px and 360px, which
     overflowed the narrower listing cards on mobile
   - `crossOrigin="anonymous"` dropped from the tiles. It forces a CORS request
     for images that never touch a canvas, so a tile server that omits the
     header fails to load for no reason
   - the whole card was a div with onClick, unreachable by keyboard. It is a
     real button now
   - OpenStreetMap data is ODbL: attribution is required wherever tiles show,
     and the upstream component had none
   - a fallback panel when tiles cannot load, instead of pulsing grey forever */

interface LocationMapProps {
  /** Label shown on the toggle row. */
  location: string;
  latitude: number;
  longitude: number;
  /** Integer zoom, 1-18. */
  zoom?: number;
  className?: string;
  tileProvider?: 'openstreetmap' | 'carto-light' | 'carto-dark';
  defaultExpanded?: boolean;
  /** Height of the revealed map, in px. */
  mapHeight?: number;
}

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
}

function getTileUrl(provider: string, x: number, y: number, z: number) {
  switch (provider) {
    case 'carto-light':
      return `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;
    case 'carto-dark':
      return `https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/${z}/${x}/${y}.png`;
    default:
      return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  }
}

function formatCoordinates(lat: number, lng: number) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'O';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

type TileStatus = 'idle' | 'loading' | 'ready' | 'failed';

export function LocationMap({
  location,
  latitude,
  longitude,
  zoom = 15,
  className = '',
  tileProvider = 'carto-light',
  defaultExpanded = false,
  mapHeight = 220,
}: LocationMapProps) {
  const reduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [status, setStatus] = useState<TileStatus>('idle');
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-60, 60], [5, -5]);
  const rotateY = useTransform(mouseX, [-60, 60], [-5, 5]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const coordinates = useMemo(
    () => formatCoordinates(latitude, longitude),
    [latitude, longitude]
  );

  const tiles = useMemo(() => {
    const centre = latLngToTile(latitude, longitude, zoom);
    const out: { url: string; offsetX: number; offsetY: number }[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        out.push({
          url: getTileUrl(tileProvider, centre.x + dx, centre.y + dy, zoom),
          offsetX: dx,
          offsetY: dy,
        });
      }
    }
    return out;
  }, [latitude, longitude, zoom, tileProvider]);

  // Only fetch tiles once the map is actually opened: a listing grid would
  // otherwise pull nine tiles per card on page load.
  useEffect(() => {
    if (!isExpanded || status !== 'idle') return;

    setStatus('loading');
    let cancelled = false;
    let done = 0;
    let ok = 0;

    const settle = (loaded: boolean) => {
      done++;
      if (loaded) ok++;
      if (cancelled || done < tiles.length) return;
      setStatus(ok > 0 ? 'ready' : 'failed');
    };

    tiles.forEach((tile) => {
      const img = new window.Image();
      img.onload = () => settle(true);
      img.onerror = () => settle(false);
      img.src = tile.url;
    });

    return () => {
      cancelled = true;
    };
  }, [isExpanded, status, tiles]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const flatten = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      className={`locmap ${className}`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={flatten}
    >
      <motion.div
        className="locmap__card"
        style={
          reduceMotion
            ? undefined
            : { rotateX: springRotateX, rotateY: springRotateY }
        }
      >
        <button
          type="button"
          className="locmap__toggle"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={() => setIsExpanded((v) => !v)}
        >
          <span className="locmap__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </svg>
          </span>
          <span className="locmap__label">{location}</span>
          <span className="locmap__hint">
            {isExpanded ? 'Masquer' : 'Voir sur la carte'}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              id={panelId}
              className="locmap__panel"
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: mapHeight, opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              {status === 'failed' ? (
                <div className="locmap__fallback">
                  <p>Carte indisponible hors connexion.</p>
                  <p className="locmap__coords">{coordinates}</p>
                </div>
              ) : (
                <>
                  {status === 'ready' && (
                  <div className="locmap__tiles">
                    {tiles.map((tile) => (
                      <img
                        key={tile.url}
                        src={tile.url}
                        alt=""
                        width={256}
                        height={256}
                        loading="lazy"
                        decoding="async"
                        style={{
                          left: `${(tile.offsetX + 1) * 256}px`,
                          top: `${(tile.offsetY + 1) * 256}px`,
                        }}
                      />
                    ))}
                  </div>
                  )}

                  {status !== 'ready' && <div className="locmap__skeleton" />}

                  <span className="locmap__marker" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                        fill="#b3580f"
                      />
                      <circle cx="12" cy="9" r="2.5" fill="#fbfdfe" />
                    </svg>
                  </span>

                  {/* ODbL requires attribution wherever the tiles are shown. */}
                  <span className="locmap__attribution">
                    ©{' '}
                    <a
                      href="https://www.openstreetmap.org/copyright"
                      target="_blank"
                      rel="noreferrer"
                    >
                      OpenStreetMap
                    </a>
                    {tileProvider.startsWith('carto') ? ', © CARTO' : ''}
                  </span>
                </>
              )}

              <span className="locmap__coords locmap__coords--overlay">
                {coordinates}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default LocationMap;
