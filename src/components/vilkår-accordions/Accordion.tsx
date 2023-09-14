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

const AccordionItem = ({ title, children, defaultOpen = false, open, onClick }: AccordionProps) => {
    const farge = open ? '#FFFFFF' : '#F2F3F5';
    return (
        <span onClick={onClick}>
            <Accordion.Item
                open={open}
                defaultOpen={defaultOpen}
                style={{ background: `${open ? '#FFFFFF' : '#F2F3F5'}` }}
            >
                <Accordion.Header>{title}</Accordion.Header>
                <Accordion.Content className={styles.accordionContent}>{children}</Accordion.Content>
            </Accordion.Item>
        </span>
    );
};

export { Accordion, AccordionItem };
