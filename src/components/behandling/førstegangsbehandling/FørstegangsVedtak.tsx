import { Heading } from '@navikt/ds-react';
import { FørstegangsVedtakBegrunnelse } from './1-begrunnelse/FørstegangsVedtakBegrunnelse';
import { FørstegangsVedtakResultat } from './2-resultat/FørstegangsVedtakResultat';
import { FørstegangsVedtakBrev } from './4-brev/FørstegangsVedtakBrev';
import { Separator } from '../../separator/Separator';
import { FørstegangsVedtakSend } from './5-send-og-godkjenn/FørstegangsVedtakSend';
import { FørstegangsVedtakBarnetillegg } from './3-barn/FørstegangsVedtakBarnetillegg';
import { FørstegangsVedtakProvider } from './context/FørstegangsVedtakContext';

import style from './FørstegangsVedtak.module.css';
import FørstegangsvedtakAvbrytBehandling from './6-avbryt-behandling/FørstegangsvedtakAvbrytBehandling';

export const FørstegangsVedtak = () => {
    return (
        <FørstegangsVedtakProvider>
            <Heading size={'medium'} level={'1'} className={style.header}>
                {'Vedtak (førstegangsbehandling)'}
            </Heading>
            <FørstegangsVedtakBegrunnelse />
            <FørstegangsVedtakResultat />
            <Separator />
            <FørstegangsVedtakBarnetillegg />
            <Separator />
            <FørstegangsVedtakBrev />
            <FørstegangsVedtakSend />
            <FørstegangsvedtakAvbrytBehandling />
        </FørstegangsVedtakProvider>
    );
};
