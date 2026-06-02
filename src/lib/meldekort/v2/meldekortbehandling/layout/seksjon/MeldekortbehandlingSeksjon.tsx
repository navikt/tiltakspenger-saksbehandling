import { HTMLAttributes } from 'react';
import { classNames } from '~/utils/classNames';
import { VStack, VStackProps } from '@navikt/ds-react';

import style from './MeldekortbehandlingSeksjon.module.css';

type Props = HTMLAttributes<HTMLDivElement>;

type UnderSeksjonProps = VStackProps;

export const MeldekortbehandlingSeksjon = ({ children, className }: Props) => {
    return <div className={classNames(style.main, className)}>{children}</div>;
};

const Venstre = ({ className, ...rest }: UnderSeksjonProps) => {
    return <VStack {...rest} className={classNames(style.venstre, className)} />;
};

const Høyre = ({ className, ...rest }: UnderSeksjonProps) => {
    return <VStack {...rest} className={classNames(style.høyre, className)} />;
};

const FullBredde = ({ className, ...rest }: UnderSeksjonProps) => {
    return <VStack {...rest} className={classNames(style.full, className)} />;
};

MeldekortbehandlingSeksjon.Venstre = Venstre;
MeldekortbehandlingSeksjon.Høyre = Høyre;
MeldekortbehandlingSeksjon.FullBredde = FullBredde;
