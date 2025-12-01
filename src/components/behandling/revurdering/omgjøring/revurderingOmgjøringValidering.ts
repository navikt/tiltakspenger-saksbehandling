import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { Revurdering } from '~/types/Revurdering';
import { RevurderingOmgjøringState } from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { SakProps } from '~/types/Sak';
import { hentVedtatteSøknadsbehandlinger } from '~/utils/sak';

/**
 * Omgjøring benytter seg av de samme reglene som innvilgelse
 */
export const revurderingOmgjøringValidering = (
    behandling: Revurdering,
    skjema: RevurderingOmgjøringState,
    sak: SakProps,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const sisteSøknad = hentVedtatteSøknadsbehandlinger(sak).at(0)!.søknad;

    const innvilgelseValidering = validerInnvilgelse(behandling, skjema.innvilgelse, sisteSøknad);

    validering.errors.push(...innvilgelseValidering.errors);
    validering.warnings.push(...innvilgelseValidering.warnings);

    return validering;
};
