import React, { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { cleanString } from "../../../helper/helperFunctions";
import TextFieldCreate from "../../Generic/TextFieldCreate/TextFieldCreate";
import { handleAddCategory } from "../../../helper/userRequestHandler";
import { NavigateFunction } from "react-router-dom";
import { ApiError } from "../../../helper/requests";

interface CategoryCreateProps {
    navigate: NavigateFunction;
}

const CategoryCreate: React.FC<CategoryCreateProps> = ({ navigate }) => {

    const [createError, setCreateError] = useState<string | undefined>(undefined);
    const createNewCategory = async (name: string): Promise<boolean> => {
        try {
            setCreateError(undefined);// reset error
            if (cleanString(name) == '') {
                setCreateError('invalid name');
                return false;
            }
            await handleAddCategory({ name: name }, navigate).executePromise();
            return true; // Successful creation
        } catch (error) {
            if (error instanceof ApiError && error.statusCode === 409) {
                setCreateError('There is already a category with this name');
            }
            return false; // Failed creation
        }
    };
    return (
        <TextFieldCreate
            style={{ backgroundColor: 'white', borderRadius: '4px', padding: '10px', marginTop: '10px' }}
            placeholder="new category"
            create={createNewCategory}
            error={createError}
        />
    )
}

export default CategoryCreate;