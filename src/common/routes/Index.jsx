import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CanvasVisualizerSim from '../../components/CanvasVisualizerSim'
import Home from '../../pages/Home'

function Index() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wave" element={<CanvasVisualizerSim />} />
        </Routes>
    )
}

export default Index