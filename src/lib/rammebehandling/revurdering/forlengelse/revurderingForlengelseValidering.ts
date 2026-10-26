import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { RevurderingForlengelse } from '~/lib/rammebehandling/typer/Revurdering';
import {
    hentForlengelseTilOgMed,
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
    const skjemaSomValideres = skjema.harEndretBarnetillegg
        ? skjema
        : {
              ...skjema,
              innvilgelse: {
                  ...skjema.innvilgelse,
                  harBarnetillegg: false,
                  barnetilleggPerioder: [],
              },
          };

    return validerInnvilgelse(sak, behandling, skjemaSomValideres, sisteSøknad);
};
