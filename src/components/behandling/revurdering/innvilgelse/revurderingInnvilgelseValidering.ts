import { RevurderingData } from '~/types/BehandlingTypes';
import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { BehandlingSkjemaContext } from '~/components/behandling/context/BehandlingSkjemaContext';

export const revurderingInnvilgelseValidering = (
    behandling: RevurderingData,
    skjema: BehandlingSkjemaContext,
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
