
import { Feature, LineString, Polygon, MultiPolygon } from 'geojson';

export interface Run {
  id: string;
  startTime: string;
  distance: number; // in kilometers
  newAreaAdded: number; // in square kilometers
  newCoveragePercent: number;
  path: [number, number][];
  bufferedPolygon: Feature<Polygon>;
}

export interface Coverage {
  polygon: Feature<Polygon | MultiPolygon> | null;
  area: number; // in square kilometers
  percentage: number;
}
