import { SøknadsbehandlingData, SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { ValideringFunc, ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { BehandlingSkjemaContext } from '~/components/behandling/context/BehandlingSkjemaContext';

export const søknadsbehandlingValidering =
    (behandling: SøknadsbehandlingData, skjema: BehandlingSkjemaContext): ValideringFunc =>
    (type): ValideringResultat => {
        const validering: ValideringResultat = {
            errors: [],
            warnings: [],
        };

        const { resultat } = skjema;

        if (!resultat) {
            (type === 'lagring' ? validering.warnings : validering.errors).push(
                'Behandlingsresultat mangler',
            );
        } else if (resultat === SøknadsbehandlingResultat.AVSLAG) {
            const avslagValidering = validerAvslag(skjema);
            validering.errors.push(...avslagValidering.errors);
            validering.warnings.push(...avslagValidering.warnings);
        } else if (resultat === SøknadsbehandlingResultat.INNVILGELSE) {
            const innvilgelseValidering = validerInnvilgelse(behandling, skjema);
            validering.errors.push(...innvilgelseValidering.errors);
            validering.warnings.push(...innvilgelseValidering.warnings);
        } else {
            validering.errors.push(`Ugyldig resultat for søknadsbehandling: ${resultat}`);
        }

        return validering;
    };

const validerAvslag = (skjema: BehandlingSkjemaContext): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    if (skjema.avslagsgrunner.length === 0) {
        validering.errors.push('Avslagsgrunn må velges');
    }

    return validering;
};
