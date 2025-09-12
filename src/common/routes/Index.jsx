import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CanvasVisualizerSim from '../../components/CanvasVisualizerSim'
import Home from '../../pages/Home'
import LoginLogoutIcon from '../../components/LoginLogoutIcon'

function Index() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wave" element={<LoginLogoutIcon />} />
        </Routes>
    )
}

export default Index