import React, { useState } from 'react';
import Navbar from '../../../components/Generic/Navbar/Navbar';
import { LoginRequest } from '../../../helper/requests';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../../../helper/userRequestHandler';
import BaseAuthPage from '../BaseAuthPage/BaseAuthPage';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginRequest>({ username: '', password: '' });
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData: LoginRequest) => (
            {
                ...prevData,
                [name]: value
            }
        ));
    }

    const onSubmit = () => {
        setUsernameError(null);
        setPasswordError(null);
        if (formData.username == '') {
            setUsernameError('this field is required');
            setPasswordError(null);
            return;
        }
        else if (formData.password == '') {
            setUsernameError(null);
            setPasswordError('this field is required');
            return;
        }
        // additional checks
        else if (formData.username.includes(' ')) {
            setUsernameError('invalid characters');
            setPasswordError(null);
            return;
        }
        // ok send request
        handleLogin(formData, navigate)
            .on(401, () => {
                setUsernameError(null);
                setPasswordError('Wrong password');
            })
            .on(404, () => {
                setUsernameError('User not found');
                setPasswordError(null);
            })
            .execute();
    }

    return (
        <div>
            <Navbar></Navbar>
            <BaseAuthPage
                handleInputChange={handleInput}
                fields={[
                    { label: 'Username', name: 'username', error: usernameError, value: formData.username, required: true },
                    { label: 'Password', name: 'password', error: passwordError, value: formData.password, password: true, required: true }
                ]}
                title='Login'
                onSubmit={onSubmit}
            />

        </div >
    );
}

export default LoginPage;