
import { Feature, Polygon } from 'geojson';

// Simplified Pune administrative boundary for performance.
export const puneBoundary: Feature<Polygon> = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [73.74, 18.63],
        [73.96, 18.63],
        [73.96, 18.43],
        [73.74, 18.43],
        [73.74, 18.63]
      ]
    ]
  }
};
