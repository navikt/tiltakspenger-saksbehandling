import { Heading } from '@navikt/ds-react';
import { SøknadsbehandlingBegrunnelse } from '~/components/behandling/søknadsbehandling/2-begrunnelse/SøknadsbehandlingBegrunnelse';
import { SøknadsbehandlingResultatVelger } from '~/components/behandling/søknadsbehandling/3-resultat/SøknadsbehandlingResultatVelger';
import { SøknadsbehandlingBrev } from '~/components/behandling/søknadsbehandling/8-brev/SøknadsbehandlingBrev';
import { Separator } from '../../separator/Separator';
import { SøknadsbehandlingSend } from '~/components/behandling/søknadsbehandling/9-send-og-godkjenn/SøknadsbehandlingSend';
import { SøknadsbehandlingBarnetillegg } from '~/components/behandling/søknadsbehandling/7-barn/SøknadsbehandlingBarnetillegg';
import { SøknadsbehandlingTiltak } from '~/components/behandling/søknadsbehandling/5-tiltak/SøknadsbehandlingTiltak';
import { SøknadsbehandlingAvslagsgrunner } from '~/components/behandling/søknadsbehandling/6-avslagsgrunner/SøknadsbehandlingAvslagsgrunner';
import { SøknadsbehandlingDagerPerMeldeperiode } from '~/components/behandling/søknadsbehandling/4-dager-per-meldeperiode/SøknadsbehandlingDagerPerMeldeperiode';
import { SøknadsbehandlingAutomatiskBehandling } from '~/components/behandling/søknadsbehandling/1-automatisk-behandling/SøknadsbehandlingAutomatiskBehandling';
import { BehandlingUtbetaling } from '../felles/utbetaling/BehandlingUtbetaling';

import style from './SøknadsbehandlingVedtak.module.css';

export const SøknadsbehandlingVedtak = () => {
    return (
        <>
            <Heading size={'medium'} level={'3'} className={style.header}>
                {'Vedtak (søknadsbehandling)'}
            </Heading>
            <SøknadsbehandlingAutomatiskBehandling />
            <SøknadsbehandlingBegrunnelse />
            <SøknadsbehandlingResultatVelger />
            <SøknadsbehandlingDagerPerMeldeperiode />
            <Separator />
            <SøknadsbehandlingTiltak />
            <SøknadsbehandlingAvslagsgrunner />
            <SøknadsbehandlingBarnetillegg />
            <SøknadsbehandlingBrev />
            <Separator />
            <BehandlingUtbetaling />
            <SøknadsbehandlingSend />
        </>
    );
};
