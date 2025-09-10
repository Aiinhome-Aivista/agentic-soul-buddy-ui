import React, { useContext } from 'react'
import { Context } from '../common/helper/Context'

function LogoutIcon() {
    const { setIsLoggedIn } = useContext(Context)

    const handleLogout = () => {
        setIsLoggedIn(false);
        sessionStorage.clear();
    }

    return (
        <div className='flex items-center rounded-3xl bg-[#474747]/22 border-2 border-gray-500 p-1'>
            <p className='flex items-center justify-center text-sm text-[#7D7E7F] px-1 cursor-default'>Logout</p>
            <div className='rounded-full h-[1rem] w-[1rem] bg-[#D9D9D9]/54 cursor-pointer'
                onClick={handleLogout}></div>
        </div>
    )
}

export default LogoutIcon