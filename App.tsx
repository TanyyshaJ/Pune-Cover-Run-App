
import React, { useState, useCallback } from 'react';
import * as turf from '@turf/turf';
import { Feature, Polygon, MultiPolygon, LineString } from 'geojson';
import MapComponent from './components/MapComponent';
import ControlPanel from './components/ControlPanel';
import OnboardingModal from './components/OnboardingModal';
import { puneBoundary } from './data/puneBoundary';
import { Run, Coverage } from './types';

const PUNE_AREA_M2 = turf.area(puneBoundary);

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [coverage, setCoverage] = useState<Coverage>({
    polygon: null,
    area: 0,
    percentage: 0,
  });
  const [bufferRadius, setBufferRadius] = useState(15); // in meters

  const handleStartDrawing = () => {
    if (runs.length >= 10) {
        alert("Demo limit of 10 runs reached. Please reset data to draw more.");
        return;
    }
    setCurrentPath([]);
    setIsDrawing(true);
  };

  const handleMapClick = useCallback((latlng: { lat: number; lng: number }) => {
    if (isDrawing) {
      setCurrentPath(prevPath => [...prevPath, [latlng.lat, latlng.lng]]);
    }
  }, [isDrawing]);

  const handleSaveRun = () => {
    if (currentPath.length < 2) {
      alert("Please draw a path with at least two points.");
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    // 1. Create GeoJSON LineString from the drawn path
    const runLineString: Feature<LineString> = turf.lineString(currentPath.map(p => [p[1], p[0]]), { name: 'run' });

    // 2. Buffer the line to create a polygon
    const bufferedRun = turf.buffer(runLineString, bufferRadius, { units: 'meters' });

    // 3. Union the new buffer with previous coverage
    let newCoverageUnion: Feature<Polygon | MultiPolygon>;
    if (coverage.polygon) {
      // @ts-ignore Turf's union types can be complex, but this works
      newCoverageUnion = turf.union(coverage.polygon, bufferedRun);
    } else {
      newCoverageUnion = bufferedRun;
    }

    // 4. Clip the result to the Pune boundary
    const clippedCoverage = turf.intersect(newCoverageUnion, puneBoundary);

    if (!clippedCoverage) {
      // This can happen if the entire run is outside Pune
      alert("Run is outside Pune boundaries, not saved.");
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    // 5. Calculate areas and percentages
    const newCoverageAreaM2 = turf.area(clippedCoverage);
    const oldCoverageAreaM2 = coverage.area * 1_000_000;
    const newAreaAddedM2 = newCoverageAreaM2 - oldCoverageAreaM2;

    const newCoverageKm2 = newCoverageAreaM2 / 1_000_000;
    const newAreaAddedKm2 = newAreaAddedM2 / 1_000_000;
    
    const newCoveragePercent = (newCoverageAreaM2 / PUNE_AREA_M2) * 100;
    const oldCoveragePercent = coverage.percentage;
    const percentIncrease = newCoveragePercent - oldCoveragePercent;

    // 6. Create new Run object
    const newRun: Run = {
      id: new Date().toISOString(),
      startTime: new Date().toISOString(),
      distance: turf.length(runLineString, { units: 'kilometers' }),
      newAreaAdded: newAreaAddedKm2,
      newCoveragePercent: percentIncrease,
      path: currentPath,
      bufferedPolygon: bufferedRun,
    };

    // 7. Update state
    setRuns(prevRuns => [...prevRuns, newRun]);
    setCoverage({
      polygon: clippedCoverage,
      area: newCoverageKm2,
      percentage: newCoveragePercent,
    });

    // 8. Reset drawing state
    setIsDrawing(false);
    setCurrentPath([]);
  };
  
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your runs and coverage data?")) {
        setRuns([]);
        setCoverage({ polygon: null, area: 0, percentage: 0 });
        setCurrentPath([]);
        setIsDrawing(false);
    }
  };


  return (
    <div className="relative h-screen w-screen bg-gray-800">
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      <ControlPanel
        isDrawing={isDrawing}
        bufferRadius={bufferRadius}
        coverage={coverage}
        lastRun={runs.length > 0 ? runs[runs.length - 1] : null}
        runs={runs}
        onStart={handleStartDrawing}
        onSave={handleSaveRun}
        onReset={handleReset}
        onBufferChange={(e) => setBufferRadius(parseInt(e.target.value, 10))}
      />
      <div className="ml-96 h-full">
        <MapComponent
          puneBoundary={puneBoundary}
          coveragePolygon={coverage.polygon}
          currentPath={currentPath}
          isDrawing={isDrawing}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
};

export default App;
