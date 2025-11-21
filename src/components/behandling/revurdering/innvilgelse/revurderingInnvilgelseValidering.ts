import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { Revurdering } from '~/types/Revurdering';
import { RevurderingInnvilgelseContext } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';

export const revurderingInnvilgelseValidering = (
    behandling: Revurdering,
    skjema: RevurderingInnvilgelseContext,
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
