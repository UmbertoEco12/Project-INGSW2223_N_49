import React, { useState, useEffect } from 'react';
import { useCategories, useMenuItems } from '../../../helper/reactCustomHooks';
import { Category, MenuItem } from '../../../../shared/data';
import CategoryEdit from '../../../components/MenuEdit/Category/CategoryEdit';
import MenuItemEdit from '../../../components/MenuEdit/Item/MenuItemEdit';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { Navigate, Route, Routes, useNavigate, NavigateFunction, useParams } from 'react-router-dom';
import { Typography, IconButton, TextField } from '@mui/material';
import CreateMenuItemPage from '../CreateMenuItemPage/CreateMenuItemPage'
import CategoryCreate from '../../../components/MenuEdit/Category/CategoryCreate';
import MenuEditCreate from '../../../components/MenuEdit/Item/MenuEditCreate';
import UpdateMenuItemPage from '../UpdateMenuItemPage/UpdateMenuItemPage';
import MenuSelect from '../../../components/MenuView/MenuSelect';
import { handleAddMenuItemToCategory } from '../../../helper/userRequestHandler';
import { useMediaQuery } from '@mui/material';
import EditMenuSmall from './EditMenuSmall';
import { primaryColor } from '../../../helper/themeManager';
interface EditMenuPageProps {
    navigate: NavigateFunction;
}

const EditMenuPage: React.FC<EditMenuPageProps> = ({ navigate }) => {
    const [categories, setCategories] = useCategories(navigate);
    const [menuItems, setMenuItems] = useMenuItems(navigate);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const isTabletOrSmaller = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        let stillExists = false;
        if (selectedCategory !== null) {
            categories.forEach((category: Category) => {
                if (category.id === selectedCategory?.id) {
                    stillExists = true;
                }
            });
        }
        // means that the selected category was deleted
        if (!stillExists) {
            setSelectedCategory(categories.length > 0 ? categories[0] : null);
        }
    }, [categories]);

    function addExisting() {
        navigate('/home/menu/select')
    }
    function addItemToSelectedCategory(item: MenuItem) {
        if (selectedCategory)
            handleAddMenuItemToCategory(item.id, selectedCategory.id, navigate).execute();
        navigate('/home/menu/edit')
    }
    const itemNotInSelectedCategory = menuItems.filter((menuItem) => menuItem.categories.every((category) => category.categoryId !== selectedCategory?.id));
    return (
        <>
            <Routes>
                <Route path="/" element={
                    <Navigate
                        replace to="/home/menu/edit" />} />
                <Route path='edit' element={
                    <>
                        <Typography variant='h5' textAlign={'center'}>Menu</Typography>
                        {
                            isTabletOrSmaller ?
                                <>
                                    <EditMenuSmall selectedCategory={selectedCategory} navigate={navigate}
                                        categories={categories} setCategories={setCategories} setSelectedCategory={setSelectedCategory}
                                        menuItems={menuItems} setMenuItems={setMenuItems} addExisting={addExisting} canAddExisting={itemNotInSelectedCategory.length > 0} />
                                </>
                                :
                                <Box className="horizontal-container" sx={{
                                    backgroundColor: primaryColor,
                                    borderRadius: '6px',
                                    maxWidth: '1300px',
                                    width: '100%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}>
                                    <div style={{
                                        flex: '0 0 auto',
                                        padding: '10px',
                                        minWidth: '300px'
                                    }}>
                                        <CategoryEdit navigate={navigate} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setCategories={setCategories} />
                                        <CategoryCreate navigate={navigate} />
                                    </div>
                                    <Divider orientation="vertical" flexItem variant="middle" />
                                    {
                                        selectedCategory && (
                                            <div style={{
                                                flex: '1',
                                                padding: '10px'
                                            }}>
                                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                                    <MenuItemEdit navigate={navigate} menuItems={menuItems} setMenuItems={setMenuItems} selectedCategoryId={selectedCategory?.id} />
                                                </div>
                                                <MenuEditCreate navigate={navigate} menuItems={menuItems} addExisting={addExisting} canAddExisting={itemNotInSelectedCategory.length > 0} />
                                            </div>
                                        )
                                    }
                                </Box>
                        }

                    </>
                }>
                </Route>
                <Route path='select' element={
                    <>
                        <MenuSelect categories={categories}
                            items={itemNotInSelectedCategory}
                            onSelect={addItemToSelectedCategory}
                            onBackClick={() => navigate('/home/menu/edit')} />
                    </>
                }>
                </Route>
                {
                    selectedCategory && (
                        <>
                            <Route path='create' element={
                                <>
                                    <CreateMenuItemPage navigate={navigate} menuItems={menuItems} selectedCategoryId={selectedCategory.id} />
                                </>}></Route>
                            <Route path='edit/:id' element={
                                <>
                                    <UpdateMenuItemPage navigate={navigate} menuItems={menuItems} />
                                </>}></Route>
                        </>
                    )
                }

            </Routes>
        </>
    );
}

export default EditMenuPage;
