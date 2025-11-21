import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { Revurdering } from '~/types/Revurdering';
import { RevurderingOmgjøringState } from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';

/**
 * Omgjøring benytter seg av de samme reglene som innvilgelse
 */
export const revurderingOmgjøringValidering = (
    behandling: Revurdering,
    skjema: RevurderingOmgjøringState,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const innvilgelseValidering = validerInnvilgelse(behandling, skjema);

    validering.errors.push(...innvilgelseValidering.errors);
    validering.warnings.push(...innvilgelseValidering.warnings);

    return validering;
};
