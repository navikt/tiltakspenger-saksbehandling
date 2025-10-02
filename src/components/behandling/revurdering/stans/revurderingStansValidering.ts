import { ValideringResultat } from '~/types/Validering';
import { BehandlingSkjemaContext } from '~/components/behandling/context/BehandlingSkjemaContext';

export const revurderingStansValidering = (skjema: BehandlingSkjemaContext): ValideringResultat => {
    const { hjemlerForStans, behandlingsperiode } = skjema;

    const errors: string[] = [];
    const warnings: string[] = [];

    if (hjemlerForStans.length === 0) {
        errors.push('Du må velge en hjemmel som begrunnelse for hvorfor tiltakspengene stanses.');
    }

    if (!behandlingsperiode.fraOgMed) {
        errors.push('Du må velge en fra-dato for når tiltakspengene skal stanses.');
    }

    if (!behandlingsperiode.tilOgMed) {
        errors.push('Du må velge en til-dato for når tiltakspengene skal stanses.');
    }

    return {
        errors,
        warnings,
    };
};
