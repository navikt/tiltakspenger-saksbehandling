import { classNames } from '~/utils/classNames';
import { VStack, VStackProps } from '@navikt/ds-react';

import style from './MeldekortbehandlingSeksjon.module.css';

type Props = VStackProps;

export const MeldekortbehandlingSeksjon = ({ className, ...rest }: Props) => {
    return <VStack {...rest} className={classNames(style.main, className)} />;
};

const Venstre = ({ className, ...rest }: Props) => {
    return <VStack {...rest} className={classNames(style.venstre, className)} />;
};

const Høyre = ({ className, ...rest }: Props) => {
    return <VStack {...rest} className={classNames(style.høyre, className)} />;
};

const FullBredde = ({ className, ...rest }: Props) => {
    return <VStack {...rest} className={classNames(style.full, className)} />;
};

MeldekortbehandlingSeksjon.Venstre = Venstre;
MeldekortbehandlingSeksjon.Høyre = Høyre;
MeldekortbehandlingSeksjon.FullBredde = FullBredde;
