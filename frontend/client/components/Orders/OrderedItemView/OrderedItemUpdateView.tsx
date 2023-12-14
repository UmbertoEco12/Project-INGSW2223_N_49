import React, { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, TextField, Divider, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MenuItem, OrderItem } from '../../../../shared/data';
import DropdownChoice from '../../Generic/DropdownChoice/DropdownChoice';
import { OrderStatus } from '../../../../shared/data';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BlockIcon from '@mui/icons-material/Block';
import UndoIcon from '@mui/icons-material/Undo';
import { getOrderStatusColor } from '../../../helper/themeManager';
import OrderedItemToServeView from './OrderedItemToServeView';
import OrderItemChoices from '../OrderItemChoices/OrderItemChoices';

interface OrderedItemUpdateViewProps {
    item: OrderItem;
    menuItem: MenuItem;
    setStatus: (status: string) => void;
    onCancelClick: (canceled: boolean) => void;
    startingNotes: string; // not editable
    setNotes: (newNotes: string) => void;
    onMoveDown?: (item: OrderItem) => void;
    onMoveUp?: (item: OrderItem) => void;
}

const OrderedItemUpdateView: React.FC<OrderedItemUpdateViewProps> = ({ item, menuItem, onCancelClick, setStatus, startingNotes, setNotes, onMoveUp, onMoveDown }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setIsExpanded(isExpanded);
    };
    return (
        <>
            {
                [OrderStatus.Served, OrderStatus.ToServe].includes(item.status as OrderStatus) ?
                    <>
                        <OrderedItemToServeView itemStatus={item.status as OrderStatus} item={item} menuItem={menuItem} setStatus={setStatus} />
                    </>
                    :
                    <>
                        {
                            item.isCanceled ?
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>

                                        <IconButton color={item.isCanceled ? 'success' : 'error'} onClick={(e) => {
                                            e.stopPropagation();
                                            onCancelClick(!item.isCanceled);
                                        }} >
                                            {
                                                item.isCanceled ?
                                                    <UndoIcon />
                                                    :
                                                    <BlockIcon />
                                            }

                                        </IconButton>
                                        <Divider orientation="vertical" flexItem variant="middle" sx={{
                                            mr: '10px',
                                            ml: '10px'
                                        }} />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography align='left' color={'red'} sx={{
                                            textDecoration: 'line-through'
                                        }}>
                                            {menuItem.name}
                                        </Typography>
                                    </Grid>

                                </Grid>
                                :
                                <>
                                    <Accordion expanded={isExpanded} onChange={handleChange} sx={{
                                        mb: '3px',
                                        backgroundColor: item.isCanceled ? '#EB5E28' : 'white'
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

                                                    <IconButton color={item.isCanceled ? 'success' : 'error'} onClick={(e) => {
                                                        e.stopPropagation();
                                                        onCancelClick(!item.isCanceled);
                                                    }} >
                                                        {
                                                            item.isCanceled ?
                                                                <UndoIcon />
                                                                :
                                                                <BlockIcon />
                                                        }

                                                    </IconButton>
                                                    <Divider orientation="vertical" flexItem variant="middle" sx={{
                                                        mr: '10px',
                                                        ml: '10px'
                                                    }} />
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography align='center' color={getOrderStatusColor(item.status as OrderStatus)}>
                                                        {menuItem.name}
                                                    </Typography>
                                                </Grid>
                                                {
                                                    onMoveUp &&
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={(e) => {
                                                            e.stopPropagation();
                                                            onMoveUp(item);
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
                                                            onMoveDown(item);
                                                        }} >
                                                            <ArrowDownwardIcon />
                                                        </IconButton>
                                                    </Grid>

                                                }
                                                <Grid item xs={12}>
                                                    <OrderItemChoices item={item} />
                                                </Grid>
                                            </Grid>


                                        </AccordionSummary>
                                        <AccordionDetails style={{ textAlign: 'left' }}>
                                            {/* Status */}
                                            <>
                                                {
                                                    ![OrderStatus.ToPrepare, OrderStatus.Waiting].includes(item.status as OrderStatus) ?
                                                        <>
                                                            <Typography textAlign={'left'}>Status: {item.status}</Typography>
                                                        </>
                                                        :
                                                        <>
                                                            <DropdownChoice
                                                                choices={[OrderStatus.ToPrepare, OrderStatus.Waiting]}
                                                                value={item.status}
                                                                label={'Status'}
                                                                onChange={(status) => setStatus(status)}
                                                            />
                                                            <br />
                                                        </>
                                                }
                                            </>

                                            {/* Notes */}
                                            <Typography gutterBottom align='left'>
                                                Notes
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom align='left'>
                                                {startingNotes}
                                            </Typography>
                                            <TextField
                                                variant='standard'
                                                type='text'
                                                multiline
                                                maxRows={6}
                                                onChange={(e) => {
                                                    setNotes(e.target.value)
                                                }}
                                                value={item.notes.substring(startingNotes.length)}
                                                fullWidth
                                            />
                                        </AccordionDetails>
                                    </Accordion>
                                </>
                        }
                    </>
            }
        </>

    )
}

export default OrderedItemUpdateView;