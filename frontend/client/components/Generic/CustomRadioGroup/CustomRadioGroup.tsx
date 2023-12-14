import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface CustomRadioGroupProps {
    title: string;
    values: string[];
    value: string;
    onChange: (newValue: string) => void;
    row?: boolean;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ title, value, values, onChange, row }) => {
    return (
        <>
            <FormControl>
                <FormLabel>{title}</FormLabel>
                <RadioGroup
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    row={row}
                >
                    {
                        values.map((value, index) => (
                            <FormControlLabel key={index} value={value} control={<Radio />} label={value} />
                        ))
                    }
                </RadioGroup>
            </FormControl>
        </>
    )
}

export default CustomRadioGroup;