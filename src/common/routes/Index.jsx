import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import IntroPage from '../../pages/IntroPage'
import Home from '../../pages/Home'
import LoginLogoutIcon from '../../components/LoginLogoutIcon'
import Questionnaire from '../../pages/Questionnaire/Questionnaire'
import SubscriptionPlane from '../modal/SubscribtionPlane'
import DisclaimerModal from '../modal/DisclaimerModal'
import ContactModal from '../modal/ContactModal'
import WellBeingProfile from '../modal/WellBeingProfile'
import TermsModal from '../modal/TermsModal'
import { useContext } from 'react'
import { Context } from '../helper/Context'

const DisclaimerWrapper = () => {
    const navigate = useNavigate();
    return <DisclaimerModal OnClose={() => navigate(-1)} onConfirm={() => navigate(-1)} hideFooter={true} />;
};

const TermsWrapper = () => {
    const navigate = useNavigate();
    return <TermsModal onClose={() => navigate(-1)} />;
};

function Index() {
    const { contactModal, profileModal, setProfileModal } = useContext(Context);
    return (
        <>
            <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/wave" element={<LoginLogoutIcon />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/sub" element={<SubscriptionPlane />} />
                <Route path="/disclaimer" element={<DisclaimerWrapper />} />
                <Route path="/terms" element={<TermsWrapper />} />
            </Routes>
            {contactModal && <ContactModal />}
            {profileModal && <WellBeingProfile onClose={() => setProfileModal(false)} />}
        </>
    )
}

export default Index