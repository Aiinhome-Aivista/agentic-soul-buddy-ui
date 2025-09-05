import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Guidance from '../../pages/Guidance'
import UserDetails from '../../pages/UserDetails'


function Index() {
    return (
        <Routes>
            <Route path="/" element={<UserDetails />} />
            <Route path="guidance" element={<Guidance />} />
        </Routes>
    )
}

export default Index