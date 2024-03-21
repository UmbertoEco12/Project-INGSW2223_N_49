import React, { useState } from 'react';
import Navbar from '../../components/Generic/Navbar/Navbar';
import { CreateAdminRequest } from '../../../shared/userRequests';
import { useNavigate } from 'react-router-dom';
import { handleCreateAdmin } from '../../helper/userRequestHandler';
import BaseAuthPage from './BaseAuthPage/BaseAuthPage';
import { isPasswordWeak, weakPasswordError } from '../../helper/helperFunctions';


const CreateAdminPage: React.FC = () => {
    const [formData, setFormData] = useState<CreateAdminRequest>({ adminUsername: '', adminPassword: '' });
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData: CreateAdminRequest) => (
            {
                ...prevData,
                [name]: value
            }
        ));
    }

    const onSubmit = () => {
        setUsernameError(null);
        setPasswordError(null);
        if (formData.adminUsername == '') {
            setUsernameError('this field is required');
            setPasswordError(null);
            return;
        }
        else if (formData.adminPassword == '') {
            setUsernameError(null);
            setPasswordError('this field is required');
            return;
        }
        // additional checks
        else if (formData.adminUsername.includes(' ')) {
            setUsernameError('invalid characters');
            setPasswordError(null);
            return;
        }
        else if (isPasswordWeak(formData.adminPassword)) {
            setUsernameError(null);
            setPasswordError('Invalid password');
            setError(weakPasswordError)
            return;
        }
        // ok send request
        handleCreateAdmin(formData, navigate)
            .on(409, () => { // conflict
                setUsernameError('this username is already taken');
                setPasswordError(null);
            })
            .on(422, () => { // weak password
                setUsernameError(null);
                setPasswordError('Invalid password');
                setError(weakPasswordError)
            })
            .onExecute(() => {
                navigate('/'); // go back to login
            })
            .execute();
    }

    return (
        <div>
            <Navbar></Navbar>
            <BaseAuthPage
                handleInputChange={handleInput}
                fields={[
                    { label: 'Username', name: 'adminUsername', error: usernameError, value: formData.adminUsername, required: true },
                    { label: 'Password', name: 'adminPassword', error: passwordError, value: formData.adminPassword, password: true, required: true }
                ]}
                title='CreateAdmin'
                onSubmit={onSubmit}
                error={error}
            />

        </div >
    );
}

export default CreateAdminPage;