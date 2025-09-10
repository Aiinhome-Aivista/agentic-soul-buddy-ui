import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from '../../pages/Homepage'
import CanvasVisualizerSim from '../../components/CanvasVisualizerSim'

function Index() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/wave" element={<CanvasVisualizerSim />} />
        </Routes>
    )
}

export default Index