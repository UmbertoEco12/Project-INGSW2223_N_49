import React, { useState } from 'react';
import { Staff } from '../../../../shared/data';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Select, MenuItem, Menu, Button, Tooltip, Typography, TextField } from '@mui/material';
import { UserRole } from '../../../../shared/data';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MenuButton from '../../Generic/MenuButton/MenuButton';
interface ViewStaffProps {
    staff: Staff[];
    onDeleteClick: (user: Staff) => void;
}
const userPerPage: number = 5;

const ViewStaff: React.FC<ViewStaffProps> = ({ staff, onDeleteClick }) => {
    const [filteredRole, setFilteredRole] = useState<string>('role');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [searchValue, setSearchValue] = useState<string>('');

    function getElementsForPage<T>(array: T[], currentPage: number, itemsPerPage: number) {
        // Calculate the starting index of the current page
        const startIndex = (currentPage - 1) * itemsPerPage;

        // Calculate the ending index of the current page
        const endIndex = startIndex + itemsPerPage;

        // Return the elements for the current page using array slicing
        return array.slice(startIndex, endIndex);
    }
    // apply filters
    let filteredStaff = staff;
    if (filteredRole !== 'role')
        filteredStaff = filteredStaff.filter((user) => user.role === filteredRole);
    if (searchValue !== '')
        filteredStaff = filteredStaff.filter((user) => user.username.includes(searchValue));
    // get pages
    let lastPageNumber = Math.ceil(filteredStaff.length / userPerPage);
    if (lastPageNumber <= 0) lastPageNumber = 1;
    if (currentPage > lastPageNumber) {
        setCurrentPage(lastPageNumber > 0 ? lastPageNumber : 1);
    }
    // get current page staff
    filteredStaff = getElementsForPage(filteredStaff, currentPage, userPerPage);
    // change filtered staff
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{
                                display: 'flex',
                                alignItems: 'center',
                                minHeight: '36px'
                            }}>
                                <Typography component={'a'} >Username</Typography>
                                <TextField style={{ margin: 0, marginLeft: '10px' }} placeholder='Search Username' type='search' variant='standard' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}></TextField>
                            </TableCell>
                            <TableCell align="right" >
                                <MenuButton
                                    text={filteredRole.charAt(0).toUpperCase() + filteredRole.slice(1).toLowerCase()}
                                    tooltip={'Filter by role'}
                                    items={[{ id: 0, name: 'All' }, { id: 1, name: 'Manager' }, { id: 2, name: 'Chef' }, { id: 3, name: 'Waiter' }]}
                                    onItemClick={(item) => {
                                        const roles = ['role', UserRole.Manager, UserRole.Chef, UserRole.Waiter]
                                        setFilteredRole(roles[item.id]);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredStaff.length > 0 ?
                                <>
                                    {
                                        filteredStaff.map((user, index) => (
                                            <TableRow
                                                key={user.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <IconButton color='error' onClick={() => onDeleteClick(user)}> <DeleteIcon /> </IconButton> {user.username}
                                                </TableCell>
                                                <TableCell align="right">{user.role}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                    {/* Draw this row only if the length is greater than user per page*/}
                                    {
                                        lastPageNumber > 1 &&
                                        <>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" width={'100%'} align='center'>
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <IconButton onClick={() => { setCurrentPage(1) }} disabled={currentPage === 1}><KeyboardDoubleArrowLeftIcon /></IconButton>
                                                        <IconButton onClick={() => { setCurrentPage(currentPage <= 1 ? currentPage : currentPage - 1) }} disabled={currentPage === 1}><KeyboardArrowLeftIcon /></IconButton>
                                                        <Typography>
                                                            {currentPage}/{lastPageNumber}
                                                        </Typography>
                                                        <IconButton onClick={() => { setCurrentPage(currentPage >= lastPageNumber ? currentPage : currentPage + 1) }} disabled={currentPage === lastPageNumber}><KeyboardArrowRightIcon /></IconButton>
                                                        <IconButton onClick={() => { setCurrentPage(lastPageNumber) }} disabled={currentPage === lastPageNumber}><KeyboardDoubleArrowRightIcon /></IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    }

                                </>
                                :
                                <>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" width={'100%'} align='center'>
                                            No Users
                                        </TableCell>
                                    </TableRow>
                                </>
                        }
                    </TableBody>
                </Table>
            </TableContainer >
        </>
    );
}

export default ViewStaff;