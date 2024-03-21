import React, { useRef, Ref } from 'react';
import CustomTextField, { CustomTextFieldProps } from '../CustomTextField/CustomTextField';

interface NumberTextFieldProps extends CustomTextFieldProps {
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    allowNegative?: boolean;
}

const NumberTextField: React.FC<NumberTextFieldProps> = ({ onChange, allowNegative = true, ...rest }) => {

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value;
        // Allow only numbers
        if (!/^-?\d*\.?\d*$/.test(value)) {
            return;
        }
        //Allow negative numbers
        if (!allowNegative && value.includes('-')) {
            value = value.replace('-', '');
        }
        // remove starting 0
        value = value.replace(/^0+/, '');
        e.target.value = value;
        if (onChange)
            onChange(e);
    }

    return (
        <CustomTextField
            {...rest}

            inputProps={{
                type: 'text',
                inputMode: 'numeric',
            }}
            onChange={handleChange}
        />
    );
};

export default NumberTextField;
