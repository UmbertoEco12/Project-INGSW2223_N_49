import React, { useState, useEffect } from 'react';
import { Activity } from '../../../../shared/data';
import { Navigate, NavigateFunction, Route, Routes } from 'react-router-dom';
import { useActivityInfo } from '../../../helper/reactCustomHooks';
import { handleUpdateActivity, handleUploadActivityIcon } from '../../../helper/userRequestHandler';
import ActivityViewPage from '../ActivityViewPage/ActivityViewPage';
import { AuthenticatedUser } from '../../../helper/user';
import ActivityEditPage from '../ActivityEditPage/ActivityEditPage';

interface ActivityPageProps {
    user: AuthenticatedUser;
    navigate: NavigateFunction;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ user, navigate }) => {
    const [activity, setActivity] = useActivityInfo(navigate);

    const onSave = (activity: Activity) => {
        // send update request
        handleUpdateActivity(
            {
                activityName: activity.activityName,
                phoneNumber: activity.phoneNumber,
                address: activity.address
            }, navigate)
            .onExecute((response) => {
                setActivity(response);
                navigate('activity/view');
            })
            .execute();
    }

    const uploadFile = (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        handleUploadActivityIcon(formData, navigate)
            .onExecute((iconUrl) => {
                setActivity((prevData) => {
                    if (prevData !== null) {
                        return {
                            ...prevData,
                            icon: iconUrl,
                        };
                    }
                    return prevData;
                });
            }).execute();
    }

    let iconUrl: string | null = null;
    if (activity?.icon) {
        iconUrl = `/api/icon/${activity.icon}`;
    }
    return (
        <div>
            {
                (activity) && (
                    <Routes>
                        <Route path="/" element={<Navigate to="view" />}></Route>
                        <Route path="view" element={
                            <ActivityViewPage iconUrl={iconUrl} uploadIcon={uploadFile} activityInfo={activity} onEditClick={() => navigate('activity/edit')} />
                        }></Route>
                        <Route path="edit" element={
                            <ActivityEditPage activityInfo={activity} onBackClick={() => navigate('activity/view')} onSaveClick={onSave} />
                        }></Route>
                    </Routes>
                )

            }

        </div>
    );
}

export default ActivityPage;