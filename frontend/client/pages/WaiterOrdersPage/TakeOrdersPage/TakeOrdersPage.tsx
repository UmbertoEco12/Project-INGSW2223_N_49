import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useCategories, useMenuItems, useOrders } from '../../../helper/reactCustomHooks';
import { Order } from '../../../../shared/data';
import ViewOrdersPage from '../ViewOrdersPage/ViewOrdersPage';
import UpdateOrderPage from '../UpdateOrderPage/UpdateOrderPage';
import ChefOrdersPage from '../../ChefOrdersPage/ChefOrdersPage';
import ManagerOrdersPage from '../../ManagerOrderPage/ManagerOrdersPage';
import CreateOrderPage from '../CreateOrderPage/CreateOrderPage';
import { AuthenticatedUser } from '../../../helper/user';

function getStartingPage(user: AuthenticatedUser): string {
    switch (user.role) {
        case 'admin':
            return '/home/';
        case 'manager':
            return '/home/orders/cash';
        case 'chef':
            return '/home/orders/kitchen';
        case 'waiter':
            return '/home/orders/view';
    }
    return '/home/';
}

interface TakeOrdersPageProps {
    user: AuthenticatedUser;
}

const TakeOrdersPage: React.FC<TakeOrdersPageProps> = ({ user }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useCategories(navigate);
    const [items, setItems] = useMenuItems(navigate);
    const [orders, setOrders] = useOrders(navigate);

    const onUpdateOrderClick = (order: Order) => {
        //setItemToUpdate(order);
        navigate(`edit/${order.id}`);
    }

    return (
        <>
            {
                (categories && items && orders) && (

                    <>
                        <Routes>
                            <Route path="/" element={
                                <Navigate
                                    replace to={getStartingPage(user)} />} />
                            <Route path="view" element={
                                <ViewOrdersPage
                                    orders={orders.filter((order) => order.userId == user.id)}
                                    onUpdateOrderClick={onUpdateOrderClick}
                                    onCreateOrderClick={() => navigate("create")} />} />
                            <Route path="create/*" element={
                                <CreateOrderPage
                                    items={items}
                                    categories={categories}
                                    navigate={navigate} />} />
                            <Route path="edit/:id/*" element={
                                <>
                                    <UpdateOrderPage
                                        orders={orders}
                                        menuItems={items}
                                        categories={categories}
                                        navigate={navigate}
                                    />
                                </>
                            } />

                            <Route path="kitchen" element={
                                <ChefOrdersPage orders={orders} navigate={navigate} />
                            }

                            ></Route>
                            <Route path="cash" element={
                                <ManagerOrdersPage orders={orders} navigate={navigate} />
                            }
                            ></Route>
                        </Routes>

                    </>
                )
            }
        </>
    );
}

export default TakeOrdersPage;