import { ValideringFunc, ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { BehandlingSkjemaContext } from '~/components/behandling/context/BehandlingSkjemaContext';
import { RammebehandlingResultatType } from '~/types/Behandling';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';

export const søknadsbehandlingValidering =
    (behandling: Søknadsbehandling, skjema: BehandlingSkjemaContext): ValideringFunc =>
    (type): ValideringResultat => {
        const validering: ValideringResultat = {
            errors: [],
            warnings: [],
        };

        const { resultat } = skjema;

        if (resultat === RammebehandlingResultatType.IKKE_VALGT) {
            (type === 'lagring' ? validering.warnings : validering.errors).push(
                'Behandlingsresultat mangler',
            );
        } else if (resultat === RammebehandlingResultatType.AVSLAG) {
            const avslagValidering = validerAvslag(skjema);
            validering.errors.push(...avslagValidering.errors);
            validering.warnings.push(...avslagValidering.warnings);
        } else if (resultat === RammebehandlingResultatType.INNVILGELSE) {
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
