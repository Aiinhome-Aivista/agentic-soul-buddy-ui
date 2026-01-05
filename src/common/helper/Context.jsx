import { createContext, useState } from 'react'
export const Context = createContext();

export function ContextProvider({ children }) {
    const [recognizedText, setRecognizedText] = useState("")
    const [userData, setUserData] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const [signupModal, setSignupModal] = useState(false)
    const [signupModal2, setSignupModal2] = useState(false)
    const [tempUserName, setTempUserName] = useState("")
    const [tempUserId, setTempUserId] = useState("")
    const [audioUrl, setAudioUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [termsModal, setTermsModal] = useState(false);
    const [faqModal, setFaqModal] = useState(false);

    return (
        <Context.Provider value={{
            recognizedText, setRecognizedText,
            userData, setUserData,
            isLoggedIn, setIsLoggedIn,
            loginModal, setLoginModal,
            signupModal, setSignupModal,
            signupModal2, setSignupModal2,
            tempUserName, setTempUserName,
            tempUserId, setTempUserId,
            audioUrl, setAudioUrl,
            isLoading, setIsLoading,
            contactModal, setContactModal,
            profileModal, setProfileModal,
            termsModal, setTermsModal,
            faqModal, setFaqModal
        }}>
            {children}
        </Context.Provider>
    )
}