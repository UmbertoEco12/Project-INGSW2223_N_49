import React from "react";
import LoginPage from './pages/Authentication/LoginPage/LoginPage';
import HomePage from "./pages/HomePage/HomePage";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ChangePasswordPage from "./pages/Authentication/ChangePasswordPage/ChangePasswordPage";
import ChangeUsernamePage from "./pages/Authentication/ChangeUsernamePage/ChangeUsernamePage";
import './helper/webSocketHandler'
import { theme } from './helper/themeManager'
import { ThemeProvider } from '@mui/material/styles';
import CreateAdminPage from "./pages/Authentication/CreateAdminPage";



const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/login" />}>
                    </Route>
                    <Route path='/login' element={<LoginPage></LoginPage>}>
                    </Route>
                    <Route path='/change-username' element={<ChangeUsernamePage />}>
                    </Route>
                    <Route path='/change-password' element={<ChangePasswordPage />}>
                    </Route>
                    <Route path='/home/*' element={<HomePage />}>
                    </Route>
                    <Route path='/admins' element={<CreateAdminPage />}></Route>
                    <Route path="*" element={<h1>Not Found</h1>}></Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>

    );
}

export default App;