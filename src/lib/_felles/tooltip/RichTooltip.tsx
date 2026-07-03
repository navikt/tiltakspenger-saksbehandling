import { Popover, PopoverProps, Portal } from '@navikt/ds-react';
import {
    cloneElement,
    FocusEvent,
    isValidElement,
    MouseEvent,
    ReactElement,
    ReactNode,
    Ref,
    useCallback,
    useState,
} from 'react';
import { classNames } from '~/utils/classNames';

import style from './RichTooltip.module.css';

type AnchorProps = {
    ref?: Ref<HTMLElement>;
    onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
};

type Props = {
    content: ReactNode;
    /** Elementet tooltipen forankres til. Må være ett enkelt element som kan motta en ref. */
    children: ReactElement<AnchorProps>;
    placement?: PopoverProps['placement'];
    offset?: number;
    className?: string;
};

export const RichTooltip = ({ content, children, placement = 'top', offset, className }: Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [open, setOpen] = useState(false);

    const child = isValidElement(children) ? children : null;
    const childRef = child?.props.ref;

    const setRef = useCallback(
        (node: HTMLElement | null) => {
            setAnchorEl(node);
            assignRef(childRef, node);
        },
        [childRef],
    );

    if (!child) {
        return null;
    }

    const anchor = cloneElement(child, {
        ref: setRef,
        onMouseEnter: (event: MouseEvent<HTMLElement>) => {
            child.props.onMouseEnter?.(event);
            setOpen(true);
        },
        onMouseLeave: (event: MouseEvent<HTMLElement>) => {
            child.props.onMouseLeave?.(event);
            setOpen(false);
        },
        onFocus: (event: FocusEvent<HTMLElement>) => {
            child.props.onFocus?.(event);
            setOpen(true);
        },
        onBlur: (event: FocusEvent<HTMLElement>) => {
            child.props.onBlur?.(event);
            setOpen(false);
        },
    });

    return (
        <>
            {anchor}
            <Portal>
                <Popover
                    open={open && anchorEl !== null}
                    onClose={() => setOpen(false)}
                    anchorEl={anchorEl}
                    placement={placement}
                    offset={offset}
                >
                    <Popover.Content className={classNames(style.innhold, className)}>
                        {content}
                    </Popover.Content>
                </Popover>
            </Portal>
        </>
    );
};

const assignRef = (ref: Ref<HTMLElement> | undefined, value: HTMLElement | null) => {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        (ref as { current: HTMLElement | null }).current = value;
    }
};
