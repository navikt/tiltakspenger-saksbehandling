import { SøknadsbehandlingData, SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { hentTiltaksperiode, hentTiltaksperiodeFraSøknad } from '~/utils/behandling';
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

        const { behandlingsperiode, resultat } = skjema;

        const tiltaksperiode = hentTiltaksperiode(behandling);

        if (!resultat) {
            (type === 'lagring' ? validering.warnings : validering.errors).push(
                'Behandlingsresultat for vilkårsvurdering mangler',
            );
        }

        if (behandlingsperiode.fraOgMed > behandlingsperiode.tilOgMed) {
            validering.errors.push('Til og med-dato må være etter fra og med-dato');
        }

        if (tiltaksperiode.fraOgMed > behandlingsperiode.fraOgMed) {
            validering.errors.push('Behandlingsperioden starter før tiltaksperioden');
        }

        if (tiltaksperiode.tilOgMed < behandlingsperiode.tilOgMed) {
            validering.errors.push('Behandlingsperioden slutter etter tiltaksperioden');
        }

        if (resultat === SøknadsbehandlingResultat.AVSLAG) {
            const avslagValidering = validerAvslag(behandling, skjema);
            validering.errors.push(...avslagValidering.errors);
            validering.warnings.push(...avslagValidering.warnings);
        } else if (resultat === SøknadsbehandlingResultat.INNVILGELSE) {
            const innvilgelseValidering = validerInnvilgelse(behandling, skjema);
            validering.errors.push(...innvilgelseValidering.errors);
            validering.warnings.push(...innvilgelseValidering.warnings);
        }

        return validering;
    };

const validerAvslag = (
    behandling: SøknadsbehandlingData,
    skjema: BehandlingSkjemaContext,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const tiltaksperiode = hentTiltaksperiodeFraSøknad(behandling);

    if (skjema.avslagsgrunner === null) {
        validering.errors.push('Avslagsgrunn må velges');
    }

    if (
        tiltaksperiode.fraOgMed !== skjema.behandlingsperiode.fraOgMed ||
        tiltaksperiode.tilOgMed !== skjema.behandlingsperiode.tilOgMed
    ) {
        validering.warnings.push(
            'Avslagsdatoene er endret. De samsvarer ikke lenger med perioden det er søkt for. Vil du fortsette?',
        );
    }

    return validering;
};
