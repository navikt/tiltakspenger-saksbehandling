import React from 'react';
import { Accordion as DsAccordion } from '@navikt/ds-react';
import styles from './Accordion.module.css';

interface ParagraphExpandProps {
    title: string;
    children: React.ReactNode;
}

const Accordion = ({ title, children }: ParagraphExpandProps) => {
    return (
        <DsAccordion style={{ marginTop: '1.5rem' }}>
            <DsAccordion.Item defaultOpen>
                <DsAccordion.Header>{title}</DsAccordion.Header>
                <DsAccordion.Content className={styles.accordionContent}>{children}</DsAccordion.Content>
            </DsAccordion.Item>
        </DsAccordion>
    );
};

export default Accordion;
