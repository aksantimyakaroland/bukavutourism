'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapMarker {
  longitude: number;
  latitude: number;
  title: string;
  subtitle?: string;
  href?: string;
}

export function MapContainer({
  markers,
  center = [28.8456, -2.5093],
  zoom = 11,
  className = '',
}: {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}) {
  const t = useTranslations('map');
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref.current) return;

    const map = L.map(ref.current, {
      center: [center[1], center[0]],
      zoom,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    tileLayer.on('load', () => setLoading(false));
    setLoading(false);

    const pinIcon = L.divIcon({
      html: '<div style="width:14px;height:14px;background:#D97706;border-radius:50%;border:2px solid #F2EBDC;box-shadow:0 4px 14px rgba(217,119,6,0.5)"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      className: '',
    });

    markers.forEach(m => {
      const popupContent = `
        <div style="min-width:180px;font-family:'Schibsted Grotesk',sans-serif">
          <p style="font-family:'Fraunces',serif;font-size:16px;font-weight:600;margin:0 0 4px;letter-spacing:-0.04em">${m.title}</p>
          ${m.subtitle ? `<p style="font-size:12px;opacity:0.7;margin:0">${m.subtitle}</p>` : ''}
          ${m.href ? `<p style="font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#D97706;margin-top:6px">${t('view')}</p>` : ''}
        </div>
      `;
      L.marker([m.latitude, m.longitude], { icon: pinIcon })
        .addTo(map)
        .bindPopup(popupContent, { offset: [0, -10], closeButton: false });
    });

    return () => { map.remove(); };
  }, [markers, center, zoom, t]);

  return (
    <div className={`relative aspect-[16/9] bg-forest/5 border border-ink/10 ${className}`}>
      <div ref={ref} className="absolute inset-0" style={{ zIndex: 0 }} />
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-paper-bright/70" style={{ zIndex: 1 }}>
          <p className="label-folio">{t('loading')}</p>
        </div>
      )}
      <div className="absolute top-3 left-3 z-10 bg-paper-bright/85 px-2.5 py-1 folio">
        {t('bukavu')}
      </div>
    </div>
  );
}
