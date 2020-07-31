// @flow
import type { Rect, Spacing } from 'css-box-model';
import getDistanceThresholds, {
  type DistanceThresholds,
} from './get-distance-thresholds';
import type { Axis } from '../../../../../types';
import getValue from './get-value';

type GetOnAxisArgs = {|
  container: Rect,
  distanceToEdges: Spacing,
  dragStartTime: number,
  axis: Axis,
  shouldUseTimeDampening: boolean,
  contentBox?: Rect
|};

export default ({
  container,
  distanceToEdges,
  dragStartTime,
  axis,
  shouldUseTimeDampening,
  contentBox
}: GetOnAxisArgs): number => {
  const isCloserToEnd: boolean =
    distanceToEdges[axis.end] < distanceToEdges[axis.start];
  const thresholds: DistanceThresholds = getDistanceThresholds(container, axis, isCloserToEnd, contentBox);

  if (isCloserToEnd) {
    return getValue({
      distanceToEdge: distanceToEdges[axis.end],
      thresholds,
      dragStartTime,
      shouldUseTimeDampening,
    });
  }

  return (
    -1 *
    getValue({
      distanceToEdge: distanceToEdges[axis.start],
      thresholds,
      dragStartTime,
      shouldUseTimeDampening,
    })
  );
};
