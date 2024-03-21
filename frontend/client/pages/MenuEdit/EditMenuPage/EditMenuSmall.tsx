import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import CategoryEdit from '../../../components/MenuEdit/Category/CategoryEdit';
import MenuItemEdit from '../../../components/MenuEdit/Item/MenuItemEdit';
import CategoryCreate from '../../../components/MenuEdit/Category/CategoryCreate';
import MenuEditCreate from '../../../components/MenuEdit/Item/MenuEditCreate';
import { Category, MenuItem } from '../../../../shared/data';
import { NavigateFunction } from 'react-router-dom';
import { primaryColor } from '../../../helper/themeManager';

interface EditMenuSmallProps {
    selectedCategory: Category | null;
    navigate: NavigateFunction;
    categories: Category[];
    setSelectedCategory: (category: Category | null) => void;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    menuItems: MenuItem[];
    setMenuItems: (items: MenuItem[]) => void;
    addExisting: () => void;
    canAddExisting: boolean;
}
const EditMenuSmall: React.FC<EditMenuSmallProps> = ({ selectedCategory, navigate,
    categories, setSelectedCategory, setCategories,
    menuItems, setMenuItems, addExisting, canAddExisting }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        setTabValue(newValue);
    };

    return (
        <Box>
            <Tabs value={tabValue} onChange={handleChangeTab} aria-label="Tab navigation">
                <Tab label="Categories" />

                <Tab label={selectedCategory ? selectedCategory.name : "Menu Items"} disabled={selectedCategory == null} />
            </Tabs>
            <Divider />
            <TabPanel value={tabValue} index={0}>
                <CategoryEdit navigate={navigate} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setCategories={setCategories} />
                <CategoryCreate navigate={navigate} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {selectedCategory && (
                    <div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <MenuItemEdit navigate={navigate} menuItems={menuItems} setMenuItems={setMenuItems} selectedCategoryId={selectedCategory?.id} />
                        </div>
                        <MenuEditCreate navigate={navigate} menuItems={menuItems} addExisting={addExisting} canAddExisting={canAddExisting} />
                    </div>
                )}
            </TabPanel>
        </Box>
    );
};
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (
                <Box p={3} sx={{
                    backgroundColor: primaryColor,
                    borderRadius: '6px',
                }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export default EditMenuSmall;