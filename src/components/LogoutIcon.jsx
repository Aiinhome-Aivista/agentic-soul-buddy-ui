import React, { useContext } from 'react'
import { Context } from '../common/helper/Context'

function LogoutIcon() {
    const { setIsLoggedIn } = useContext(Context)

    const handleLogout = () => {
        setIsLoggedIn(false);
        sessionStorage.clear();
    }

    return (
        <div className='flex rounded-3xl bg-[#474747]/22 border-2 border-gray-500 p-1 cursor-pointer'
            onClick={handleLogout}>
            <p className='text-lg text-[#7D7E7F] px-2'>Logout</p>
            <div className='rounded-full h-[1.73rem] w-[1.73rem] bg-[#D9D9D9]/54'></div>
        </div>
    )
}

export default LogoutIcon