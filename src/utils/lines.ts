import { Coordinates } from '../gcodeTypes';
export const mapCoordinates = (
  coordinates: Coordinates,
  spacer: string,
  offsetMode = false
) => {
  const points = [];
  if ('x' in coordinates) {
    points.push(`${offsetMode ? 'I' : 'X'}${coordinates.x}`);
  }
  if ('y' in coordinates) {
    points.push(`${offsetMode ? 'J' : 'Y'}${coordinates.y}`);
  }
  if ('z' in coordinates) {
    points.push(`${offsetMode ? 'K' : 'Z'}${coordinates.z}`);
  }
  return points.join(spacer);
};
