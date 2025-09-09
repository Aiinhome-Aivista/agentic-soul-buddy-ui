import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../layout/Home';
import Guidance from '../../pages/Guidance';

function Index() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="guidance" element={<Guidance />} />
        </Routes>
    )
}

export default Index