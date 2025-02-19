import { Heading } from '@navikt/ds-react';
import { BehandlingBegrunnelse } from './1-begrunnelse/BehandlingBegrunnelse';
import { BehandlingResultat } from './2-resultat/BehandlingResultat';
import { BehandlingVedtaksBrev } from './3-brev/BehandlingVedtaksBrev';
import { Separator } from '../../separator/Separator';
import { BehandlingSendTilBeslutter } from './4-send-og-godkjenn/BehandlingSendTilBeslutter';
import { BehandlingGodkjennVedtak } from './4-send-og-godkjenn/BehandlingGodkjennVedtak';

import style from './BehandlingVedtak.module.css';

export const BehandlingVedtak = () => {
    return (
        <div className={style.outer}>
            <div className={style.inner}>
                <Heading size={'medium'} level={'1'} className={style.header}>
                    {'Vedtak'}
                </Heading>
                <BehandlingBegrunnelse />
                <BehandlingResultat />
                <Separator />
                <BehandlingVedtaksBrev />
                <BehandlingSendTilBeslutter />
                <BehandlingGodkjennVedtak />
            </div>
        </div>
    );
};
