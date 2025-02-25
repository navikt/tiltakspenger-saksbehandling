import { PropsWithChildren } from 'react';
import { classNames } from '../../../../utils/classNames';

import style from './VedtakSeksjon.module.css';

type Props = PropsWithChildren<{
    className?: string;
}>;

export const VedtakSeksjon = ({ children, className }: Props) => {
    return <div className={classNames(style.main, className)}>{children}</div>;
};

const Venstre = ({ children, className }: Props) => {
    return <div className={classNames(style.venstre, className)}>{children}</div>;
};

const Høyre = ({ children, className }: Props) => {
    return <div className={classNames(style.høyre, className)}>{children}</div>;
};

VedtakSeksjon.Venstre = Venstre;
VedtakSeksjon.Høyre = Høyre;
