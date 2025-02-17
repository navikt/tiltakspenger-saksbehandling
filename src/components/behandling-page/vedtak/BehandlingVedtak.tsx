import { BehandlingProps } from '../../../types/BehandlingTypes';
import { Heading } from '@navikt/ds-react';
import { BehandlingBegrunnelse } from './begrunnelse/BehandlingBegrunnelse';
import { BehandlingResultat } from './resultat/BehandlingResultat';
import { BehandlingVedtaksBrev } from './brev/BehandlingVedtaksBrev';

import style from './BehandlingVedtak.module.css';

type Props = {
    behandling: BehandlingProps;
};

export const BehandlingVedtak = ({ behandling }: Props) => {
    return (
        <div className={style.outer}>
            <div className={style.inner}>
                <Heading size={'medium'} level={'1'} className={style.header}>
                    {'Vedtak'}
                </Heading>
                <BehandlingBegrunnelse />
                <BehandlingResultat behandling={behandling} />
                <hr className={style.separator} />
                <BehandlingVedtaksBrev />
            </div>
        </div>
    );
};
