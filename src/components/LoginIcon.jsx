import React, { useContext } from 'react'
import { Context } from '../common/helper/Context';

function LoginIcon() {
    const { setLoginModal } = useContext(Context)

    return (
        <div className='flex items-center rounded-3xl bg-[#474747]/22 border-2 border-gray-500 p-1'>
            <div
                className='rounded-full h-4 w-4 bg-[#D9D9D9]/54 cursor-pointer'
                onClick={() => setLoginModal(true)}
            />
            <p className='flex items-center justify-center text-sm text-[#7D7E7F] px-1 py-0 h-3'>Login</p>
        </div>
    )
}

export default LoginIcon