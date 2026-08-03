import { ValideringFunc, ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { validerInnvilgelse } from '~/lib/rammebehandling/felles/validering/validerInnvilgelse';
import { BehandlingSkjemaContext } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import {
    Søknadsbehandling,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { SøknadsbehandlingAvslagContext } from '~/lib/rammebehandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { SakProps } from '~/lib/sak/SakTyper';

export const søknadsbehandlingValidering =
    (
        sak: SakProps,
        behandling: Søknadsbehandling,
        skjema: BehandlingSkjemaContext,
    ): ValideringFunc =>
    (type): ValideringResultat => {
        const validering: ValideringResultat = {
            errors: [],
            warnings: [],
        };

        const { resultat } = skjema;

        if (resultat === SøknadsbehandlingResultat.IKKE_VALGT) {
            (type === 'lagring' ? validering.warnings : validering.errors).push(
                'Behandlingsresultat mangler',
            );
        } else if (resultat === SøknadsbehandlingResultat.AVSLAG) {
            const avslagValidering = validerAvslag(skjema);
            validering.errors.push(...avslagValidering.errors);
            validering.warnings.push(...avslagValidering.warnings);
        } else if (resultat === SøknadsbehandlingResultat.INNVILGELSE) {
            const innvilgelseValidering = validerInnvilgelse(
                sak,
                behandling,
                skjema,
                behandling.søknad,
            );
            validering.errors.push(...innvilgelseValidering.errors);
            validering.warnings.push(...innvilgelseValidering.warnings);
        } else {
            validering.errors.push(`Ugyldig resultat for søknadsbehandling: ${resultat}`);
        }

        return validering;
    };

const validerAvslag = (skjema: SøknadsbehandlingAvslagContext): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    if (skjema.avslagsgrunner.length === 0) {
        validering.errors.push('Avslagsgrunn må velges');
    }

    return validering;
};
