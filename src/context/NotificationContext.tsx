'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type NotificationContextType = {
    notification: string | null;
    setNotification: (message: string) => void;
    consumeNotification: () => string | null;
    navigateWithNotification: (path: string, message: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notification, setNotificationState] = useState<string | null>(null);
    const router = useRouter();

    const setNotification = useCallback((message: string) => {
        setNotificationState(message);
    }, []);

    const consumeNotification = useCallback(() => {
        const msg = notification;
        setNotificationState(null);
        return msg;
    }, [notification]);

    const navigateWithNotification = useCallback(
        (path: string, message: string) => {
            setNotification(message);
            router.push(path);
        },
        [router, setNotification],
    );

    return (
        <NotificationContext.Provider
            value={{
                notification,
                setNotification,
                consumeNotification,
                navigateWithNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
