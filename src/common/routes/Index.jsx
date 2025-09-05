import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Guidance from '../../pages/Guidance'
import UserDetails from '../../pages/UserDetails'
import { Navigate } from 'react-router-dom';

function Index() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="home" replace />} />
            <Route path="/home" element={<UserDetails />} />
            <Route path="guidance" element={<Guidance />} />
        </Routes>
    )
}

export default Index