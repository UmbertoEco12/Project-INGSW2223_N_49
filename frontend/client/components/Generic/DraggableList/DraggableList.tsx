import React, { ReactNode } from 'react';
import { DragDropContext, Direction, Droppable, Draggable, DropResult, DragStart, ResponderProvided, OnDragStartResponder, DraggableProvided, DraggableStateSnapshot, OnDragEndResponder } from 'react-beautiful-dnd';
import StrictModeDroppable from '../../../helper/StrictModeDroppable';
import { HasId } from '../../../helper/helperInterfaces';

export interface DraggableListProps<T extends HasId> {
    items: T[];
    onReorderItems: (reorderedItems: T[]) => void;
    getDraggable: (item: T, index: number, provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
    onDragEnd?: OnDragEndResponder;
    onDragStart?: OnDragStartResponder;
    direction?: Direction;
}

const DraggableList = <T extends HasId>({
    items,
    onReorderItems,
    getDraggable,
    onDragStart = () => { },
    onDragEnd = () => { },
    direction = 'vertical'
}: DraggableListProps<T>) => {

    const reorder = (result: DropResult) => {
        if (!result.destination || result.source.index === result.destination.index) {
            return; // Dragged outside of the droppable area or no change in order
        }
        // reorder the list
        const reorderedItems = Array.from(items);
        const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, reorderedItem);
        // reorder items callback
        onReorderItems(reorderedItems);
    }

    return (
        <DragDropContext onDragEnd={(result, provided) => { onDragEnd(result, provided); reorder(result) }} onDragStart={onDragStart}>
            <StrictModeDroppable droppableId={'list-droppable'} direction={direction}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={direction === 'horizontal' ? { display: 'flex', flexWrap: 'wrap', padding: '8px' } : {}}
                    >
                        {items.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <>
                                        {
                                            getDraggable(item, index, provided, snapshot)
                                        }
                                    </>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </StrictModeDroppable>
        </DragDropContext>
    );
}

export default DraggableList;