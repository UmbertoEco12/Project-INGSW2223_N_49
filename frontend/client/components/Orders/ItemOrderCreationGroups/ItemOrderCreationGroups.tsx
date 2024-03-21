import React, { ReactNode, useState } from 'react';
import { OrderItemCreation } from '../../../../shared/userRequests';
import Paper from '@mui/material/Paper';
import { Fab, Typography, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

interface ItemOrderCreationGroupsProps {
    items: OrderItemCreation[];
    onAddToGroup: (id: number) => void;
    skipItem?: (item: OrderItemCreation, index: number) => boolean;
    getItemWithIndex: (index: number, groupId: number, nextId: number, prevId: number, canMoveUp: boolean, canMoveDown: boolean) => ReactNode;
}

interface GroupItem extends OrderItemCreation {
    index: number;
}

const ItemOrderCreationGroups: React.FC<ItemOrderCreationGroupsProps> = ({ items, onAddToGroup, getItemWithIndex, skipItem }) => {
    const groups: number[] = Array.from(new Set(items.map((item) => item.orderGroupId))).sort();
    let maxId: number = 1;
    groups.forEach((id) => {
        if (id >= maxId)
            maxId = id + 1;
    })
    const groupedItems: { [key: number]: GroupItem[] } = groups.reduce((acc: any, group) => {
        const groupItems: GroupItem[] = items
            .map((item, index) => (item.orderGroupId === group ? { ...item, index } : null))
            .filter((item): item is GroupItem => item !== null);
        acc[group] = groupItems;
        return acc;
    }, {});

    function getNext(index: number) {
        if (index < groups.length - 1) {
            return groups[index + 1];
        }
        else {
            return maxId;
        }
    }
    function getPrev(index: number) {
        if (index > 0) {
            return groups[index - 1];
        }
        else
            return groups[index];
    }

    return (
        <Paper elevation={0}>
            {groups.map((group, index) => (
                <Paper sx={{ padding: '10px', mb: '5px' }} key={group} elevation={0}>
                    {/* <Typography width={'100%'}>
                        {index + 1}
                    </Typography> */}
                    {
                        groupedItems[group].map((groupItem, itemIndex) => (
                            <div key={groupItem.index}>
                                {
                                    !(skipItem ? skipItem(items[groupItem.index], groupItem.index) : false) &&
                                    <Paper elevation={0} >
                                        {
                                            getItemWithIndex(
                                                groupItem.index,
                                                groups[index],
                                                getNext(index),
                                                getPrev(index),
                                                index != 0,
                                                index != groups.length - 1 || groupedItems[group].length > 1)
                                        }

                                    </Paper>
                                }

                            </div>

                        ))
                    }

                    <Paper sx={{ padding: '10px', textAlign: 'right' }} elevation={0}>
                        <Tooltip title={'Add an item above this line'}>
                            <Fab color='primary' size='medium' onClick={() => onAddToGroup(group)}>
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                    </Paper>
                    <Divider />
                </Paper>
            ))}
            {/* New Group */}

            <Paper sx={{ padding: '10px', textAlign: 'left' }} elevation={0}>
                {/* <Typography width={'100%'}>
                    New Group
                </Typography> */}
                <Tooltip title={'Add an item below the line'}>
                    <Fab color='primary' size='medium' onClick={() => onAddToGroup(maxId)}>
                        <AddIcon />
                    </Fab>
                </Tooltip>

            </Paper>
        </Paper>
    );
};

export default ItemOrderCreationGroups;
