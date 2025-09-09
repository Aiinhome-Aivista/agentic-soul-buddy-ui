import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import UserDetails from '../../pages/UserDetails'
import Guidance from '../../pages/Guidance'

function Home() {
    const { loadGuidance, userData } = useContext(Context)
    return (
        <>
            {
                loadGuidance || userData ? <Guidance /> : <UserDetails />
            }
        </>
    )
}

export default Home