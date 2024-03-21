import React, { useState } from 'react';
import { MenuItem } from '../../../../shared/data';
import { NavigateFunction } from 'react-router-dom';
import { handleCreateMenuItem } from '../../../helper/userRequestHandler';
import BaseMenuItemEditPage from '../BaseMenuItemEditPage/BaseMenuItemEditPage';
import LoadingView from '../../../components/Generic/LoadingView/LoadingView';

interface CreateMenuItemPageProps {
    menuItems: MenuItem[];
    navigate: NavigateFunction;
    selectedCategoryId: number;
}

const CreateMenuItemPage: React.FC<CreateMenuItemPageProps> = ({
    menuItems, navigate, selectedCategoryId }) => {
    const [nameError, setNameError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const createMenuItem = (editedItem: MenuItem) => {
        setIsLoading(true);
        handleCreateMenuItem({
            name: editedItem.name, foreignName: editedItem.foreignName,
            description: editedItem.description, foreignDescription: editedItem.foreignDescription,
            allergens: editedItem.allergens, price: editedItem.price, categories: [selectedCategoryId],
            customChanges: editedItem.customChanges, ingredients: editedItem.ingredients,
            choices: editedItem.choices, readyToServe: editedItem.readyToServe
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
    const onBackClick = () => {
        navigate('/home/menu/edit');
    }
    return (
        <>
            <LoadingView isOpen={isLoading} />
            <BaseMenuItemEditPage
                titleText='Create new item'
                editButtonText='Create'
                menuItems={menuItems}
                onEditClick={createMenuItem}
                onBackClick={onBackClick}
                nameErrorText={nameError !== null ? nameError : undefined}
            />

        </>
    );
}

export default CreateMenuItemPage;