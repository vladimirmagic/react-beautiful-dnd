// @flow
import { type Position, type BoxModel } from 'css-box-model';
import { invariant } from '../../invariant';
import type { DroppableDimension, DroppableSubject, Scrollable } from '../../types';
import { negate, subtract } from '../position';
import getSubject from './util/get-subject';

const updateSizes = (
  result: DroppableDimension,
  diff: number,
  isHeight: boolean = true
) => {
  if (!diff) return;
  const boxKeys = ['marginBox', 'borderBox', 'paddingBox', 'contentBox'];
  ['client', 'page'].forEach(key => {
    boxKeys.forEach(boxKey => {
      result[key][boxKey][isHeight ? 'bottom' : 'right'] += diff;
      result[key][boxKey][isHeight ? 'height' : 'width'] += diff;
      result[key][boxKey].center[isHeight ? 'y' : 'x'] += diff / 2;
    })
  })
  boxKeys.forEach(boxKey => {
    result.subject.page[boxKey][isHeight ? 'bottom' : 'right'] += diff;
    result.subject.page[boxKey][isHeight ? 'height' : 'width'] += diff;
    result.subject.page[boxKey].center[isHeight ? 'y' : 'x'] += diff / 2;
  })
  result.frame.scrollSize[isHeight ? 'scrollHeight' : 'scrollWidth'] += diff;
  result.frame.scroll.max[isHeight ? 'y' : 'x'] += diff;
}

export default (
  droppable: DroppableDimension,
  newScroll: Position,
  newClient?: BoxModel
): DroppableDimension => {
  invariant(droppable.frame);
  const scrollable: Scrollable = droppable.frame;

  const scrollDiff: Position = subtract(newScroll, scrollable.scroll.initial);
  // a positive scroll difference leads to a negative displacement
  // (scrolling down pulls an item upwards)
  const scrollDisplacement: Position = negate(scrollDiff);

  // Sometimes it is possible to scroll beyond the max point.
  // This can occur when scrolling a foreign list that now has a placeholder.

  const frame: Scrollable = {
    ...scrollable,
    scroll: {
      initial: scrollable.scroll.initial,
      current: newScroll,
      diff: {
        value: scrollDiff,
        displacement: scrollDisplacement,
      },
      // TODO: rename 'softMax?'
      max: scrollable.scroll.max,
    },
  };

  const subject: DroppableSubject = getSubject({
    page: droppable.subject.page,
    withPlaceholder: droppable.subject.withPlaceholder,
    axis: droppable.axis,
    frame,
  });
  const result: DroppableDimension = {
    ...droppable,
    frame,
    subject,
  };

  if (newClient) {
      updateSizes(result, newClient.marginBox.height - droppable.client.marginBox.height)
      updateSizes(result, newClient.marginBox.width - droppable.client.marginBox.width, false)
  }


  return result;
};
