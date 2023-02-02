import React from 'react';
import { Accordion as DsAccordion } from '@navikt/ds-react';
import styles from './Accordion.module.css';
import { AccordionItemProps } from '@navikt/ds-react/esm/accordion/AccordionItem';

interface AccordionProps extends AccordionItemProps {
    title: string;
    children: React.ReactNode;
}

const Accordion = ({ title, children, defaultOpen = true, open }: AccordionProps) => {
    return (
        <DsAccordion style={{ marginTop: '1.5rem' }}>
            <DsAccordion.Item open={open} defaultOpen={defaultOpen}>
                <DsAccordion.Header>{title}</DsAccordion.Header>
                <DsAccordion.Content className={styles.accordionContent}>{children}</DsAccordion.Content>
            </DsAccordion.Item>
        </DsAccordion>
    );
};

export default Accordion;
