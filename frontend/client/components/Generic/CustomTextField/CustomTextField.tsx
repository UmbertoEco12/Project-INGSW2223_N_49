import React, { useRef, Ref } from 'react';
import TextField, { StandardTextFieldProps, TextFieldVariants, TextFieldProps } from '@mui/material/TextField';

export interface CustomTextFieldProps extends StandardTextFieldProps {
    blurOnEnterPressed?: boolean;
    onEnterPressed?: () => void;
    onKeyDown?: React.KeyboardEventHandler;
    inputRef?: Ref<any> | undefined;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ onEnterPressed, blurOnEnterPressed = false, onKeyDown, inputRef, ...rest }) => {
    const textField = useRef<HTMLInputElement>(null);
    React.useImperativeHandle(inputRef, () => textField.current); // pass the ref to the parent
    return (
        <TextField {...rest} onKeyDown={(e) => {
            if (onKeyDown) // call standard
                onKeyDown(e);
            if (e.key === 'Enter') {
                if (onEnterPressed)
                    onEnterPressed();
                if (blurOnEnterPressed)
                    textField.current?.blur();
            }
        }} inputRef={textField} />
    );
};

export default CustomTextField;
