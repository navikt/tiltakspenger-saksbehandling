import { ValideringResultat } from '~/types/Validering';
import { RevurderingStansState } from '~/components/behandling/context/revurdering/revurderingStansSkjemaContext';

export const revurderingStansValidering = (skjema: RevurderingStansState): ValideringResultat => {
    const { hjemlerForStans, fraDato } = skjema;

    const errors: string[] = [];
    const warnings: string[] = [];

    if (hjemlerForStans.length === 0) {
        errors.push('Du må velge en hjemmel som begrunnelse for hvorfor tiltakspengene stanses.');
    }

    if (!fraDato) {
        errors.push('Du må velge en fra-dato for når tiltakspengene skal stanses.');
    }

    return {
        errors,
        warnings,
    };
};
