import proj4 from 'https://cdn.skypack.dev/proj4';

function getProjection(name: string) {
  if (proj4.defs(name) === undefined ) {
    throw new Error(`Unknown CRS '${name}'`);
  };
  return proj4.defs(name);
}

export function addProjection(name: string, projection: string) {
  proj4.defs(name, projection);
}

export function addProjectionAlias(name: string, target: string) {
  addProjection(name, getProjection(target));
}

addProjection('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs');

function getConverter(crs: string) {  
  return (c: any) => proj4(getProjection(crs)).inverse(c);
}

export function convertToWGS84(data: any) {
  if (data.crs === undefined) return data;

  const converter = getConverter(data.crs.properties.name);

  const convertCoordinates = (coordinate: any[]): any[] => {
    if (!Array.isArray(coordinate)) {
      throw new Error('Not an array');
    }
    if (Array.isArray(coordinate[0])) {
      return coordinate.map(convertCoordinates);
    } 
    return converter(coordinate);
  };

  const convert = (data: any) => {
    const { features, geometry, coordinates } = data;
    if (features) data.features = features.map(convert);
    if (geometry) data.geometry = convert(geometry);
    if (coordinates) data.coordinates = convertCoordinates(coordinates);
    return data;
  };

  delete data.crs;
  return convert(data);
}
