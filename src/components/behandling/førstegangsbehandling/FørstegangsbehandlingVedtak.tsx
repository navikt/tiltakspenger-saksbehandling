import { Heading } from '@navikt/ds-react';
import { FørstegangsbehandlingBegrunnelse } from './1-begrunnelse/FørstegangsbehandlingBegrunnelse';
import { FørstegangsbehandlingResultat } from './2-resultat/FørstegangsbehandlingResultat';
import { FørstegangsbehandlingBrev } from './4-brev/FørstegangsbehandlingBrev';
import { Separator } from '../../separator/Separator';
import { FørstegangsbehandlingSend } from './5-send-og-godkjenn/FørstegangsbehandlingSend';

import style from './FørstegangsbehandlingVedtak.module.css';
import { VedtakSeksjon } from '../vedtak/seksjon/VedtakSeksjon';

export const FørstegangsbehandlingVedtak = () => {
    return (
        <>
            <Heading size={'medium'} level={'1'} className={style.header}>
                {'Vedtak (førstegangsbehandling)'}
            </Heading>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre />
                <VedtakSeksjon.Høyre />
            </VedtakSeksjon>
            <FørstegangsbehandlingBegrunnelse />
            <FørstegangsbehandlingResultat />
            <Separator />
            <FørstegangsbehandlingBrev />
            <FørstegangsbehandlingSend />
        </>
    );
};
