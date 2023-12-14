import React, { useState } from 'react';
import { Button, Typography, TextField, IconButton, Select, MenuItem, InputLabel, FormControl, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import { useFormEvents } from '../../../helper/reactCustomHooks';
import { CreateStaffRequest } from '../../../../shared/userRequests';
import { UserRole } from '../../../../shared/data';
import DropdownChoice from '../../Generic/DropdownChoice/DropdownChoice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CreateStaffUserProps {
    onCreate: (request: CreateStaffRequest) => void;
    usernameError: string | null;
    passwordError: string | null;
    userFormData: CreateStaffRequest;
    setUserFormData: React.Dispatch<React.SetStateAction<CreateStaffRequest>>;
    error?: string | null | undefined;
}
const CreateStaffUser: React.FC<CreateStaffUserProps> = ({ onCreate, usernameError, userFormData, setUserFormData, error, passwordError }) => {
    const createUser = () => {
        onCreate(userFormData);
    }
    const [handleInputChange, onSubmit] = useFormEvents<CreateStaffRequest>(setUserFormData, createUser);

    const setRandomPassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        const passwordLength = 10;

        const getRandomChar = (charSet: string) => {
            const randomIndex = Math.floor(Math.random() * charSet.length);
            return charSet.charAt(randomIndex);
        };

        // Ensure at least one uppercase letter, one lowercase letter, and one digit
        const randomUppercase = getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        const randomLowercase = getRandomChar('abcdefghijklmnopqrstuvwxyz');
        const randomDigit = getRandomChar('0123456789');

        // The remaining characters needed to fulfill the length requirement
        const remainingChars = passwordLength - 3;

        // Randomly generate the rest of the password
        let password = `${randomUppercase}${randomLowercase}${randomDigit}`;
        for (let i = 0; i < remainingChars; i++) {
            password += getRandomChar(characters);
        }

        setUserFormData((prev) => ({
            ...prev,
            password: password
        }));
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}>
                        <Typography textAlign={'center'} width={'100%'}>
                            Create a new User
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                            alignContent: 'center'
                        }}>
                            <TextField
                                label="Username"
                                variant="standard"
                                required
                                type='text'
                                value={userFormData.username}
                                name='username'
                                onChange={handleInputChange}
                                error={usernameError !== null}
                                helperText={usernameError}
                            />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <TextField
                                    label="Password"
                                    variant="standard"
                                    required
                                    type='text'
                                    value={userFormData.password}
                                    name='password'
                                    onChange={handleInputChange}
                                    error={passwordError !== null}
                                    helperText={passwordError}
                                />
                                <IconButton type="button" onClick={setRandomPassword}>
                                    <CasinoIcon />
                                </IconButton>
                            </div>

                            <DropdownChoice choices={[UserRole.Manager, UserRole.Chef, UserRole.Waiter]} value={userFormData.role} label={'Role'} onChange={(newValue) => {
                                setUserFormData((prev) => ({ ...prev, role: newValue }));
                            }} />
                        </div>
                        <div style={{
                            textAlign: 'center',
                            width: '100%',
                            marginTop: '10px'
                        }}>
                            <Button type='submit' variant="contained" sx={{
                                width: '235px'
                            }}
                                color={error ? 'error' : 'primary'}>Create</Button>
                            {
                                error &&
                                <Typography color={'error'}>{error}</Typography>
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>

            </form>
        </>
    );
}

export default CreateStaffUser;