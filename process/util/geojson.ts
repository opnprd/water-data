import { readJSON, writeJSON } from 'https://deno.land/x/flat/mod.ts'

type BBox = {
  lonExtents: number[],
  latExtents: number[],
}

export function cropToBbox(data: any, bbox: BBox) {
  if (data.type != "FeatureCollection") throw new Error('Data must be a FeatureCollection');

  const inBbox = ([lon, lat]: number[]) => {
    return (lat > Math.min(...bbox.latExtents)) &&
      (lat < Math.max(...bbox.latExtents)) &&
      (lon > Math.min(...bbox.lonExtents)) &&
      (lon < Math.max(...bbox.lonExtents));
  }

  const anyTrue = (x: Boolean) => x;

  const lineCrossesBbox = (points: number[][]) => {
    return points.map(inBbox).some(anyTrue)
  }

  const filterGeoJSON = (f: any) => {
    if (f.geometry.type === 'Point') return inBbox(f.geometry.coordinates);
    if (f.geometry.type === 'LineString') return lineCrossesBbox(f.geometry.coordinates);
    if (f.geometry.type === 'MultiLineString') {
      return f.geometry.coordinates.map(lineCrossesBbox).some(anyTrue);
    }
    console.log(f.geometry.type);
    return false;
  }
  return {
    ...data,
    features: data.features.filter(filterGeoJSON)
  };
}

