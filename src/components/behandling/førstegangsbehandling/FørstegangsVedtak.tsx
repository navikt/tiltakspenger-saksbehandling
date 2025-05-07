import { Heading } from '@navikt/ds-react';
import { FørstegangsVedtakBegrunnelse } from './1-begrunnelse/FørstegangsVedtakBegrunnelse';
import { FørstegangsVedtakResultat } from './2-resultat/FørstegangsVedtakResultat';
import { FørstegangsVedtakBrev } from './6-brev/FørstegangsVedtakBrev';
import { Separator } from '../../separator/Separator';
import { FørstegangsVedtakSend } from './7-send-og-godkjenn/FørstegangsVedtakSend';
import { FørstegangsVedtakBarnetillegg } from './5-barn/FørstegangsVedtakBarnetillegg';
import { FørstegangsVedtakProvider } from './context/FørstegangsVedtakContext';
import FørstegangsvedtakAvbrytBehandling from './8-avbryt-behandling/FørstegangsvedtakAvbrytBehandling';
import { FørstegangsVedtakTiltak } from './4-tiltak/FørstegangsVedtakTiltak';

import style from './FørstegangsVedtak.module.css';
import { FørstegangsVedtakDagerPerMeldeperiode } from './3-dager-per-meldeperiode/FørstegangsVedtakDagerPerMeldeperiode';

export const FørstegangsVedtak = () => {
    return (
        <FørstegangsVedtakProvider>
            <Heading size={'medium'} level={'1'} className={style.header}>
                {'Vedtak (førstegangsbehandling)'}
            </Heading>
            <FørstegangsVedtakBegrunnelse />
            <FørstegangsVedtakResultat />
            <FørstegangsVedtakDagerPerMeldeperiode />
            <Separator />
            <FørstegangsVedtakTiltak />
            <FørstegangsVedtakBarnetillegg />
            <FørstegangsVedtakBrev />
            <FørstegangsVedtakSend />
            <FørstegangsvedtakAvbrytBehandling />
        </FørstegangsVedtakProvider>
    );
};
