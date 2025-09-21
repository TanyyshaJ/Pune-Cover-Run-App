
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Polyline, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Feature, Polygon, MultiPolygon } from 'geojson';

const PUNE_CENTER: LatLngExpression = [18.5204, 73.8567];

interface MapComponentProps {
  puneBoundary: Feature<Polygon>;
  coveragePolygon: Feature<Polygon | MultiPolygon> | null;
  currentPath: [number, number][];
  isDrawing: boolean;
  onMapClick: (latlng: { lat: number, lng: number }) => void;
}

const MapEventsHandler: React.FC<{ isDrawing: boolean, onMapClick: (latlng: { lat: number, lng: number }) => void }> = ({ isDrawing, onMapClick }) => {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ puneBoundary, coveragePolygon, currentPath, isDrawing, onMapClick }) => {
  const geoJsonLayerRef = useRef(null);

  useEffect(() => {
    // Force re-render of GeoJSON layer when data changes
    if (geoJsonLayerRef.current) {
        // @ts-ignore
      geoJsonLayerRef.current.clearLayers().addData(coveragePolygon);
    }
  }, [coveragePolygon]);


  const pathAsLatLng: LatLngExpression[] = currentPath.map(p => [p[0], p[1]]);

  return (
    <MapContainer center={PUNE_CENTER} zoom={12} scrollWheelZoom={true} className={isDrawing ? 'cursor-crosshair' : ''}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON 
        data={puneBoundary} 
        style={{
            color: '#4f46e5',
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.05
        }} 
      />
       {coveragePolygon && (
         <GeoJSON
           key={JSON.stringify(coveragePolygon)} // Simple way to force re-render
           data={coveragePolygon}
           style={{
             color: '#10B981',
             weight: 1,
             fillColor: '#10B981',
             fillOpacity: 0.4,
           }}
         />
       )}
      <Polyline 
        positions={pathAsLatLng} 
        pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8 }} 
      />
      <MapEventsHandler isDrawing={isDrawing} onMapClick={onMapClick} />
    </MapContainer>
  );
};

export default MapComponent;
