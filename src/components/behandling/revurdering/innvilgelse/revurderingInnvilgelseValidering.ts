import { RevurderingData } from '~/types/BehandlingTypes';
import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { SakProps } from '~/types/SakTypes';
import { BehandlingSkjemaContext } from '~/components/behandling/context/BehandlingSkjemaContext';

export const revurderingInnvilgelseValidering = (
    sak: SakProps,
    behandling: RevurderingData,
    skjema: BehandlingSkjemaContext,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const { behandlingsperiode } = skjema;

    if (behandlingsperiode.fraOgMed > behandlingsperiode.tilOgMed) {
        validering.errors.push('Til og med-dato må være etter fra og med-dato');
    }

    const innvilgelseValidering = validerInnvilgelse(behandling, skjema);
    validering.errors.push(...innvilgelseValidering.errors);
    validering.warnings.push(...innvilgelseValidering.warnings);

    return validering;
};
