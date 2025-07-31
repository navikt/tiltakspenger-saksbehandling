'use client';

import { Alert } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useNotification } from '~/context/NotificationContext';
import styles from './NotificationBanner.module.css';

export function NotificationBanner() {
    const { notification, consumeNotification } = useNotification();
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (notification && message === null) {
            const msg = consumeNotification();
            setMessage(msg);
        }
    }, [notification, consumeNotification, message]);

    if (!message) return null;

    return (
        <Alert className={styles.alert} variant="success">
            {message}
        </Alert>
    );
}
