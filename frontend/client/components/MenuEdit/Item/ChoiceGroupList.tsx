import React, { useState, useEffect } from 'react';
import DraggableList from '../../Generic/DraggableList/DraggableList';
import { v4 as uuidv4 } from 'uuid';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Button, TextField, IconButton, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { HasNameAndId } from '../../../helper/helperInterfaces';
import { ItemChoiceGroup } from '../../../../shared/userRequests';
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import InputTextEditableList from '../../Generic/InputTextEditableList/InputTextEditableList';
import CategoryItem from '../Category/CategoryItem';
import { MenuItem } from '../../../../shared/data';
import { cleanString } from '../../../helper/helperFunctions';

interface ChoiceGroupListProps {
    items: ItemChoiceGroup[];
    setMenuItemForm: React.Dispatch<React.SetStateAction<MenuItem>>;

}
const ChoiceGroupList: React.FC<ChoiceGroupListProps> = ({ items, setMenuItemForm }) => {
    const [newItemName, setNewItemName] = useState<string>('');

    const onReorderGroups = (orderedItems: HasNameAndId[]) => {
        // Create a mapping of name to its corresponding item
        const nameToItemMap: Record<string, { groupName: string, choices: string[] }> = {};
        items.forEach((item) => {
            nameToItemMap[item.groupName] = item;
        });

        // Sort the items array based on the order of orderedItems
        const sortedItems = orderedItems.map(({ name }) => nameToItemMap[name]);

        setMenuItemForm(prev => ({
            ...prev,
            choices: sortedItems
        }));
    };
    const canAdd = (newItemName.trim() !== '' && items.every((item) => cleanString(item.groupName) != cleanString(newItemName)));

    const createItem = () => {
        setNewItemName('');
        setMenuItemForm(prev => ({
            ...prev,
            choices: [...prev.choices, { groupName: cleanString(newItemName), choices: [] }]
        }));
    }

    return (
        <>
            <Grid item xs={12}>
                <Typography variant='h6' width={'100%'}>
                    Custom Choices
                </Typography>

                <DraggableList<HasNameAndId>
                    items={items.map((it) => ({ id: it.groupName, name: it.groupName }))}
                    onReorderItems={onReorderGroups}
                    getDraggable={(item, index, provided) => (
                        <InputTextEditableList
                            listTitle={item.name}
                            items={items.find((it) => it.groupName === item.name)?.choices as string[]}
                            setItems={(newChoices) => {
                                setMenuItemForm(prev => ({
                                    ...prev,
                                    choices: prev.choices.map((it) => {
                                        if (it.groupName === item.name) {
                                            const newGroup = it;
                                            it.choices = newChoices;
                                            return newGroup;
                                        }
                                        else
                                            return it;
                                    })
                                }))
                            }}
                            placeholder='New choice'
                            direction='horizontal'
                            onDelete={() => {
                                setMenuItemForm(prev => ({
                                    ...prev,
                                    choices: prev.choices.filter((it) => it.groupName !== item.name)
                                }))
                            }}
                            draggable={provided.dragHandleProps}
                            draggableProps={provided.draggableProps}
                            draggableRef={provided.innerRef}
                            noItems='No choices'
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', marginTop: '10px' }}>
                    <TextField
                        type='text'
                        variant='standard'
                        value={newItemName}
                        placeholder='New choice group'
                        style={{ textAlign: 'center' }}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && canAdd) {
                                createItem();
                            }
                        }}
                    />
                    <IconButton onClick={createItem}
                        disabled={!canAdd}
                        color='success'>
                        <AddIcon />
                    </IconButton>
                </div>
            </Grid>
        </>
    );
}

export default ChoiceGroupList;