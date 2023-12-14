import React, { useState, useRef, useEffect } from 'react';
import { MenuItem } from '../../../../shared/data';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Button, TextField, Tooltip } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
interface MenuEditItemProps {
    menuItem: MenuItem;
    viewedMenuItem: MenuItem | null;
    setViewedMenuItem: (item: MenuItem | null) => void;
    draggable?: DraggableProvidedDragHandleProps | null | undefined;
    draggableRef?: (element: HTMLElement | null) => void;
    draggableProps?: DraggableProvidedDraggableProps;
    editMenuItem: (menuItem: MenuItem) => void;
    deleteMenuItem: (menuItem: MenuItem) => void;
    removeItemFromSelectedCategory: (menuItem: MenuItem) => void;
}

const MenuEditItem: React.FC<MenuEditItemProps> = ({ menuItem, setViewedMenuItem, viewedMenuItem,
    draggable, draggableRef, draggableProps,
    editMenuItem, deleteMenuItem, removeItemFromSelectedCategory }) => {

    const handleChange = (item: MenuItem) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            setViewedMenuItem(isExpanded ? item : null);
        };
    const isExpanded = menuItem === viewedMenuItem;
    return (
        <Accordion expanded={isExpanded} onChange={handleChange(menuItem)} ref={draggableRef} {...draggableProps}   >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{
                    position: 'relative',
                }}
                sx={{
                    backgroundColor: 'transparent !important',
                    display: 'flex',
                    flexDirection: 'row',

                }}
                {...draggable}
            >
                <IconButton onClick={(e) => {
                    e.stopPropagation();
                    editMenuItem(menuItem);
                }}>
                    <EditIcon />
                </IconButton>
                {
                    menuItem.categories.length > 1 &&
                    <>
                        <Tooltip title='removes the item from this category'>
                            <IconButton color='error' onClick={(e) => {
                                e.stopPropagation();
                                removeItemFromSelectedCategory(menuItem);
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                }
                <Tooltip title='deletes the item from all categories'>
                    <IconButton color='error' onClick={(e) => {
                        e.stopPropagation();
                        deleteMenuItem(menuItem);
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem variant="middle" />
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: '1',
                    marginRight: '60px',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Typography sx={{ flexShrink: 0, width: '100%', textAlign: 'center' }}>
                        {menuItem.name}{menuItem.foreignName && (
                            <span style={{ fontStyle: 'italic' }}> {menuItem.foreignName}</span>
                        )}
                    </Typography>
                    <Typography sx={{ flexShrink: 0, textAlign: 'right' }}>
                        ${menuItem.price.toFixed(2)}
                    </Typography>
                </div>


            </AccordionSummary>
            <AccordionDetails style={{ textAlign: 'left' }}>
                <Divider />
                {
                    menuItem.description !== '' ?
                        <>
                            <Typography sx={{ width: '100%', flexShrink: 0, textAlign: 'left' }}>
                                {menuItem.description}
                            </Typography>
                        </>
                        :
                        <>
                            <Typography sx={{ width: '100%', flexShrink: 0, textAlign: 'left' }}>
                                No Description
                            </Typography>
                        </>
                }
                {
                    menuItem.foreignDescription !== '' &&
                    <>
                        <Typography sx={{ width: '100%', flexShrink: 0, textAlign: 'left', fontStyle: 'italic' }}>
                            {menuItem.foreignDescription}
                        </Typography>
                    </>
                }

                {
                    menuItem.choices.length > 0 &&
                    <>
                        <Divider />
                        {menuItem.choices.map((choiceGroup) => (
                            <Typography key={choiceGroup.groupName} sx={{ width: '100%', flexShrink: 0, textAlign: 'left' }}>
                                {choiceGroup.groupName}
                                <br />
                                {choiceGroup.choices.join(', ')}
                            </Typography>
                        ))}
                    </>
                }

                {
                    menuItem.ingredients.length > 0 &&
                    <>
                        <Divider />
                        <Typography sx={{ width: '100%', flexShrink: 0, textAlign: 'left' }}>
                            Ingredients<br /> {menuItem.ingredients.join(', ')}
                        </Typography>
                    </>
                }
            </AccordionDetails>
        </Accordion>
    )
}

export default MenuEditItem;