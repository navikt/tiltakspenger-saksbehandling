import { Heading } from '@navikt/ds-react';
import { SøknadsbehandlingBegrunnelse } from './1-begrunnelse/SøknadsbehandlingBegrunnelse';
import { SøknadsbehandlingResultatVelger } from './2-resultat/SøknadsbehandlingResultatVelger';
import { SøknadsbehandlingBrev } from './6-brev/SøknadsbehandlingBrev';
import { Separator } from '../../separator/Separator';
import { SøknadsbehandlingKnapper } from './7-send-og-godkjenn/SøknadsbehandlingKnapper';
import { SøknadsbehandlingBarnetillegg } from './5-barn/SøknadsbehandlingBarnetillegg';
import { SøknadsbehandlingVedtakProvider } from './context/SøknadsbehandlingVedtakContext';
import { SøknadsbehandlingTiltak } from './4-tiltak/SøknadsbehandlingTiltak';
import SøknadsbehandlingAvslagsgrunner from '~/components/behandling/søknadsbehandling/4-avslagsgrunner/SøknadsbehandlingAvslagsgrunner';

import style from './SøknadsbehandlingVedtak.module.css';
import SøknadsbehandlingDagerPerMeldeperiode from './3-dager-per-meldeperiode/SøknadsbehandlingDagerPerMeldeperiode';

export const SøknadsbehandlingVedtak = () => {
    return (
        <SøknadsbehandlingVedtakProvider>
            <Heading size={'medium'} level={'3'} className={style.header}>
                {'Vedtak (søknadsbehandling)'}
            </Heading>
            <SøknadsbehandlingBegrunnelse />
            <SøknadsbehandlingResultatVelger />
            <SøknadsbehandlingDagerPerMeldeperiode />
            <Separator />
            <SøknadsbehandlingTiltak />
            <SøknadsbehandlingAvslagsgrunner />
            <SøknadsbehandlingBarnetillegg />
            <SøknadsbehandlingBrev />
            <SøknadsbehandlingKnapper />
        </SøknadsbehandlingVedtakProvider>
    );
};
