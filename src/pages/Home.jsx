import React, { useContext, useEffect, useState, useCallback } from 'react';
import AiChat from './AiChat';
import BackgroundAudioProvider from '../common/helper/BackgroundAudioProvider';
import { Context } from '../common/helper/Context';

function Home() {
    const { setIsLoggedIn } = useContext(Context);
    const [userId, setUserId] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    const SessionHolder = useCallback(() => {
        const uid = localStorage.getItem('userId');
        const sid = localStorage.getItem('sessionId');
        setUserId(uid);
        setSessionId(sid);
        if (uid && sid) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [setIsLoggedIn]);

    const handleStorageChange = useCallback((event) => {
        if (!event) return;
        if (event.key === 'userId' || event.key === 'sessionId' || event.key === null) {
            SessionHolder();
        }
    }, [SessionHolder]);

    useEffect(() => {
        SessionHolder();
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [handleStorageChange, SessionHolder]);

    return (
        <BackgroundAudioProvider>
            <div className='w-[100%] h-screen p-[0.5rem]'>
                <AiChat />
            </div>
        </BackgroundAudioProvider>
    );
}

export default Home;
