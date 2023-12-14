import React, { useState, useRef, useEffect } from 'react';
import { MenuItem } from '../../../../shared/data';
import DraggableList from '../../Generic/DraggableList/DraggableList';
import MenuEditItem from './MenuEditItem';
import { handleUpdateMenuItemOrders, handleRemoveMenuItemFromCategory, handleDeleteMenuItem } from '../../../helper/userRequestHandler';
import { NavigateFunction } from 'react-router-dom';
import AlertDialog from '../../Generic/AlertDialog/AlertDialog';
interface MenuItemEditProps {
    menuItems: MenuItem[];
    selectedCategoryId: number;
    setMenuItems: (items: MenuItem[]) => void;
    navigate: NavigateFunction;
}
let prevItems: MenuItem[];
const MenuItemEdit: React.FC<MenuItemEditProps> = ({ menuItems, selectedCategoryId, setMenuItems, navigate }) => {
    const [viewed, setViewed] = useState<MenuItem | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [alertText, setAlertText] = useState<string>('');
    const [menuItemToDelete, setMenuItemToDelete] = useState<MenuItem | null>(null);
    const onDeleteAlert = (item: MenuItem) => {
        setAlertText(`Do you really want to delete ${item.name} ?`);
        setMenuItemToDelete(item);
        setIsAlertOpen(true);
    }
    const reorderItems = (pItems: MenuItem[]) => {
        // local reorder
        const reorderedItems = pItems.map((item, index) => {
            for (let i = 0; i < item.categories.length; i++) {
                if (item.categories[i].categoryId === selectedCategoryId) {
                    item.categories[i].itemOrder = index + 1;
                    return item;
                }
            }
            return item;
        });
        // set prevItems before editing
        prevItems = menuItems;
        setMenuItems(menuItems.map((item, index) => {
            const orderedItem = reorderedItems.find((orderedItem, index) => orderedItem.id === item.id);
            if (orderedItem)
                return orderedItem;
            else
                return item;
        }));
        const request = pItems.map((item, index) => ({
            itemId: item.id,
            itemOrder: index + 1,
        }));
        // update order
        handleUpdateMenuItemOrders({ orders: request }, selectedCategoryId, navigate)
            .onUnexpectedStatusCode((_) => {
                setMenuItems(prevItems); // revert item order
            })
            .execute();
    }
    const removeItemFromSelectedCategory = (item: MenuItem) => {
        handleRemoveMenuItemFromCategory(item.id, selectedCategoryId, navigate).execute();
    }
    const deleteMenuItem = () => {
        if (menuItemToDelete)
            handleDeleteMenuItem(menuItemToDelete.id, navigate).execute();
    }
    const filteredItems = menuItems
        .filter((menuItem) => menuItem.categories.some((category) => category.categoryId === selectedCategoryId))
        .sort((a, b) => {
            // Find the category order for each item
            const orderA = a.categories.find((category) => category.categoryId === selectedCategoryId)?.itemOrder || 0;
            const orderB = b.categories.find((category) => category.categoryId === selectedCategoryId)?.itemOrder || 0;

            // Compare based on the itemOrder
            return orderA - orderB;
        });

    return (
        <>
            <DraggableList
                items={filteredItems}
                onReorderItems={reorderItems}
                getDraggable={(item, index, provided) => (
                    <MenuEditItem menuItem={item} viewedMenuItem={viewed} setViewedMenuItem={setViewed}
                        draggable={provided.dragHandleProps} draggableRef={provided.innerRef} draggableProps={provided.draggableProps}
                        deleteMenuItem={onDeleteAlert} editMenuItem={() => navigate(`menu/edit/${item.id.toString()}`)} removeItemFromSelectedCategory={removeItemFromSelectedCategory} />
                )
                }
            />
            <AlertDialog
                open={isAlertOpen}
                title='Delete User'
                text={alertText}
                onYesClicked={deleteMenuItem}
                onClose={() => setIsAlertOpen(false)} />
        </>
    )
}

export default MenuItemEdit;