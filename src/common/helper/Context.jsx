import { createContext, useState } from 'react'

export const Context = createContext();

export function ContextProvider({ children }) {
    const [recognizedText, setRecognizedText] = useState("")
    const [userData, setUserData] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const [signupCompletionModal, setSignupCompletionModal] = useState(false)

    return (
        <Context.Provider value={{
            recognizedText, setRecognizedText,
            userData, setUserData,
            isLoggedIn, setIsLoggedIn,
            loginModal, setLoginModal,
            signupCompletionModal, setSignupCompletionModal
        }}>
            {children}
        </Context.Provider>
    )
}