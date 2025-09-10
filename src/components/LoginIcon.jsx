import React, { useContext } from 'react'
import { Context } from '../common/helper/Context';

function LoginIcon() {
    const { setLoginModal } = useContext(Context)

    return (
        <div className='flex rounded-3xl bg-[#474747]/22 border-2 border-gray-500 p-1 cursor-pointer'
            onClick={() => setLoginModal(true)}>
            <div className='rounded-full h-[1.73rem] w-[1.73rem] bg-[#D9D9D9]/54'></div>
            <p className='text-lg text-[#7D7E7F] px-2'>Login</p>
        </div>
    )
}

export default LoginIcon