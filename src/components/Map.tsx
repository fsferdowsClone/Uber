import * as React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  routePoints?: {
    pickup: [number, number] | null;
    destination: [number, number] | null;
  };
  tripStage?: 'pickup' | 'destination';
}

export function Map({ center = [90.4125, 23.8103], zoom = 12, className, routePoints, tripStage = 'pickup' }: MapProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<maplibregl.Map | null>(null);
  const pickupMarker = React.useRef<maplibregl.Marker | null>(null);
  const destinationMarker = React.useRef<maplibregl.Marker | null>(null);
  const userLocationMarker = React.useRef<maplibregl.Marker | null>(null);

  React.useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: center,
      zoom: zoom,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true
      }),
      'top-right'
    );

    const handleResize = () => {
      map.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.current?.remove();
      map.current = null;
    };
  }, []); // Only on mount

  const driverMarker = React.useRef<maplibregl.Marker | null>(null);

  // Handle Route Drawing
  React.useEffect(() => {
    if (!map.current) return;

    const drawRoute = async () => {
      if (routePoints?.pickup && routePoints?.destination) {
        const pickup = routePoints.pickup;
        const destination = routePoints.destination;

        // Current start and end for the CAR animation
        const carStart: [number, number] = tripStage === 'pickup' 
          ? [pickup[0] - 0.05, pickup[1] - 0.05] // Start slightly away for pickup
          : pickup;
        
        const carEnd: [number, number] = tripStage === 'pickup'
          ? pickup
          : destination;

        // Clear existing
        pickupMarker.current?.remove();
        destinationMarker.current?.remove();
        driverMarker.current?.remove();

        // Add Premium Markers
        const pickupEl = document.createElement('div');
        pickupEl.className = 'w-6 h-6 bg-black border-4 border-white rounded-full shadow-xl pulse-black';
        pickupMarker.current = new maplibregl.Marker(pickupEl).setLngLat(pickup).addTo(map.current!);

        const destEl = document.createElement('div');
        destEl.className = 'w-6 h-6 bg-black flex items-center justify-center rounded-sm shadow-xl border border-white/20';
        destEl.innerHTML = '<div class="w-2 h-2 bg-white"></div>';
        destinationMarker.current = new maplibregl.Marker(destEl).setLngLat(destination).addTo(map.current!);

        // Simulated Driver (Car)
        const carEl = document.createElement('div');
        carEl.className = 'w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-2xl border border-white/20 transition-all z-50';
        carEl.innerHTML = '<svg viewBox="0 0 24 24" class="w-5 h-5 text-white fill-current"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>';
        
        driverMarker.current = new maplibregl.Marker(carEl).setLngLat(carStart).addTo(map.current!);

        // Animate Driver
        if (driverMarker.current) {
          const duration = 10000; // 10s
          const startTime = Date.now();
          
          const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentLng = carStart[0] + (carEnd[0] - carStart[0]) * progress;
            const currentLat = carStart[1] + (carEnd[1] - carStart[1]) * progress;
            
            driverMarker.current?.setLngLat([currentLng, currentLat]);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }

        // Draw Route Line
        const geojson: any = {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [pickup, destination]
          }
        };

        if (map.current.getSource('route')) {
          (map.current.getSource('route') as maplibregl.GeoJSONSource).setData(geojson);
        } else {
          map.current.addSource('route', { 'type': 'geojson', 'data': geojson });
          map.current.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': { 'line-join': 'round', 'line-cap': 'round' },
            'paint': {
              'line-color': '#000000',
              'line-width': 5,
              'line-blur': 1,
            }
          });
        }

        const bounds = new maplibregl.LngLatBounds().extend(pickup).extend(destination);
        map.current.fitBounds(bounds, { padding: 100, duration: 2000 });
      } else {
        // Clear route if points are gone
        if (map.current.getLayer('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }
        pickupMarker.current?.remove();
        destinationMarker.current?.remove();
        driverMarker.current?.remove();
      }
    };

    if (map.current.loaded()) {
      drawRoute();
    } else {
      map.current.on('load', drawRoute);
    }
  }, [routePoints, tripStage]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map Overlay Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-40" />

      <style>{`
        .pulse-black { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
        }
      `}</style>
    </div>
  );
}
