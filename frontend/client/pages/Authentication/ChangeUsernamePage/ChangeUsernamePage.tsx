import React, { useState } from 'react';
import Navbar from '../../../components/Generic/Navbar/Navbar';
import { UpdateUsernameRequest } from '../../../helper/requests';
import { useNavigate } from 'react-router-dom';
import { handleUpdateUsername } from '../../../helper/userRequestHandler';
import BaseAuthPage from '../BaseAuthPage/BaseAuthPage';
import TitleAndBack from '../../../components/Generic/TitleAndBack/TitleAndBack';

const ChangeUsernamePage: React.FC = () => {
    const [formData, setFormData] = useState<UpdateUsernameRequest>({ oldUsername: '', password: '', newUsername: '' });
    const [oldUsernameError, setOldUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [newUsernameError, setNewUsernameError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData: UpdateUsernameRequest) => (
            {
                ...prevData,
                [name]: value
            }
        ));
    }

    const onSubmit = () => {
        setOldUsernameError(null);
        setNewUsernameError(null);
        setPasswordError(null);
        if (formData.oldUsername == '') {
            setOldUsernameError('this field is required');
            setNewUsernameError(null);
            setPasswordError(null);
            return;
        }
        else if (formData.password == '') {
            setOldUsernameError(null);
            setNewUsernameError(null);
            setPasswordError('this field is required');
            return;
        }
        else if (formData.newUsername == '') {
            setOldUsernameError(null);
            setNewUsernameError('this field is required');
            setPasswordError(null);
            return;
        }
        // additional checks
        else if (formData.oldUsername.includes(' ')) {
            setOldUsernameError('invalid characters');
            setPasswordError(null);
            setNewUsernameError(null);
            return;
        }
        else if (formData.newUsername.includes(' ')) {
            setNewUsernameError('invalid characters');
            setPasswordError(null);
            setOldUsernameError(null);
            return;
        }
        handleUpdateUsername(formData, navigate)
            .on(401, () => { // Handle Unauthorized
                setOldUsernameError(null);
                setPasswordError('Wrong password.');
                setNewUsernameError(null);
            })
            .on(409, () => { // Handle Conflict
                setOldUsernameError(null);
                setPasswordError(null);
                setNewUsernameError('There is already a user with this username.');
            })
            .on(422, () => { // Handle Unprocessable Entity
                setOldUsernameError('Wrong username.');
                setPasswordError(null);
                setNewUsernameError(null);
            })
            .execute();
    }

    return (
        <div>
            <Navbar></Navbar>
            <TitleAndBack title='User Info' onBackClick={() => navigate('/home')} />
            <BaseAuthPage
                handleInputChange={handleInput}
                fields={[
                    { label: 'Username', name: 'oldUsername', error: oldUsernameError, value: formData.oldUsername, required: true },
                    { label: 'Password', name: 'password', error: passwordError, value: formData.password, password: true, required: true },
                    { label: 'New Username', name: 'newUsername', error: newUsernameError, value: formData.newUsername, required: true },
                ]}
                title='Change Username'
                onSubmit={onSubmit}
            />

        </div>
    );
}

export default ChangeUsernamePage;