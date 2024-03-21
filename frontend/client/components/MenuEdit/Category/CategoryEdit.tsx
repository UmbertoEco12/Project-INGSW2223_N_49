import React, { useState } from 'react';
import { Category } from '../../../../shared/data';
import CategoryItem from './CategoryItem';
import DraggableList from '../../Generic/DraggableList/DraggableList';
import { NavigateFunction } from 'react-router-dom';
import { handleDeleteCategory, handleUpdateCategory, handleUpdateCategoryOrder } from '../../../helper/userRequestHandler';
import AlertDialog from '../../Generic/AlertDialog/AlertDialog';
interface CategoryEditProps {
    categories: Category[];
    navigate: NavigateFunction;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;

    selectedCategory: Category | null;
    setSelectedCategory: (category: Category | null) => void;
}

let prevCategories: Category[] = [];

const CategoryEdit: React.FC<CategoryEditProps> = ({ navigate, selectedCategory, setSelectedCategory, categories, setCategories }) => {
    const [viewedCategory, setViewedCategory] = useState<Category | null>(null);
    const [categoryUpdateError, setCategoryUpdateError] = useState<{ error: string, categoryId: number } | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [alertText, setAlertText] = useState<string>('');
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const onDeleteAlert = (category: Category) => {
        // show alert
        setAlertText(`Do you really want to delete ${category.name} ? All items only in this category will be deleted.`);
        setCategoryToDelete(category);
        setIsAlertOpen(true);
    }
    const reorderCategories = (categories: Category[]) => {
        prevCategories = categories;
        // local reorder
        setCategories(categories);
        const request = categories.map((category, index) => ({
            id: category.id,
            menuOrder: index + 1,
        }));
        // update order
        handleUpdateCategoryOrder({ categories: request }, navigate)
            .onUnexpectedStatusCode((_) => {
                setCategories(prevCategories);// revert order
            })
            .execute();
    }
    const updateCategoryName = (updatedCategory: Category, newName: string) => {
        // reset error
        setCategoryUpdateError(null);
        // update
        handleUpdateCategory({ id: updatedCategory.id, newName: newName }, navigate)
            .onExecute(() => {
                setViewedCategory(null);
            })
            .on(409, () => {
                const cat = categories.find(cat => cat.id === updatedCategory.id);
                // reselect if it was deselected
                setViewedCategory(cat ? cat : null);
                setCategoryUpdateError({ error: 'There is already a category with this name.', categoryId: updatedCategory.id });
            })
            .execute();
    }
    const viewCategoryDetails = (cat: Category | null) => {
        // reset error
        setCategoryUpdateError(null);
        setViewedCategory(cat);
    }

    const deleteCategory = () => {
        if (categoryToDelete) {
            setViewedCategory(null)
            handleDeleteCategory(categoryToDelete.id, navigate)
                .execute();
        }
    }
    return (
        <div>
            <DraggableList
                items={categories}
                onReorderItems={reorderCategories}
                getDraggable={(item, index, provided) => (
                    <CategoryItem category={item} viewedCategory={viewedCategory} setViewedCategory={viewCategoryDetails}
                        draggable={provided.dragHandleProps} draggableRef={provided.innerRef} draggableProps={provided.draggableProps}
                        error={categoryUpdateError?.categoryId === item.id ? categoryUpdateError.error : null}
                        onUpdate={updateCategoryName} onDelete={onDeleteAlert} selectCategory={setSelectedCategory} isSelected={selectedCategory?.id === item.id} />
                )
                }
                onDragStart={() => setViewedCategory(null)}
            />
            <AlertDialog
                open={isAlertOpen}
                title='Delete User'
                text={alertText}
                onYesClicked={deleteCategory}
                onClose={() => setIsAlertOpen(false)} />
        </ div>
    )
}

export default CategoryEdit;