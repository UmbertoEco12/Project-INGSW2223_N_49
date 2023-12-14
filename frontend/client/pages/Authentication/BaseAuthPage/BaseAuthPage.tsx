import React, { useRef, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import CustomTextField from '../../../components/Generic/CustomTextField/CustomTextField';

interface TextFieldNameAndError {
    label?: string;
    name: string;
    error: string | null;
    value: string;
    password?: boolean;
    required?: boolean;
}

interface BaseAuthPageProps {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fields: TextFieldNameAndError[];
    title: string;
    onSubmit: () => void;
    buttonText?: string;
    error?: string | null | undefined;
}

const BaseAuthPage: React.FC<BaseAuthPageProps> = ({ handleInputChange, fields, title, buttonText, onSubmit, error }) => {
    const fieldRefs = useRef<(HTMLInputElement | null)[]>(fields.map(i => null));

    useEffect(() => {
        if (fields.length != fieldRefs.current.length) {
            fieldRefs.current = fields.map(i => null);
            //reset array
        }
    }, [fields]);


    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '380px',
                    height: '400px',
                    marginTop: '5rem',
                    border: '2px solid darkgrey',
                    borderRadius: '6px',
                    textAlign: 'center',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}>
                    <Typography variant='h4' fontFamily={'monospace'}>{title}</Typography>
                    {
                        fields.map((field, index) => (
                            <CustomTextField
                                key={index}
                                label={field.label}
                                name={field.name}
                                value={field.value}
                                onChange={handleInputChange}
                                required={field.required}
                                error={field.error != null}
                                helperText={field.error}
                                variant='standard'
                                sx={{
                                    mb: '5px'
                                }}
                                type={field.password ? 'password' : 'text'}
                                inputRef={(input: any) => (fieldRefs.current[index] = input)}
                                onEnterPressed={() => {
                                    if (fieldRefs.current.length - 1 > index) {
                                        // not last focus next
                                        fieldRefs.current[index + 1]?.focus();
                                    }
                                    else {
                                        fieldRefs.current[index]?.blur();
                                        // try call
                                        onSubmit();
                                    }
                                }} />
                        ))
                    }
                    <br />
                    <Button variant='contained' onClick={onSubmit} sx={{
                        width: '60%'
                    }} id={'on-submit-button'}
                        color={error ? 'error' : 'primary'}>
                        {buttonText ? buttonText : title}
                    </Button>
                    {
                        error &&
                        <Typography color={'error'}>{error}</Typography>
                    }

                </div>
            </div>
        </>
    );
}

export default BaseAuthPage;