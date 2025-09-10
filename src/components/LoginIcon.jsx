import React, { useContext } from 'react'
import { Context } from '../common/helper/Context';

function LoginIcon() {
    const { setLoginModal } = useContext(Context)

    return (
        <div className='flex items-center rounded-3xl bg-[#474747]/22 border-2 border-gray-500 p-1'>
            <div className='rounded-full h-[1rem] w-[1rem] bg-[#D9D9D9]/54 cursor-pointer'
                onClick={() => setLoginModal(true)}></div>
            <p className='flex items-center justify-center text-sm text-[#7D7E7F] px-1 cursor-default'>Login</p>
        </div>
    )
}

export default LoginIcon