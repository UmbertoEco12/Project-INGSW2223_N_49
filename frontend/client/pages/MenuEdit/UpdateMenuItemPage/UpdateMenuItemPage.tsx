import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../../../shared/data';
import { NavigateFunction, useParams } from 'react-router-dom';
import BaseMenuItemEditPage from '../BaseMenuItemEditPage/BaseMenuItemEditPage';
import { handleUpdateMenuItem } from '../../../helper/userRequestHandler';
import LoadingView from '../../../components/Generic/LoadingView/LoadingView';
interface UpdateMenuItemPageProps {
    menuItems: MenuItem[];
    navigate: NavigateFunction;
}

const UpdateMenuItemPage: React.FC<UpdateMenuItemPageProps> = ({
    menuItems, navigate }) => {
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const { id } = useParams();

    useEffect(() => {
        if (menuItems && id && menuItem === null) {
            const item = menuItems.find((it) => it.id.toString() == id);
            if (item) {
                if (menuItem === null)// update only if null
                    setMenuItem(item);
            }
            else
                onBackClick(); // go back
        }
    }, [id, menuItems]);

    const [nameError, setNameError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const updateMenuItem = (editedItem: MenuItem) => {
        if (menuItem != null) {
            setIsLoading(true);
            handleUpdateMenuItem({
                id: menuItem.id,
                newName: editedItem.name,
                newForeignName: editedItem.foreignName,
                newPrice: editedItem.price,
                newDescription: editedItem.description,
                newForeignDescription: editedItem.foreignDescription,
                newAllergens: editedItem.allergens,
                newChoices: editedItem.choices,
                newCustomChanges: editedItem.customChanges,
                newIngredients: editedItem.ingredients,
                newReadyToServe: editedItem.readyToServe
            }, navigate)
                .onExecute(() => {
                    onBackClick();
                    setIsLoading(false);
                })
                .on(409, () => {
                    setNameError('this item already exists');
                    setIsLoading(false);
                })
                .execute();
        }
    }

    const onBackClick = () => {
        navigate('/home/menu/edit');
    }
    return (
        <>
            <LoadingView isOpen={isLoading} />
            {
                menuItem &&
                <BaseMenuItemEditPage
                    titleText={`Update ${menuItem.name}`}
                    editButtonText='Update'
                    menuItems={menuItems}
                    onEditClick={updateMenuItem}
                    onBackClick={onBackClick}
                    nameErrorText={nameError !== null ? nameError : undefined}
                    startingItem={menuItem}
                />
            }
        </>
    );
}

export default UpdateMenuItemPage;