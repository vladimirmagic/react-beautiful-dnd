// @flow
import React, { useState } from 'react';
import { VariableSizeList as List, areEqual } from 'react-window';
import type { Quote } from '../../types';
import {
  Droppable,
  Draggable,
  DragDropContext,
  type DroppableProvided,
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DraggableRubric,
  type DropResult,
} from '../../../../src';
import QuoteItem from '../../primatives/quote-item';
import reorder from '../../reorder';
import type { DroppableStateSnapshot } from '../../../../src';

type Props = {|
  initial: Quote[],
|};

type RowProps = {
  data: Quote[],
  index: number,
  style: Object,
};

const Row = React.memo(({ data: quotes, index, style }: RowProps) => {
  const quote: Quote = quotes[index];
  if (!quote) {
    return null;
  }

  return (
    <Draggable draggableId={quote.id} index={index} key={quote.id}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <QuoteItem
          provided={provided}
          quote={quote}
          isDragging={snapshot.isDragging}
          isGroupedOver={Boolean(snapshot.combineTargetFor)}
          style={{ margin: 0, ...style }}
          index={index}
        />
      )}
    </Draggable>
  );
}, areEqual);

function App(props: Props) {
  const [quotes, setQuotes] = useState(() => props.initial);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    if (result.source.index === result.destination.index) {
      return;
    }

    const newQuotes: Quote[] = reorder(
      quotes,
      result.source.index,
      result.destination.index,
    );
    setQuotes(newQuotes);
  }

  const getItemHeight = (index: number) => {
    return Math.random() > 0.5 ? 150 : 100
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} >
      <Droppable
        droppableId="droppable"
        mode="virtual"
        renderClone={(
          provided: DraggableProvided,
          snapshot: DraggableStateSnapshot,
          rubric: DraggableRubric,
        ) => (
          <QuoteItem
            provided={provided}
            isDragging={snapshot.isDragging}
            quote={quotes[rubric.source.index]}
            style={{ margin: 0 }}
            index={rubric.source.index}
          />
        )}
      >
        {(droppableProvided: DroppableProvided,  snapshot: DroppableStateSnapshot,) => (
          <List
            height={500}
            itemCount={snapshot.isUsingPlaceholder ? quotes.length + 1 : quotes.length}
            itemSize={getItemHeight}
            width={300}
            // you will want to use List.outerRef rather than List.innerRef as it has the correct height when the list is unpopulated
            outerRef={droppableProvided.innerRef}
            itemData={quotes}
            estimatedItemSize={100}
          >
            {Row}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
