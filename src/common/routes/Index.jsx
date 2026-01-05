import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import IntroPage from '../../pages/IntroPage'
import Home from '../../pages/Home'
import LoginLogoutIcon from '../../components/LoginLogoutIcon'
import Questionnaire from '../../pages/Questionnaire/Questionnaire'
import SubscriptionPlane from '../modal/SubscribtionPlane'
import DisclaimerModal from '../modal/DisclaimerModal'

const DisclaimerWrapper = () => {
    const navigate = useNavigate();
    return <DisclaimerModal OnClose={() => navigate(-1)} onConfirm={() => navigate(-1)} hideFooter={true} />;
};

function Index() {
    return (
        <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/wave" element={<LoginLogoutIcon />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/sub" element={<SubscriptionPlane />} />
            <Route path="/disclaimer" element={<DisclaimerWrapper />} />
        </Routes>
    )
}

export default Index