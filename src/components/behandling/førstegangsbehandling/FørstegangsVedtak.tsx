import { Heading } from '@navikt/ds-react';
import { FørstegangsVedtakBegrunnelse } from './1-begrunnelse/FørstegangsVedtakBegrunnelse';
import { FørstegangsVedtakResultat } from './2-resultat/FørstegangsVedtakResultat';
import { FørstegangsVedtakBrev } from './6-brev/FørstegangsVedtakBrev';
import { Separator } from '../../separator/Separator';
import { FørstegangsVedtakKnapper } from './7-send-og-godkjenn/FørstegangsVedtakKnapper';
import { FørstegangsVedtakBarnetillegg } from './5-barn/FørstegangsVedtakBarnetillegg';
import { FørstegangsVedtakProvider } from './context/FørstegangsVedtakContext';
import { FørstegangsVedtakTiltak } from './4-tiltak/FørstegangsVedtakTiltak';

import style from './FørstegangsVedtak.module.css';
import { FørstegangsVedtakDagerPerMeldeperiode } from './3-dager-per-meldeperiode/FørstegangsVedtakDagerPerMeldeperiode';
import FørstegangsvedtakAvslagsgrunner from './4 - avslagsgrunner/FørstegangsvedtakAvslagsgrunner';

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
            <FørstegangsvedtakAvslagsgrunner />
            <FørstegangsVedtakBarnetillegg />
            <FørstegangsVedtakBrev />
            <FørstegangsVedtakKnapper />
        </FørstegangsVedtakProvider>
    );
};
