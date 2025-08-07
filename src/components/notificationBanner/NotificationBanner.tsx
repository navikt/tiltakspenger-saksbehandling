'use client';

import { Alert } from '@navikt/ds-react';

import { useNotification } from '~/context/NotificationContext';
import styles from './NotificationBanner.module.css';
import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';

export interface NotificationBannerRef {
    clearMessage: () => void;
}

const NotificationBanner = forwardRef<NotificationBannerRef>((_, ref) => {
    const { notification, consumeNotification } = useNotification();
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (notification && message === null) {
            const msg = consumeNotification();
            setMessage(msg);
        }
    }, [notification, consumeNotification, message]);

    useImperativeHandle(ref, () => ({
        clearMessage: () => setMessage(null),
    }));

    if (!message) return null;

    return (
        <Alert className={styles.alert} variant="success">
            {message}
        </Alert>
    );
});

NotificationBanner.displayName = 'NotificationBanner';

export default NotificationBanner;
