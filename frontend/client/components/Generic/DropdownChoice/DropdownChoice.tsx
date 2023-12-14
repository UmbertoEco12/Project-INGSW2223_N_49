import React from 'react'
import { Button, Typography, TextField, IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

interface DropdownChoiceProps {
    choices: string[];
    value: string;
    onChange: (newValue: string) => void;

    label: string;
}

const DropdownChoice: React.FC<DropdownChoiceProps> = ({ label, value, onChange, choices }) => {

    return (
        <>
            <FormControl variant="standard" required sx={{ minWidth: 100 }}>
                <InputLabel id="role-label">{label}</InputLabel>
                <Select
                    labelId="role-label"
                    required
                    value={value}
                    label={label}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {
                        choices.map((choice, index) => (
                            <MenuItem key={index} value={choice}>{choice}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </>
    );
}

export default DropdownChoice;