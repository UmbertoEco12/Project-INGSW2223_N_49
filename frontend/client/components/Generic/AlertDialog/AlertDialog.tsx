import React, { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export interface AlertDialogProps {
    open: boolean;
    title: string;
    text: string;
    onYesClicked: () => void;
    onNoClicked?: () => void;
    onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, title, text, onYesClicked, onNoClicked = () => { }, onClose }) => {

    const onYes = () => {
        onYesClicked();
        onClose();
    }

    const onNo = () => {
        onNoClicked();
        onClose();
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onNo}>No</Button>
                    <Button onClick={onYes}>Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AlertDialog;