import React, { useState } from 'react';
import Navbar from '../../../components/Generic/Navbar/Navbar';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { handleUpdatePassword } from '../../../helper/userRequestHandler';
import BaseAuthPage from '../BaseAuthPage/BaseAuthPage';
import TitleAndBack from '../../../components/Generic/TitleAndBack/TitleAndBack';
import { isPasswordWeak, weakPasswordError } from '../../../helper/helperFunctions';
import { getAuthenticatedUser } from '../../../helper/user';
interface FormData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePasswordPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [oldPasswordError, setOldPasswordError] = useState<string | null>(null);
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onBackClick = () => {
        if (getAuthenticatedUser()?.isFirstAccess) {
            navigate('/login');
        }
        else {
            navigate('/home');
        }

    }

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData: FormData) => (
            {
                ...prevData,
                [name]: value
            }
        ));
    }

    const onSubmit = () => {
        setOldPasswordError(null);
        setNewPasswordError(null);
        setError(null);
        // additional checks
        if (formData.oldPassword == '') {
            setOldPasswordError('this field is required');
            setNewPasswordError(null);
            return;
        }
        else if (formData.oldPassword == formData.newPassword) {
            setOldPasswordError(null);
            setNewPasswordError('Cannot use the same password');
            return;
        }
        else if (formData.newPassword == '') {
            setOldPasswordError(null);
            setNewPasswordError('this field is required');
            return;
        }
        else if (isPasswordWeak(formData.newPassword)) {
            setOldPasswordError(null);
            setNewPasswordError('Invalid password');
            setError(weakPasswordError);
            return;
        }
        else if (formData.newPassword !== formData.confirmPassword) {
            setOldPasswordError(null);
            setNewPasswordError('the passwords don`t match');
            return;
        }
        handleUpdatePassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword }, navigate)
            .on(401, () => {
                setOldPasswordError('Wrong password');
                setNewPasswordError(null);
            })
            .on(422, () => {
                setOldPasswordError(null);
                setNewPasswordError('Invalid password');
                setError(weakPasswordError);
            })
            .execute();
    }

    return (
        <div>
            <Navbar></Navbar>
            <TitleAndBack title='User Info' onBackClick={onBackClick} />
            <BaseAuthPage
                handleInputChange={handleInput}
                fields={[
                    { label: 'Password', name: 'oldPassword', error: oldPasswordError, value: formData.oldPassword, password: true, required: true },
                    { label: 'New Password', name: 'newPassword', error: newPasswordError, value: formData.newPassword, password: true, required: true },
                    { label: 'Confirm Password', name: 'confirmPassword', error: null, value: formData.confirmPassword, password: true, required: true },
                ]}
                title='Change Password'
                onSubmit={onSubmit}
                error={error}
            />
        </div>
    );
}

export default ChangePasswordPage;