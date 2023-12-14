import React, { useState, useEffect } from 'react';
import DraggableList from '../DraggableList/DraggableList';
import { v4 as uuidv4 } from 'uuid';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Button, TextField, IconButton, Grid, Icon, Autocomplete } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { HasNameAndId } from '../../../helper/helperInterfaces';
import { Direction, DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import { cleanString } from '../../../helper/helperFunctions';
interface InputTextEditableListProps {
    items: string[];
    setItems: (items: string[]) => void;
    listTitle: string;
    placeholder?: string;
    draggable?: DraggableProvidedDragHandleProps | null | undefined;
    draggableRef?: (element: HTMLElement | null) => void;
    draggableProps?: DraggableProvidedDraggableProps;
    direction?: Direction;
    isExpanded?: boolean;
    setIsExpanded?: (isExpanded: boolean) => void;
    onDelete?: () => void;
    noItems?: string;
    autoCompleteItems?: string[];
}
const InputTextEditableList: React.FC<InputTextEditableListProps> = ({ items, setItems, listTitle, placeholder,
    draggable, draggableRef, draggableProps, direction, isExpanded, setIsExpanded, onDelete, noItems = `No ${listTitle}`, autoCompleteItems }) => {
    const [newItemName, setNewItemName] = useState<string>('');
    const [pIsExpanded, setPIsExpanded] = useState<boolean>(false);
    const onReorderItems = (orderedItems: HasNameAndId[]) => {
        setItems(orderedItems.map((i) => i.name));
    }

    const getNewItem = (): HasNameAndId => {
        const newItem = {
            id: uuidv4(),
            name: cleanString(newItemName)
        };
        return newItem;
    }
    const localItems = items.map((item) => ({
        id: uuidv4(),
        name: item
    }));
    const canAdd = (): boolean => {
        return newItemName.trim() !== '' && localItems.every((item) => cleanString(item.name) != cleanString(newItemName))
    };

    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        if (setIsExpanded !== undefined) {
            setIsExpanded(isExpanded);
        }
        else {
            setPIsExpanded(isExpanded);
        }
    };

    const createItem = () => {
        setItems([...localItems, getNewItem()].map(i => i.name));
        setNewItemName('');
    }

    const expanded = isExpanded !== undefined ? isExpanded : pIsExpanded;
    return (
        <Accordion expanded={expanded} onChange={handleChange} ref={draggableRef} {...draggableProps}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{
                    position: 'relative',
                }}
                sx={{
                    backgroundColor: 'transparent !important',
                }}
                {...draggable}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant='h6' style={{ width: '70%' }}>
                        {listTitle}
                        {!expanded && (
                            <>
                                <br />
                                {items.length > 0 ? (
                                    <span style={{ fontSize: '0.9rem' }}>{items.join(',')}</span>
                                ) : (
                                    <span style={{ fontSize: '0.9rem' }}>{noItems}</span>
                                )}
                            </>
                        )}
                    </Typography>
                    {onDelete && (
                        <IconButton onClick={onDelete} color='error' size='medium'>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </div>

            </AccordionSummary>
            <AccordionDetails >
                <DraggableList<HasNameAndId>
                    items={localItems}
                    onReorderItems={onReorderItems}
                    direction={direction}
                    getDraggable={(item, index, provided) => (
                        <div ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            <Chip label={item.name} variant="outlined" onDelete={() => setItems(localItems.filter((i) => i.id !== item.id).map((i) => i.name))} />
                        </div>
                    )}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', marginTop: '10px' }}>
                    {
                        autoCompleteItems ?
                            <Autocomplete
                                freeSolo
                                options={autoCompleteItems}
                                style={{ textAlign: 'center', width: '200px' }}
                                onChange={(e, newValue) => {
                                    if (newValue)
                                        setNewItemName(newValue);
                                }}
                                value={newItemName}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && canAdd())
                                        createItem();
                                }}
                                renderInput={(params) => <TextField {...params}
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    type='text' variant='standard' placeholder={placeholder} />}
                            />
                            :
                            <TextField
                                type='text'
                                variant='standard'
                                value={newItemName}
                                placeholder={placeholder}
                                style={{ textAlign: 'center' }}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && canAdd())
                                        createItem();
                                }}
                            />
                    }

                    <IconButton onClick={createItem}
                        disabled={!canAdd()}
                        color='success'>
                        <AddIcon />
                    </IconButton>
                </div>

            </AccordionDetails>
        </Accordion>
    );
}

export default InputTextEditableList;