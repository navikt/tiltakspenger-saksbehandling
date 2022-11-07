import React from 'react';
import { Accordion } from '@navikt/ds-react';
import styles from './ParagraphExpand.module.css';

interface ParagraphExpandProps {
    title: string;
    children: React.ReactNode;
}

const ParagraphExpand = ({ title, children }: ParagraphExpandProps) => {
    return (
        <Accordion style={{ marginTop: '1.5rem' }}>
            <Accordion.Item defaultOpen>
                <Accordion.Header>{title}</Accordion.Header>
                <Accordion.Content className={styles.paragraphExpandContent}>{children}</Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

export default ParagraphExpand;
