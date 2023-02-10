import React from 'react';
import { Accordion } from '@navikt/ds-react';
import styles from './Accordion.module.css';
import { AccordionItemProps } from '@navikt/ds-react/esm/accordion/AccordionItem';

interface AccordionProps extends AccordionItemProps {
    title: string;
    children: React.ReactNode;
    open?: boolean;
    onClick?: () => void;
}

const AccordionItem = ({ title, children, defaultOpen = true, open, onClick }: AccordionProps) => {
    return (
        <span onClick={onClick}>
            <Accordion.Item open={open} defaultOpen={defaultOpen}>
                <Accordion.Header>{title}</Accordion.Header>
                <Accordion.Content className={styles.accordionContent}>{children}</Accordion.Content>
            </Accordion.Item>
        </span>
    );
};

export { Accordion, AccordionItem };
