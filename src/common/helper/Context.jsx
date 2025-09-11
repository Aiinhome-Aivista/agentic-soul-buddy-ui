import { createContext, useState } from 'react'
export const Context = createContext();

export function ContextProvider({ children }) {
    const [recognizedText, setRecognizedText] = useState("")
    const [userData, setUserData] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const [signupModal, setSignupModal] = useState(false)
    const [tempUserName, setTempUserName] = useState("")
    const [tempUserId, setTempUserId] = useState("")
    const [audioUrl, setAudioUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Context.Provider value={{
            recognizedText, setRecognizedText,
            userData, setUserData,
            isLoggedIn, setIsLoggedIn,
            loginModal, setLoginModal,
            signupModal, setSignupModal,
            tempUserName, setTempUserName,
            tempUserId, setTempUserId,
            audioUrl, setAudioUrl,
            isLoading, setIsLoading
        }}>
            {children}
        </Context.Provider>
    )
}