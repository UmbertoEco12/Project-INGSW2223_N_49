import React, { useState, useEffect } from 'react';
import './ActivityViewPage.css'
import { Activity } from '../../../../shared/data';
import ImageUploader from '../../../components/Generic/ImageUploader/ImageUploader';
import { Button, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';

interface ActivityViewPageProps {
    iconUrl: string | null;
    uploadIcon: (file: File) => void;
    activityInfo: Activity;
    onEditClick: () => void;
}

const ActivityViewPage: React.FC<ActivityViewPageProps> = ({ iconUrl, uploadIcon, activityInfo, onEditClick }) => {


    return (
        <>
            <div className="activity-container">
                <div className="image-uploader">
                    <ImageUploader imageUrl={iconUrl} uploadImage={uploadIcon} />
                </div>
                <div className="activity-details">
                    {/* Other content */}
                    <Typography variant="h4"> {activityInfo.activityName}</Typography>
                    <Typography variant="h6" component="a"><LocationOnIcon /> {activityInfo.address === "" ? "Not specified" : activityInfo.address}</Typography>
                    <br />
                    <Typography variant="h6" component="a"><PhoneIcon /> {activityInfo.phoneNumber === "" ? "Not specified" : activityInfo.phoneNumber}</Typography>
                    <br />
                    <Button
                        variant="contained"
                        onClick={onEditClick}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                </div>
            </div>

        </>
    )
}

export default ActivityViewPage;