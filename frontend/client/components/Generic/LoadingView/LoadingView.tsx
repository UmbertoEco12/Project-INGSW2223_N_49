import React from "react";
import { Backdrop, CircularProgress } from '@mui/material';

interface LoadingViewProps {
    isOpen: boolean;
}

const LoadingView: React.FC<LoadingViewProps> = ({ isOpen }) => {

    return (
        <Backdrop open={isOpen} onClick={(e) => {
            e.stopPropagation();
        }} sx={{
            zIndex: '100'
        }}>
            <CircularProgress />
        </Backdrop>
    )
}

export default LoadingView;