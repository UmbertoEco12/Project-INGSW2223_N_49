import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Paper, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface StringSelectorProps {
    label: string;
    allStrings: string[];
    selectedStrings: string[];
    onSelect: (selected: string[]) => void;
    style?: React.CSSProperties;
}

const StringSelector: React.FC<StringSelectorProps> = ({ label, allStrings, selectedStrings, onSelect, style }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setIsExpanded(isExpanded);
    };
    return (
        <>
            {
                allStrings.length > 0 &&
                <Accordion expanded={isExpanded} onChange={handleChange} style={style}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        style={{
                            position: 'relative',
                        }}
                        sx={{
                            backgroundColor: 'transparent !important'
                        }}>
                        <Typography>{label}</Typography>

                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            width: '100%',
                        }}>
                            <div style={{
                                flex: 1
                            }}>
                                <Typography>Not Selected</Typography>
                                {
                                    allStrings.filter((s) => !selectedStrings.includes(s)).map((s, index) => (
                                        <Paper elevation={1} key={s} sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            flexWrap: 'nowrap',
                                            mb: '5px'
                                        }} >
                                            <Typography sx={{
                                                width: '100%'
                                            }}>{s}</Typography>
                                            <IconButton onClick={() => onSelect([...selectedStrings, s])} color='success'>
                                                <AddIcon />
                                            </IconButton>
                                        </Paper>
                                    ))
                                }
                            </div>
                            <div style={{
                                flex: 1
                            }}>
                                <Typography>Selected</Typography>
                                {
                                    selectedStrings.map((s, index) => (
                                        <Paper elevation={1} key={s} sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            flexWrap: 'nowrap'
                                        }}>
                                            <Typography sx={{
                                                width: '100%'
                                            }}>{s}</Typography>
                                            <IconButton onClick={() => onSelect(selectedStrings.filter(st => s !== st))} color='error'>
                                                <RemoveIcon />
                                            </IconButton>
                                        </Paper>
                                    ))
                                }
                            </div>
                        </div>
                    </AccordionDetails>

                </Accordion>
            }

        </>
    );
};

export default StringSelector;
