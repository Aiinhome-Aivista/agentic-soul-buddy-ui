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
import FaqModal from '../modal/FaqModal'
import MembershipPage from '../../pages/MembershipPage'
import TermsPage from '../../pages/TermsPage'
import ContactUs from '../../pages/footer/ContactUs'
import PrivacyPolicy from '../../pages/footer/PrivacyPolicy'
import TermsOfUse from '../../pages/footer/TermsOfUse'
import CookiePolicy from '../../pages/footer/CookiePolicy'
import SubscriptionPolicy from '../../pages/footer/SubscriptionPolicy'
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
    const { contactModal, profileModal, setProfileModal, faqModal, setFaqModal } = useContext(Context);
    return (
        <>
            <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/wave" element={<LoginLogoutIcon />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/sub" element={<SubscriptionPlane />} />
                <Route path="/disclaimer" element={<DisclaimerWrapper />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/subscription-policy" element={<SubscriptionPolicy />} />
            </Routes>
            {contactModal && <ContactModal />}
            {profileModal && <WellBeingProfile onClose={() => setProfileModal(false)} />}
            {faqModal && <FaqModal onClose={() => setFaqModal(false)} />}
        </>
    )
}

export default Index