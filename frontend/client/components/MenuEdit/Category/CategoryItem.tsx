import React, { useState, useRef, useEffect } from 'react';
import { Category } from '../../../../shared/data';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Button, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';

interface CategoryItemProps {
    category: Category;
    viewedCategory: Category | null;
    setViewedCategory: (category: Category | null) => void;
    draggable?: DraggableProvidedDragHandleProps | null | undefined;
    draggableRef?: (element: HTMLElement | null) => void;
    draggableProps?: DraggableProvidedDraggableProps;
    error?: string | null;
    onUpdate: (prevCateory: Category, newName: string) => void;
    onDelete: (category: Category) => void;
    selectCategory: (category: Category) => void;
    isSelected: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, setViewedCategory, viewedCategory,
    draggable, draggableRef, draggableProps, error, onUpdate, onDelete, selectCategory, isSelected }) => {

    const [editCategoryName, setEditCategoryName] = useState<string>(category.name);

    const isExpanded = category === viewedCategory;

    const handleChange = (category: Category) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            if (isExpanded) {
                setEditCategoryName(category.name);
                // reset name
            }
            setViewedCategory(isExpanded ? category : null);
        };
    return (
        <Accordion expanded={isExpanded} onChange={handleChange(category)} ref={draggableRef} {...draggableProps}  >
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
                <IconButton onClick={(e) => e.stopPropagation()}>
                    <DragIndicatorIcon></DragIndicatorIcon>
                </IconButton>

                {
                    isExpanded ?
                        <>
                            <TextField
                                inputProps={{ min: 0, style: { textAlign: 'center', outline: 'none', } }}
                                sx={{
                                    width: '80%',
                                    flexShrink: 0
                                }}
                                variant='standard'
                                type='text'
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                autoFocus
                                error={error !== null}
                                helperText={error}
                                onClick={(e) => { e.stopPropagation(); }}
                            />
                        </>
                        :
                        <>
                            <Button variant={isSelected ? 'outlined' : 'text'} sx={{ width: '80%', flexShrink: 0 }}
                                onClick={(e) => { e.stopPropagation(); selectCategory(category); }}

                                color={isSelected ? 'success' : 'primary'}>
                                {category.name}
                            </Button>
                        </>
                }
            </AccordionSummary>
            <AccordionDetails style={{ textAlign: 'center' }}>

                <Button color='secondary' onClick={() => onUpdate(category, editCategoryName)} disabled={category.name === editCategoryName || editCategoryName.trim() === ''}>
                    <EditIcon /> Update
                </Button>
                <Button color='error' onClick={() => onDelete(category)}>
                    <DeleteIcon /> Delete
                </Button>
            </AccordionDetails>
        </Accordion>
    )
}

export default CategoryItem;