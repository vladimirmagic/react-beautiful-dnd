// @flow
import type { Rect } from 'css-box-model';
import config from '../../config';
import type { Axis } from '../../../../../types';

// all in pixels
export type DistanceThresholds = {|
  startScrollingFrom: number,
  maxScrollValueAt: number,
|};

// converts the percentages in the config into actual pixel values
export default (container: Rect, axis: Axis, isCloserToEnd: boolean, contentBox: Rect): DistanceThresholds => {
  let startScrollingFrom: number =
    container[axis.size] * config.startFromPercentage;
  let maxScrollValueAt: number =
    container[axis.size] * config.maxScrollAtPercentage;

  if (axis.direction === 'horizontal' && contentBox) {
    const center = contentBox.width / 2;
    if (isCloserToEnd) { // справа
      maxScrollValueAt = config.startRightFromPixels - config.overlapPixels;
      startScrollingFrom = center + maxScrollValueAt;
    } else { // слева
      maxScrollValueAt = config.startLeftFromPixels - config.overlapPixels;
      startScrollingFrom = center + maxScrollValueAt;
    }
  }

  const thresholds: DistanceThresholds = {
    startScrollingFrom,
    maxScrollValueAt,
  };

  return thresholds;
};
