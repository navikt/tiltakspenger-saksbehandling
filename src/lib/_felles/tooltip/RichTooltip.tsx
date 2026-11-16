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
    useEffect,
    useRef,
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
    /** Hindrer at tooltipen vises, uten å endre elementet den forankres til. */
    deaktivert?: boolean;
    /**
     * Holder tooltipen åpen så lenge pekeren er over selve tooltipen, f.eks. for å kunne markere og kopiere innholdet.
     * Lukkingen utsettes litt når pekeren forlater elementet, slik at den rekker å flyttes over i tooltipen.
     */
    holdÅpenVedHover?: boolean;
};

const lukkeforsinkelseMs = 150;

export const RichTooltip = ({
    content,
    children,
    placement = 'top',
    offset,
    className,
    deaktivert = false,
    holdÅpenVedHover = false,
}: Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [open, setOpen] = useState(false);
    const lukketimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const avbrytLukking = useCallback(() => {
        if (lukketimer.current !== null) {
            clearTimeout(lukketimer.current);
            lukketimer.current = null;
        }
    }, []);

    const åpne = useCallback(() => {
        avbrytLukking();
        setOpen(true);
    }, [avbrytLukking]);

    const lukk = useCallback(() => {
        avbrytLukking();
        if (holdÅpenVedHover) {
            lukketimer.current = setTimeout(() => setOpen(false), lukkeforsinkelseMs);
        } else {
            setOpen(false);
        }
    }, [avbrytLukking, holdÅpenVedHover]);

    useEffect(() => avbrytLukking, [avbrytLukking]);

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
            åpne();
        },
        onMouseLeave: (event: MouseEvent<HTMLElement>) => {
            child.props.onMouseLeave?.(event);
            lukk();
        },
        onFocus: (event: FocusEvent<HTMLElement>) => {
            child.props.onFocus?.(event);
            åpne();
        },
        onBlur: (event: FocusEvent<HTMLElement>) => {
            child.props.onBlur?.(event);
            lukk();
        },
    });

    return (
        <>
            {anchor}
            <Portal>
                <Popover
                    open={open && !deaktivert && anchorEl !== null}
                    onClose={() => {
                        avbrytLukking();
                        setOpen(false);
                    }}
                    anchorEl={anchorEl}
                    placement={placement}
                    offset={offset}
                    onMouseEnter={holdÅpenVedHover ? åpne : undefined}
                    onMouseLeave={holdÅpenVedHover ? lukk : undefined}
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
