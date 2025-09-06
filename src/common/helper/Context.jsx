import { createContext, useState } from 'react'

export const Context = createContext();

export function ContextProvider({ children }) {
    const [loadGuidance, setLoadGuidance] = useState(false)
    const [recognizedText, setRecognizedText] = useState("")

    return (
        <Context.Provider value={{
            loadGuidance, setLoadGuidance,
            recognizedText, setRecognizedText
        }}>
            {children}
        </Context.Provider>
    )
}