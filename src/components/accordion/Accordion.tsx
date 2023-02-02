import React from 'react';
import { Accordion } from '@navikt/ds-react';
import styles from './Accordion.module.css';
import { AccordionItemProps } from '@navikt/ds-react/esm/accordion/AccordionItem';

interface AccordionProps extends AccordionItemProps {
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

const AccordionItem = ({ title, children, defaultOpen = true, open, onClick, disabled }: AccordionProps) => {
    return (
        <span onClick={onClick}>
            <Accordion.Item defaultOpen={defaultOpen && !disabled}>
                <Accordion.Header disabled={disabled} className={`${disabled && styles.accordionDisabled}`}>
                    {title}
                </Accordion.Header>
                <Accordion.Content className={styles.accordionContent}>{children}</Accordion.Content>
            </Accordion.Item>
        </span>
    );
};

export { Accordion, AccordionItem };
