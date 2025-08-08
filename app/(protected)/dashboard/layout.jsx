"use client"
import React, { useState } from 'react'
import Sidebar from "../_components/Sidebar"
import { useAuth } from "../../Context/AuthContext"
import LoadingOverlay from './../../_components/LoadingOverlay';
import {Provider} from "react-redux";
import store from "@/app/Store/store";
import { useSearchParams } from 'next/navigation'

const DashboardLayout = ({
    admin,
    giangvien,
    user
}) => {
    const searchParams = useSearchParams()
    const selectedRole = searchParams.get('role')
    const { user: currentUser, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (loading) {
        return <LoadingOverlay />
    }

    const renderContent = () => {
        const userName = currentUser?.result?.username;  
        const roles = currentUser?.result?.roles || [];  

        const roleNames = roles.map(role => role.name); 

        if ( selectedRole === 'ADMIN'  && roleNames.includes('ADMIN')) {
            return (
                <>
                    {/* <p>Hello, {userName} (ADMIN)</p> */}
                    {admin}
                </>
            );
        } else if (selectedRole === 'INSTRUCTOR' && roleNames.includes('INSTRUCTOR')) {
            return (
                <>
                    {/* <p>Hello, {userName} (INSTRUCTOR)</p> */}
                    {giangvien}
                </>
            );
        } else {
            return (
                <>
                    <p>Hello, {userName} (USER)</p>
                    {user}
                </>
            );
        }
    };

    return (
        <Provider store={store} >
            <div className="flex min-h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
                {renderContent()}
            </main>
        </div>
        </Provider>
    )
}

export default DashboardLayout