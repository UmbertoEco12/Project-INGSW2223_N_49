import React, { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, TextField, Divider, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { MenuItem } from '../../../../shared/data';
import { OrderItemCreation } from '../../../../shared/userRequests';
import DropdownChoice from '../../Generic/DropdownChoice/DropdownChoice';
import { OrderStatus } from '../../../../shared/data';
import CustomRadioGroup from '../../Generic/CustomRadioGroup/CustomRadioGroup';
import StringSelector from '../../Generic/StringSelector/StringSelector';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface OrderedItemCreateViewProps {
    creationItem: OrderItemCreation;
    menuItem: MenuItem;
    onRemoveClick: (item: OrderItemCreation) => void;
    setCreationItem: (item: OrderItemCreation) => void;
    onMoveDown?: (item: OrderItemCreation) => void;
    onMoveUp?: (item: OrderItemCreation) => void;
}

const OrderedItemCreateView: React.FC<OrderedItemCreateViewProps> = ({ creationItem, onRemoveClick, menuItem, setCreationItem, onMoveUp, onMoveDown }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setIsExpanded(isExpanded);
    };
    return (
        <Accordion expanded={isExpanded} onChange={handleChange} sx={{
            mb: '3px'
        }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{
                    position: 'relative',
                }}
                sx={{
                    backgroundColor: 'transparent !important'
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <IconButton color='error' onClick={(e) => {
                            e.stopPropagation();
                            onRemoveClick(creationItem);
                        }} >
                            <CloseIcon />
                        </IconButton>
                        <Divider orientation="vertical" flexItem variant="middle" sx={{
                            mr: '10px',
                            ml: '10px'
                        }} />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography align='center'>
                            {menuItem.name}
                        </Typography>
                    </Grid>
                    {
                        onMoveUp &&
                        <Grid item xs={1}>
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                onMoveUp(creationItem);
                            }} >
                                <ArrowUpwardIcon />
                            </IconButton>
                        </Grid>

                    }
                    {
                        onMoveDown &&
                        <Grid item xs={1}>
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                onMoveDown(creationItem);
                            }} >
                                <ArrowDownwardIcon />
                            </IconButton>
                        </Grid>

                    }
                </Grid>


            </AccordionSummary>
            <AccordionDetails style={{ textAlign: 'left' }}>
                {/* Status */}
                <>
                    {
                        menuItem.readyToServe ?
                            <>
                                <Typography textAlign={'left'}>Status: {creationItem.status}</Typography>
                            </>
                            :
                            <>
                                <DropdownChoice
                                    choices={[OrderStatus.ToPrepare, OrderStatus.Waiting]}
                                    value={creationItem.status}
                                    label={'Status'}
                                    onChange={(status) => setCreationItem({ ...creationItem, status: status })}
                                />
                                <br />
                            </>
                    }
                </>

                {/* Choices */}
                {
                    menuItem.choices.map((group, index) => (
                        <div key={index}>
                            <CustomRadioGroup row title={group.groupName} value={creationItem.preparationChoices[index]} values={group.choices} onChange={(newVal) => {
                                const newChoices = creationItem.preparationChoices;
                                //update value
                                newChoices[index] = (newVal);
                                setCreationItem({ ...creationItem, preparationChoices: newChoices });
                            }} />
                            <br />
                        </div>
                    ))
                }
                {/* Changes */}
                <StringSelector
                    label="Changes"
                    allStrings={menuItem.customChanges} selectedStrings={creationItem.customChanges}
                    onSelect={(selected) => setCreationItem({ ...creationItem, customChanges: selected })} style={{
                        marginBottom: '10px'
                    }} />
                {/* Ingredients Removed */}
                <StringSelector
                    label="Removed ingredients"
                    allStrings={menuItem.ingredients} selectedStrings={creationItem.ingredientsRemoved}
                    onSelect={(selected) => setCreationItem({ ...creationItem, ingredientsRemoved: selected })} style={{
                        marginBottom: '10px'
                    }} />
                {/* Notes */}
                <TextField
                    variant='standard'
                    type='text'
                    label='Notes'
                    multiline
                    maxRows={6}
                    onChange={(e) => {
                        setCreationItem({
                            ...creationItem,
                            notes: e.target.value
                        })
                    }}
                    value={creationItem.notes}
                    fullWidth
                />
            </AccordionDetails>
        </Accordion>
    )
}

export default OrderedItemCreateView;