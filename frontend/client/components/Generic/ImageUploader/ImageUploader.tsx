import React, { useState, ChangeEvent, useRef } from 'react';
import './ImageUploader.css'
import UndoIcon from '@mui/icons-material/Undo';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button, Typography } from '@mui/material';
//import undo from '../../../res/undo.png'
interface ImageUploaderProps {
    imageUrl: string | null;
    uploadImage: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    imageUrl,
    uploadImage,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            // Check if the file is an image
            if (file.type.startsWith('image/')) {
                // Check if the image size is within limits
                if (file.size <= 5 * 1024 * 1024) { // 5MB limit, adjust as needed
                    // Perform additional actions or update state as needed
                    setSelectedFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setSelectedImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Selected image exceeds the size limit (5MB).');
                }
            } else {
                alert('Please select a valid image file.');
            }
        }
    };

    const handleUploadClick = () => {
        if (selectedFile != null) {
            uploadImage(selectedFile);
            setSelectedFile(null);
            setSelectedImage(null);
        }
    };
    const handleUndoClick = () => {
        setSelectedImage(null);
    }
    return (
        <div className="ImageUploader-container">
            {selectedImage ? (
                <div>

                    <div className="ImageUploader-image-container">
                        <img
                            src={selectedImage}
                            alt="Selected Image"
                            className="ImageUploader-image"
                        />
                        <button
                            className="ImageUploader-resetButton"
                            onClick={handleUndoClick}
                        >
                            <UndoIcon />
                        </button>
                    </div>

                    <div className="ImageUploader-button-container">
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            onClick={handleUploadClick}
                        >
                            Upload Icon
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    {imageUrl ? (
                        <>
                            <div className="ImageUploader-image-container">
                                <img
                                    src={imageUrl}
                                    alt="Image"
                                    className="ImageUploader-image"
                                />
                                <div className="ImageUploader-button-container">
                                    <Button
                                        component="label"
                                        variant="contained"
                                        onClick={handleButtonClick}
                                        startIcon={<FileUploadIcon />}
                                    >
                                        Change
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="ImageUploader-image-container">
                                <div className="ImageUploader-placeholder">
                                    <Typography variant='h6' color={'text.secondary'} sx={{
                                        width: '100%',
                                        textAlign: 'center'
                                    }}>No Image</Typography>
                                </div>
                                <div className="ImageUploader-button-container">
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<FileUploadIcon />}
                                        onClick={handleButtonClick}
                                    >
                                        Select Icon
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}


                    <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
