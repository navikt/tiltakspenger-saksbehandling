import React from 'react';
import { Alert } from '@navikt/ds-react';
import styles from './AnnenYtelseAlertMessage.module.css';

interface AnnenYtelseAlertMessage {
    heading: string;
    content: React.ReactNode;
}

const AnnenYtelseAlertMessage = ({ heading, content }: AnnenYtelseAlertMessage) => {
    return (
        <Alert className={styles.annenYtelseAlertMessage} variant="error">
            <strong>{heading}</strong>
            {content}
        </Alert>
    );
};

export default AnnenYtelseAlertMessage;
