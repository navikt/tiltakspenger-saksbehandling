import { Heading } from '@navikt/ds-react';
import { FørstegangsVedtakBegrunnelse } from './1-begrunnelse/FørstegangsVedtakBegrunnelse';
import { FørstegangsVedtakResultat } from './2-resultat/FørstegangsVedtakResultat';
import { FørstegangsVedtakBrev } from './5-brev/FørstegangsVedtakBrev';
import { Separator } from '../../separator/Separator';
import { FørstegangsVedtakSend } from './6-send-og-godkjenn/FørstegangsVedtakSend';
import { FørstegangsVedtakBarnetillegg } from './4-barn/FørstegangsVedtakBarnetillegg';
import { FørstegangsVedtakProvider } from './context/FørstegangsVedtakContext';
import FørstegangsvedtakAvbrytBehandling from './7-avbryt-behandling/FørstegangsvedtakAvbrytBehandling';
import { FørstegangsVedtakTiltak } from './3-tiltak/FørstegangsVedtakTiltak';
import { useFørstegangsbehandling } from '../BehandlingContext';
import { deltarPaFlereTiltak } from '../../../utils/behandling';

import style from './FørstegangsVedtak.module.css';

export const FørstegangsVedtak = () => {
    const { behandling } = useFørstegangsbehandling();
    const flereTiltak = deltarPaFlereTiltak(behandling);
    return (
        <FørstegangsVedtakProvider>
            <Heading size={'medium'} level={'1'} className={style.header}>
                {'Vedtak (førstegangsbehandling)'}
            </Heading>
            <FørstegangsVedtakBegrunnelse />
            <FørstegangsVedtakResultat />
            <Separator />
            {flereTiltak && (
                <>
                    <FørstegangsVedtakTiltak />
                    <Separator />
                </>
            )}
            <FørstegangsVedtakBarnetillegg />
            <FørstegangsVedtakBrev />
            <FørstegangsVedtakSend />
            <FørstegangsvedtakAvbrytBehandling />
        </FørstegangsVedtakProvider>
    );
};
