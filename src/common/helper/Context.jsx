import { createContext, useState } from 'react'

export const Context = createContext();

export function ContextProvider({ children }) {
    const [loadGuidance, setLoadGuidance] = useState(false)
    const [recognizedText, setRecognizedText] = useState("")
    const [userData, setUserData] = useState(null)

    return (
        <Context.Provider value={{
            loadGuidance, setLoadGuidance,
            recognizedText, setRecognizedText,
            userData, setUserData
        }}>
            {children}
        </Context.Provider>
    )
}