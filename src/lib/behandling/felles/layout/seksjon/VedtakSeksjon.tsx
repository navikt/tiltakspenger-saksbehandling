import { HTMLAttributes } from 'react';
import { classNames } from '~/utils/classNames';
import { VStack, VStackProps } from '@navikt/ds-react';

import style from './VedtakSeksjon.module.css';

type Props = HTMLAttributes<HTMLDivElement>;

type UnderSeksjonProps = VStackProps;

export const VedtakSeksjon = ({ children, className }: Props) => {
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

VedtakSeksjon.Venstre = Venstre;
VedtakSeksjon.Høyre = Høyre;
VedtakSeksjon.FullBredde = FullBredde;
