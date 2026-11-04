import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { RevurderingForlengelse } from '~/lib/rammebehandling/typer/Revurdering';
import {
    hentForlengelseTilOgMed,
    hentForlengelseTiltaksdeltakelse,
    RevurderingForlengelseContext,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { hentVedtatteSøknadsbehandlinger } from '~/lib/sak/sakUtils';
import { validerInnvilgelse } from '~/lib/rammebehandling/felles/validering/validerInnvilgelse';

export const revurderingForlengelseValidering = (
    behandling: RevurderingForlengelse,
    skjema: RevurderingForlengelseContext,
    sak: SakProps,
): ValideringResultat => {
    const tilOgMed = hentForlengelseTilOgMed(skjema);
    const internDeltakelseId = hentForlengelseTiltaksdeltakelse(skjema);

    if (
        !internDeltakelseId ||
        !behandling.tiltaksdeltakelserSomKanForlenges.includes(internDeltakelseId)
    ) {
        return {
            errors: ['Du må velge hvilket tiltak vedtaket skal forlenges for.'],
            warnings: [],
        };
    }

    if (!skjema.innvilgelse.harValgtPeriode || !tilOgMed) {
        return {
            errors: ['Du må velge hvilken dato vedtaket skal forlenges til og med.'],
            warnings: [],
        };
    }

    if (tilOgMed < skjema.forlengesFraOgMed) {
        return {
            errors: ['Til og med-datoen kan ikke være før forlengelsen starter.'],
            warnings: [],
        };
    }

    const sisteSøknad = hentVedtatteSøknadsbehandlinger(sak).atNonNull(0).søknad;

    // Barnetillegget saksbehandler ikke har valgt selv, utleder backend på nytt når behandlingen lagres.
    return validerInnvilgelse(sak, behandling, skjema, sisteSøknad, {
        validerBarnetillegg: skjema.harEndretBarnetillegg,
    });
};
