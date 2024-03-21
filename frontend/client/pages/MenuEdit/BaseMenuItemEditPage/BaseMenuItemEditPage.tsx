import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '../../../../shared/data';
import { Button, TextField, Box, Autocomplete } from '@mui/material';
import { useFormEvents, useIsUnsaved } from '../../../helper/reactCustomHooks';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputTextEditableList from '../../../components/Generic/InputTextEditableList/InputTextEditableList';
import ChoiceGroupList from '../../../components/MenuEdit/Item/ChoiceGroupList';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { cleanString } from '../../../helper/helperFunctions';
import ErrorIcon from '@mui/icons-material/Error';
import TitleAndBack from '../../../components/Generic/TitleAndBack/TitleAndBack';
import NumberTextField from '../../../components/Generic/NumberTextField/NumberTextField';
import { drinksDataAutocomplete } from '../../../helper/menuItemAutocomplete';

interface BaseMenuItemEditPageProps {
    menuItems: MenuItem[];
    titleText: string;
    editButtonText: string;
    startingItem?: MenuItem;
    onEditClick: (editedItem: MenuItem) => void;
    nameErrorText?: string;
    onBackClick: () => void;
}

const BaseMenuItemEditPage: React.FC<BaseMenuItemEditPageProps> = ({
    menuItems, onBackClick, titleText, editButtonText,
    startingItem = {
        id: 0, name: '', foreignName: '', description: '', foreignDescription: '',
        allergens: [], price: 0, categories: [], customChanges: [], ingredients: [], choices: [], readyToServe: false
    },
    onEditClick, nameErrorText, }) => {

    const [menuItemForm, setMenuItemForm] = useState<MenuItem>(startingItem);
    const [nameError, setNameError] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);
    const [allIngredients, setAllIngredients] = useState<string[]>([]);
    const [allAllergens, setAllAllergens] = useState<string[]>([]);
    const isUnsaved = useIsUnsaved<MenuItem>((menuItemForm: MenuItem) => menuItemForm != startingItem,
        menuItemForm);

    useEffect(() => {
        setNameError(nameErrorText ? nameErrorText : null);
    }, [nameErrorText])

    useEffect(() => {
        // set ingredients
        const ingr = new Set<string>();
        menuItems.forEach((menuItem) => {
            menuItem.ingredients.forEach((ingredient) => {
                ingr.add(ingredient);
            });
        });
        setAllIngredients(Array.from(ingr));
        // set allergens
        const allr = new Set<string>();
        menuItems.forEach((menuItem) => {
            menuItem.allergens.forEach((allergen) => {
                allr.add(allergen);
            });
        });
        setAllAllergens(Array.from(allr));
    }, [menuItems]);

    const onSubmitFun = () => {
        // reset errors
        setNameError(null);
        setPriceError(null);
        // additional checks
        if (cleanString(menuItemForm.name) == '') {
            setNameError('This field is required');
            return;
        }
        else if (menuItemForm.price <= 0) {
            setPriceError('Invalid price');
            return;
        }
        // edit
        onEditClick(menuItemForm);
    }
    const error = nameError || priceError;
    const [handleChange, onSubmit] = useFormEvents<MenuItem>(setMenuItemForm, onSubmitFun);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(event);
    }

    const onBackCheck = () => {
        if (!isUnsaved.current)
            onBackClick(); // Go back
        else {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?'))
                onBackClick();
        }
    }
    const filteredAllAllergens = allAllergens.filter(a => menuItemForm.allergens.every(all => all != a));
    const filteredAllIngredients = allIngredients.filter(a => menuItemForm.ingredients.every(all => all != a));
    return (
        <>
            <TitleAndBack title={titleText} onBackClick={onBackCheck} />

            <Box sx={{
                border: '2px solid darkgrey',
                borderRadius: '6px',
                width: '80%',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
                padding: '24px'
            }}>
                <Grid container spacing={2}>
                    {/* First row */}
                    <Grid item xs={6}>
                        <Autocomplete
                            freeSolo
                            options={drinksDataAutocomplete.map(i => i.name)}
                            onChange={(e, newValue) => {
                                if (newValue != null) {
                                    const autoCompletedItem = drinksDataAutocomplete.find(i => i.name === newValue);

                                    if (autoCompletedItem) {
                                        setMenuItemForm(prev => ({
                                            ...prev,
                                            name: autoCompletedItem.name,
                                            description: autoCompletedItem.description,
                                            price: autoCompletedItem.price,
                                            allergens: autoCompletedItem.allergens,
                                            readyToServe: true
                                        }))
                                    }
                                }
                            }}
                            style={{ textAlign: 'center', width: '200px' }}
                            value={menuItemForm.name}
                            renderInput={(params) => <TextField {...params}
                                value={menuItemForm.name}
                                onChange={handleInputChange}
                                type='text'
                                variant='standard'
                                label='Name'
                                name='name'
                                required
                                fullWidth
                                error={nameError !== null}
                                helperText={nameError} />}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <NumberTextField
                            variant='standard'
                            type='number'
                            label='Price'
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            style={{
                                minWidth: '80px'
                            }}
                            name='price'
                            onChange={handleInputChange}
                            value={menuItemForm.price}
                            required
                            error={priceError !== null}
                            helperText={priceError}
                            allowNegative={false}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            variant='standard'
                            type='text'
                            label='Foreign Name'
                            name='foreignName'
                            onChange={handleInputChange}
                            value={menuItemForm.foreignName}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={menuItemForm.readyToServe} onChange={(e) => { setMenuItemForm(prev => ({ ...prev, readyToServe: e.target.checked })) }} />} label="isReadyToServe" />
                        </FormGroup>
                    </Grid>
                    {/*Second row */}
                    <Grid item xs={6}>
                        <TextField
                            variant='standard'
                            type='text'
                            label='Description'
                            name='description'
                            multiline
                            maxRows={4}
                            onChange={handleInputChange}
                            value={menuItemForm.description}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            variant='standard'
                            type='text'
                            label='Foreign Description'
                            name='foreignDescription'
                            multiline
                            maxRows={4}
                            onChange={handleInputChange}
                            value={menuItemForm.foreignDescription}
                            fullWidth
                        />
                    </Grid>

                    {/* Ingredients */}
                    <Grid item xs={12}>
                        <InputTextEditableList
                            listTitle='Ingredients'
                            items={menuItemForm.ingredients}
                            setItems={(items) => {
                                setMenuItemForm(prev => ({ ...prev, ingredients: items }));
                            }}
                            placeholder='New ingredient'
                            direction='horizontal'
                            autoCompleteItems={filteredAllIngredients}
                        />
                    </Grid>
                    {/* Allergens */}
                    <Grid item xs={12}>
                        <InputTextEditableList
                            listTitle='Allergens'
                            items={menuItemForm.allergens}
                            setItems={(items) => {
                                setMenuItemForm(prev => ({ ...prev, allergens: items }));
                            }}
                            placeholder='New allergen'
                            direction='horizontal'
                            autoCompleteItems={filteredAllAllergens}
                        />
                    </Grid>
                    {/* Ingredients Changes */}
                    <Grid item xs={12}>
                        <InputTextEditableList
                            listTitle='Changes'
                            items={menuItemForm.customChanges}
                            setItems={(items) => {
                                setMenuItemForm(prev => ({ ...prev, customChanges: items }));
                            }}
                            placeholder='New change'
                            direction='horizontal'
                        />
                    </Grid>
                    {/* Choices */}
                    <ChoiceGroupList
                        items={menuItemForm.choices}
                        setMenuItemForm={setMenuItemForm}
                    />
                </Grid>
                <div style={{ textAlign: 'center' }}>
                    <Button type='button' variant='contained' onClick={onSubmit} color={error ? 'error' : 'primary'}>
                        {
                            error &&
                            <ErrorIcon />
                        }
                        {editButtonText}
                    </Button>

                </div>
            </Box>


        </>
    );
}

export default BaseMenuItemEditPage;