import React, { useState, useEffect, ReactNode } from 'react';
import { Category, MenuItem } from '../../../shared/data';
import TitleAndBack from '../Generic/TitleAndBack/TitleAndBack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CustomTextField from '../Generic/CustomTextField/CustomTextField';
import MenuItemView from './MenuItemView';
import { Divider, useMediaQuery } from '@mui/material';
interface MenuSelectProps {
    categories: Category[];
    items: MenuItem[];
    onSelect: (item: MenuItem) => void;
    onBackClick: () => void;
}


const getCategoryList = (categories: Category[], categoryItems: { [key: number]: MenuItem[] }, scrollToCategory: (name: string) => void): ReactNode => {
    return (
        <>
            <List>
                {categories.map((category, index) => {
                    return categoryItems[index].length > 0 ?
                        <ListItem key={category.id} onClick={() => scrollToCategory(category.name)} disablePadding sx={{
                            borderBottom: '1px solid lightgrey',
                            minWidth: '200px'
                        }}>
                            <ListItemButton>
                                <ListItemText primary={category.name} />
                            </ListItemButton>
                        </ListItem>
                        :
                        null;
                })}
            </List>
        </>
    )
}

const getItemList = (categories: Category[], categoryItems: { [key: number]: MenuItem[] }, onSelect: (item: MenuItem) => void): ReactNode => {
    return (
        <>
            {categories.map((category, index) => {
                return categoryItems[index].length > 0 ?
                    <div key={category.id} id={`category-${category.name}`} >
                        <Typography variant="h5" align='center' width={'100%'}>{category.name}</Typography>
                        {
                            (categoryItems[index] && categoryItems[index].length > 0) && categoryItems[index].map((item) => (
                                <div key={item.id} style={{ width: '100%' }}>
                                    <MenuItemView menuItem={item} onSelect={() => onSelect(item)} />
                                </div>
                            ))}
                    </div>
                    :
                    null;
            }
            )}
        </>
    )
}

const MenuSelect: React.FC<MenuSelectProps> = ({ categories, items, onSelect, onBackClick }) => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [navbarHeight, setNavbarHeight] = useState(0);
    useEffect(() => {
        // Measure the height of the navbar and update the state
        const navbar = document.getElementById('app-navbar');
        if (navbar) {
            setNavbarHeight(navbar.clientHeight);
        }

        // Recalculate the position if the window is resized
        const handleResize = () => {
            if (navbar) {
                setNavbarHeight(navbar.clientHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (items.length == 0)
            onBackClick();
    }, [items]);

    const filteredItems = items.filter((item) => {
        const includesSearchTerm =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());

        const isInSelectedCategory =
            selectedCategory === null || item.categories.some((cat) => cat.categoryId === selectedCategory);

        return includesSearchTerm && isInSelectedCategory;
    });

    const categoryItems: { [key: number]: MenuItem[] } = categories.reduce((acc, category, index) => {
        acc[index] = filteredItems
            .filter((menuItem) => menuItem.categories.some((cat) => cat.categoryId === category.id))
            .sort((a, b) => {
                // Find the category order for each item
                const orderA = a.categories.find((cat) => cat.categoryId === category.id)?.itemOrder || 0;
                const orderB = b.categories.find((cat) => cat.categoryId === category.id)?.itemOrder || 0;

                // Compare based on the itemOrder
                return orderA - orderB;
            }).filter((item) => item.categories.some((cat) => cat.categoryId === category.id));
        return acc;
    }, {} as { [key: number]: MenuItem[] });

    const [categoryDrawer, setCategoryDrawer] = useState<boolean>(false);

    const scrollToCategory = (category: string) => {
        const categoryElement = document.getElementById(`category-${category}`);
        if (categoryElement) {
            const navbarOffset = navbarHeight || 0;
            const categoryTop = categoryElement.offsetTop;

            window.scrollTo({
                top: categoryTop - navbarOffset,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', textAlign: 'center', zIndex: '1051' }} elevation={2}>
                <CustomTextField
                    variant='standard'
                    type='search'
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={() => setCategoryDrawer(true)}>Open Categories</Button>
            </Paper>
            <Drawer
                anchor={'left'}
                open={categoryDrawer}
                onClose={() => setCategoryDrawer(false)}

            >
                {getCategoryList(categories, categoryItems, scrollToCategory)}
            </Drawer>

            <TitleAndBack title='Menu' onBackClick={onBackClick} />
            <div style={{ marginTop: '80px', marginBottom: '61px' }}>
                {getItemList(categories, categoryItems, onSelect)}
            </div>
        </div>
    );
};

export default MenuSelect;