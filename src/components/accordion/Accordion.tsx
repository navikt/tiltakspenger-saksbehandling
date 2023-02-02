import React from 'react';
import { Accordion } from '@navikt/ds-react';
import styles from './Accordion.module.css';
import { AccordionItemProps } from '@navikt/ds-react/esm/accordion/AccordionItem';

interface AccordionProps extends AccordionItemProps {
    title: string;
    children: React.ReactNode;
}

const AccordionItem = ({ title, children, defaultOpen = true, open }: AccordionProps) => {
    return (
        <Accordion.Item style={{ marginTop: '1.5rem' }} open={open} defaultOpen={defaultOpen}>
            <Accordion.Header>{title}</Accordion.Header>
            <Accordion.Content className={styles.accordionContent}>{children}</Accordion.Content>
        </Accordion.Item>
    );
};

export { Accordion, AccordionItem };
