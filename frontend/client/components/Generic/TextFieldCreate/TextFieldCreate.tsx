import React, { useEffect, useState } from "react";
import { TextField, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { cleanString } from "../../../helper/helperFunctions";

interface TextFieldCreateProps {
    placeholder?: string;
    canAdd?: (s: string) => boolean;
    label?: string;
    create: (name: string) => Promise<boolean>;
    error?: string;
    style?: React.CSSProperties;
}

const TextFieldCreate: React.FC<TextFieldCreateProps> = ({ placeholder, canAdd, label, create, error, style }) => {
    const [fieldName, setFieldName] = useState<string>('');
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const _canAdd = (): boolean => {
        return cleanString(fieldName) != '' && (canAdd ? canAdd(fieldName) : true);
    }
    const createItem = async () => {
        if (_canAdd() && !isCreating) {
            setIsCreating(true);
            const success = await create(fieldName);
            setIsCreating(false);
            if (success) {
                setFieldName(''); // Clean name on success
            }
        }
    }
    return (
        <div style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        >
            <TextField
                type='text'
                variant='standard'
                value={fieldName}
                placeholder={placeholder}
                style={{ textAlign: 'center' }}
                onChange={(e) => setFieldName(e.target.value)}
                label={label}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && _canAdd()) {
                        createItem();
                    }
                }}
                error={error ? true : false}
                helperText={error}
            />
            <IconButton onClick={createItem}
                disabled={!_canAdd()}
                color='success'>
                <AddIcon />
            </IconButton>
        </div>
    )
}

export default TextFieldCreate;