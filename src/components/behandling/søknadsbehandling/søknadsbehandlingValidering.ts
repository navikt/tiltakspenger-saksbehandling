import { SøknadsbehandlingVedtakContext } from './context/SøknadsbehandlingVedtakContext';
import { SøknadsbehandlingData, SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { hentTiltaksperiode, hentTiltaksperiodeFraSøknad } from '~/utils/behandling';
import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';

export const søknadsbehandlingValidering = (
    behandling: SøknadsbehandlingData,
    vedtak: SøknadsbehandlingVedtakContext,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const { behandlingsperiode, resultat } = vedtak;

    const tiltaksperiode = hentTiltaksperiode(behandling);

    if (!resultat) {
        validering.errors.push('Behandlingsresultat for vilkårsvurdering mangler');
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
        const avslagValidering = validerAvslag(behandling, vedtak);
        validering.errors.push(...avslagValidering.errors);
        validering.warnings.push(...avslagValidering.warnings);
    } else if (resultat === SøknadsbehandlingResultat.INNVILGELSE) {
        const innvilgelseValidering = validerInnvilgelse(behandling, vedtak);
        validering.errors.push(...innvilgelseValidering.errors);
        validering.warnings.push(...innvilgelseValidering.warnings);
    }

    return validering;
};

const validerAvslag = (
    behandling: SøknadsbehandlingData,
    vedtak: SøknadsbehandlingVedtakContext,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const tiltaksperiode = hentTiltaksperiodeFraSøknad(behandling);

    if (vedtak.avslagsgrunner === null) {
        validering.errors.push('Avslagsgrunn må velges');
    }

    if (
        tiltaksperiode.fraOgMed !== vedtak.behandlingsperiode.fraOgMed ||
        tiltaksperiode.tilOgMed !== vedtak.behandlingsperiode.tilOgMed
    ) {
        validering.warnings.push(
            'Avslagsdatoene er endret. De samsvarer ikke lenger med perioden det er søkt for. Vil du fortsette?',
        );
    }

    return validering;
};
