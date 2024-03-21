import React from 'react';

import { Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface TitleAndBackProps {
    title: string;
    onBackClick: () => void;
}

const TitleAndBack: React.FC<TitleAndBackProps> = ({ title, onBackClick }) => {
    return (
        <>
            <Button aria-label="back" onClick={onBackClick} style={{ position: 'absolute', left: 0, marginTop: '10px' }}>
                <ArrowBackIcon /> BACK
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '10px' }}>
                {/* Title centered */}
                <Typography variant='h3' style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
                    {title}
                </Typography>
            </div>
        </>
    )
}

export default TitleAndBack;