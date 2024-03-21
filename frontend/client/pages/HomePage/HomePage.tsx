import React, { useState, useEffect } from 'react';
import Navbar, { NavbarItem } from '../../components/Generic/Navbar/Navbar';
import { AuthenticatedUser, removeSession } from '../../helper/user';
import { useCategories, useUserInfo, useMenuItems } from '../../helper/reactCustomHooks';
import { Navigate, Route, Routes, useNavigate, NavigateFunction, Outlet } from 'react-router-dom';
import ActivityPage from "../ActivityInfo/ActivityPage/ActivityPage";
import StaffPage from "../StaffPage/StaffPage";
import EditMenuPage from "../MenuEdit/EditMenuPage/EditMenuPage";
import TakeOrdersPage from '../WaiterOrdersPage/TakeOrdersPage/TakeOrdersPage';

function getUserPage(user: AuthenticatedUser, navigate: NavigateFunction): NavbarItem[] {
    switch (user.role) {
        case 'admin':
            return [
                { name: 'Activity', onClick: () => { navigate('activity') } },
                { name: 'Staff', onClick: () => { navigate('staff') } },
                { name: 'Menu', onClick: () => { navigate('menu') } },
            ];
        case 'manager':
            return [
                { name: 'Menu', onClick: () => { navigate('menu') } },
                { name: 'Cash', onClick: () => { navigate('orders/cash') } }
            ];
        case 'chef':
            return [
                { name: 'Kitchen', onClick: () => { navigate('orders/kitchen') } },
            ];
        case 'waiter':
            return [
                { name: 'Orders', onClick: () => { navigate('orders') } },
            ];
    }
    return [];
}

function getStartingPage(user: AuthenticatedUser): string {
    switch (user.role) {
        case 'admin':
            return '/home/activity';
        case 'manager':
            return '/home/menu';
        case 'chef':
            return '/home/orders';
        case 'waiter':
            return '/home/orders';
    }
    return '/home/menu';
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const user = useUserInfo(navigate);

    return (
        <div>
            {
                (user) && (
                    <>
                        <Navbar username={user.username} userSettings={
                            [
                                { id: 0, name: "Change Username" },
                                { id: 1, name: "Change Password" },
                                { id: 2, name: "Logout" }
                            ]}
                            onUserSettingSelected={({ id, name }) => {
                                if (id === 0) {
                                    navigate('/change-username');
                                }
                                else if (id === 1) {
                                    navigate('/change-password');
                                }
                                else {
                                    removeSession();
                                    navigate('/login');
                                }
                            }}

                            elements={getUserPage(user, navigate)}></Navbar>
                        <Routes>
                            {/* Changes based on user type */}
                            <Route path="/" element={
                                <Navigate
                                    replace to={getStartingPage(user)} />} />
                            <Route path='activity/*' element={<ActivityPage user={user} navigate={navigate} />}></Route>
                            <Route path='staff' element={<StaffPage user={user} navigate={navigate} />}></Route>
                            <Route path='menu/*' element={
                                <EditMenuPage navigate={navigate} />}></Route>
                            <Route path='orders/*' element={<TakeOrdersPage user={user} />}></Route>

                        </Routes>
                    </>

                )
            }

        </div>
    );
}

export default HomePage;