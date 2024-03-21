import React, { useState } from 'react';
import { Activity } from '../../../../shared/data';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid';
import parsePhoneNumber from 'libphonenumber-js';
import { useFormEvents } from '../../../helper/reactCustomHooks';
import TitleAndBack from '../../../components/Generic/TitleAndBack/TitleAndBack';

interface ActivityEditPageProps {
    activityInfo: Activity;
    onBackClick: () => void;
    onSaveClick: (activity: Activity) => void;
}
const ActivityEditPage: React.FC<ActivityEditPageProps> = ({ activityInfo, onBackClick, onSaveClick }) => {
    const [activity, setActivity] = useState<Activity>(activityInfo);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [activityNameError, setActivityNameError] = useState<string | null>(null);
    const checkData = () => {
        setPhoneError(null);
        setActivityNameError(null);
        if (activity.activityName.trim() === "") {
            setActivityNameError('Invalid name');
        }
        else if (isValidPhoneNumber()) {
            onSaveClick(activity);
        }
        else
            setPhoneError('Invalid number');
    }
    const [handleInputChange, onSubmit] = useFormEvents<Activity>(setActivity, checkData);
    const isValidPhoneNumber = (): boolean => {
        const phoneNumberPattern = /^(\+\d{1,4})?\d{10,11}$/;
        if (activity.phoneNumber == '')
            return true;
        // Ensure that activity.phoneNumber is defined and matches the pattern
        return (!!activity.phoneNumber && phoneNumberPattern.test(activity.phoneNumber.trim().replace(' ', '')));
    }

    return (
        <div>
            <TitleAndBack title='Edit Activity Info' onBackClick={onBackClick} />

            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Activity Name TextField */}
                    <TextField
                        label="Activity Name"
                        variant="standard"
                        required
                        type='text'
                        value={activity.activityName}
                        name='activityName'
                        onChange={handleInputChange}
                        error={activityNameError !== null}
                        helperText={activityNameError}
                    />
                    <br />
                    {/* Address TextField */}
                    <TextField
                        label="Address"
                        variant="standard"
                        type='text'
                        value={activity.address}
                        name='address'
                        onChange={handleInputChange}
                    />
                    <br />
                    {/* Phone Number TextField */}
                    <TextField
                        label="Phone Number"
                        variant="standard"
                        type='text'
                        value={activity.phoneNumber}
                        name='phoneNumber'
                        onChange={handleInputChange}
                        error={!isValidPhoneNumber()}
                        helperText={phoneError}
                    />
                    <br />
                    {/* Update Button */}
                    <Button variant="contained" type='submit'>
                        Save
                    </Button>

                </div>
            </form>
        </div>
    );
}

export default ActivityEditPage;