import React from 'react'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'

import IntroPage from '../../pages/IntroPage'
import Home from '../../pages/Home'
import LoginLogoutIcon from '../../components/LoginLogoutIcon'
import Questionnaire from '../../pages/Questionnaire/Questionnaire'
import DisclaimerModal from '../modal/DisclaimerModal'
import ContactModal from '../modal/ContactModal'
import WellBeingProfile from '../modal/WellBeingProfile'
import TermsModal from '../modal/TermsModal'
import FaqModal from '../modal/FaqModal'
import SignupModal2 from '../modal/signupafterquestions';
import { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import GoogleAnalyticsTracker from '../helper/GoogleAnalyticsTracker'

// Legal Pages
import PrivacyPolicy from '../../pages/legal/PrivacyPolicy'
import CookiePolicy from '../../pages/legal/CookiePolicy'
import SubscriptionPolicy from '../../pages/legal/SubscriptionPolicy'
import TermsOfUse from '../../pages/legal/TermsOfUse'
import SubscriptionPlansLegal from '../../pages/legal/SubscriptionPlansLegal'

// Support Pages
import ContactPage from '../../pages/support/ContactPage'
import SubscriptionPage from '../../pages/SubscriptionPage'
import PaymentPage from '../../pages/PaymentPage'


const DisclaimerWrapper = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Need useLocation imported? It's not imported in original snippet but used in logic I plan. Wait, I checked imports and useLocation is NOT imported.
    const [showSignup, setShowSignup] = useState(false);

    // answers passed from Questionnaire
    const answers = location.state?.answers;

    const handleConfirm = () => {
        setShowSignup(true);
    };

    const handleSignupSuccess = () => {
        navigate('/subscription', { state: { isNewSignup: true } });
    };

    if (showSignup) {
        return <SignupModal2 OnClose={() => navigate('/')} onSuccess={handleSignupSuccess} answers={answers} />;
    }

    return <DisclaimerModal OnClose={() => navigate(-1)} onConfirm={handleConfirm} />;
};

const TermsWrapper = () => {
    const navigate = useNavigate();
    return <TermsModal onClose={() => navigate(-1)} />;
};

function Index() {
    const { contactModal, profileModal, setProfileModal, faqModal, setFaqModal } = useContext(Context);
    return (
        <>
            <GoogleAnalyticsTracker />
            <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/wave" element={<LoginLogoutIcon />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/disclaimer" element={<DisclaimerWrapper />} />
                <Route path="/terms" element={<TermsWrapper />} />

                {/* Legal Pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/subscription-policy" element={<SubscriptionPolicy />} />
                <Route path="/pricing" element={<SubscriptionPlansLegal />} />

                {/* Support Pages */}
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/payment" element={<PaymentPage />} />
            </Routes>
            {contactModal && <ContactModal />}
            {profileModal && <WellBeingProfile onClose={() => setProfileModal(false)} />}
            {faqModal && <FaqModal onClose={() => setFaqModal(false)} />}
        </>
    )
}

export default Index