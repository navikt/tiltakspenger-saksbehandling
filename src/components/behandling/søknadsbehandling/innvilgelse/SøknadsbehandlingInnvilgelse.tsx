import { SøknadsbehandlingBarnetillegg } from '~/components/behandling/søknadsbehandling/7-barn/SøknadsbehandlingBarnetillegg';
import { SøknadsbehandlingDagerPerMeldeperiode } from '~/components/behandling/søknadsbehandling/4-dager-per-meldeperiode/SøknadsbehandlingDagerPerMeldeperiode';
import { Separator } from '~/components/separator/Separator';
import { SøknadsbehandlingTiltak } from '~/components/behandling/søknadsbehandling/5-tiltak/SøknadsbehandlingTiltak';

export const SøknadsbehandlingInnvilgelse = () => {
    return (
        <>
            <SøknadsbehandlingDagerPerMeldeperiode />
            <Separator />
            <SøknadsbehandlingTiltak />
            <SøknadsbehandlingBarnetillegg />
        </>
    );
};
