import React from 'react'
import { Route, Routes } from 'react-router-dom'

import IntroPage from '../../pages/IntroPage'
import Home from '../../pages/Home'
import LoginLogoutIcon from '../../components/LoginLogoutIcon'
import Questionnaire from '../../pages/Questionnaire/Questionnaire'
import SubscriptionPlane from '../modal/SubscribtionPlane'

function Index() {
    return (
        <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/wave" element={<LoginLogoutIcon />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/sub" element={<SubscriptionPlane />} />
        </Routes>
    )
}



export default Index