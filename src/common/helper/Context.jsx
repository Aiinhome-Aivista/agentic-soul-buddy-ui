import { createContext, useState } from 'react'

export const Context = createContext();

export function ContextProvider({ children }) {
    const [recognizedText, setRecognizedText] = useState("")

    return (
        <Context.Provider value={{
            recognizedText, setRecognizedText
        }}>
            {children}
        </Context.Provider>
    )
}