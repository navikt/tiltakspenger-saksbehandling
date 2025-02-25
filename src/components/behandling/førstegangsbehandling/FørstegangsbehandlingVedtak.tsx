import { Heading } from '@navikt/ds-react';
import { BehandlingBegrunnelse } from './1-begrunnelse/BehandlingBegrunnelse';
import { BehandlingResultat } from './2-resultat/BehandlingResultat';
import { BehandlingVedtaksBrev } from './3-brev/BehandlingVedtaksBrev';
import { Separator } from '../../separator/Separator';
import { FørstegangsbehandlingSendOgGodkjenn } from './4-send-og-godkjenn/FørstegangsbehandlingSendOgGodkjenn';

import style from './FørstegangsbehandlingVedtak.module.css';

export const FørstegangsbehandlingVedtak = () => {
    return (
        <>
            <Heading size={'medium'} level={'1'} className={style.header}>
                {'Vedtak (førstegangsbehandling)'}
            </Heading>
            <BehandlingBegrunnelse />
            <BehandlingResultat />
            <Separator />
            <BehandlingVedtaksBrev />
            <FørstegangsbehandlingSendOgGodkjenn />
        </>
    );
};
