import React, { useState, useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useStaff, useUserInfo } from '../../helper/reactCustomHooks';
import { Staff } from '../../../shared/data';
import { CreateStaffRequest } from '../../../shared/userRequests';
import { handleCreateStaff, handleDeleteStaff } from '../../helper/userRequestHandler';
import CreateStaffUser from '../../components/Staff/CreateStaffUser/CreateStaffUser';
import ViewStaff from '../../components/Staff/ViewStaff/ViewStaff';
import AlertDialog, { AlertDialogProps } from '../../components/Generic/AlertDialog/AlertDialog';
import { AuthenticatedUser } from '../../helper/user';
import Typography from '@mui/material/Typography'
import { weakPasswordError, isPasswordWeak } from '../../helper/helperFunctions';

interface StaffPageProps {
    user: AuthenticatedUser;
    navigate: NavigateFunction;
}
const emptyForm = { username: '', password: '', role: '' };

interface UserStaffCreateError {
    usernameError: string | null;
    passwordError: string | null;
    error: string | null;
}
const noError = { usernameError: null, passwordError: null, error: null };
const StaffPage: React.FC<StaffPageProps> = ({ user, navigate }) => {
    const [staff, setStaff] = useStaff(navigate);
    // username already taken error
    const [error, setError] = useState<UserStaffCreateError>(noError);
    // alert 
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [alertText, setAlertText] = useState<string>('');
    const [userToDelete, setUserToDelete] = useState<Staff | null>(null);
    // create staff request
    const [userFormData, setUserFormData] = useState<CreateStaffRequest>(emptyForm)

    const deleteUser = () => {
        if (userToDelete != null) {
            handleDeleteStaff(userToDelete.id, navigate)
                .onExecute((_) => {
                    // remove user from staff
                    setStaff(staff.filter(user => user.id !== userToDelete.id));
                })
                .execute()
        }
    }

    const handleDeleteClick = (staffMember: Staff) => {

        setAlertText(`Do you really want to delete ${staffMember.username} account ?`);
        setUserToDelete(staffMember);
        setIsAlertOpen(true);
    };
    const handleOnCreate = (request: CreateStaffRequest) => {
        setError(noError);
        // additional error check
        if (request.username.includes(' ')) {
            setError({
                usernameError: 'error: invalid characters.',
                passwordError: null,
                error: null,
            })
            return;
        }
        if (isPasswordWeak(request.password)) {
            setError({
                usernameError: null,
                passwordError: 'Invalid password',
                error: weakPasswordError
            })
            return;
        }
        handleCreateStaff(request, navigate)
            .onExecute((newUser) => {
                // add to staff
                setStaff((prevStaff) => [...prevStaff, newUser]);
                setUserFormData(emptyForm);
            })
            .on(409, () => { //conflict
                setError({
                    usernameError: 'error: username already taken.',
                    passwordError: null,
                    error: null,
                })
            })
            .on(422, () => { //unprocessable entity
                // weak password
                setError({
                    usernameError: null,
                    passwordError: 'Invalid password',
                    error: weakPasswordError
                })
            })
            .execute();
    }
    return (
        <>
            {
                (staff) && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: '1000px',
                        }}>
                            <Typography variant='h5' textAlign={'center'}>Staff</Typography>
                            <CreateStaffUser onCreate={handleOnCreate}
                                usernameError={error.usernameError}
                                passwordError={error.passwordError}
                                userFormData={userFormData}
                                setUserFormData={setUserFormData}
                                error={error.error} />
                            <ViewStaff staff={staff} onDeleteClick={handleDeleteClick} />
                            <AlertDialog
                                open={isAlertOpen}
                                title='Delete User'
                                text={alertText}
                                onYesClicked={deleteUser}
                                onClose={() => setIsAlertOpen(false)} />
                        </div>

                    </div>
                )
            }
        </>
    );
}


export default StaffPage;