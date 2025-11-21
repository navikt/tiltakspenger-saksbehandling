import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';
import { Periode } from '~/types/Periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { BarnetilleggPeriodeFormData } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { RevurderingResultat } from '~/types/Revurdering';
import {
    BehandlingInnvilgelseContext,
    useBehandlingInnvilgelseSkjema,
} from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { revurderingOmgjøringValidering } from '~/components/behandling/revurdering/omgjøring/revurderingInnvilgelseValidering';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { RevurderingInnvilgelseContext } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { RevurderingOmgjøringContext } from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';

// TODO: split denne for innvilgelse og omgjøring
export const RevurderingInnvilgelseBrev = () => {
    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const skjema = useBehandlingInnvilgelseSkjema();

    const { brevtekst } = skjema.textAreas;

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for revurdering av innvilgelse'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekst.ref}
            validering={
                skjema.resultat === RevurderingResultat.INNVILGELSE
                    ? revurderingInnvilgelseValidering(
                          behandling,
                          skjema as RevurderingInnvilgelseContext,
                      )
                    : revurderingOmgjøringValidering(
                          behandling,
                          skjema as RevurderingOmgjøringContext,
                      )
            }
            hentDto={(): RevurderingInnvilgelseBrevForhåndsvisningDTO =>
                revurderingskjemaTilBrevForhåndsvisningDTO(skjema)
            }
            hjelpetekst={<HjelpetekstRevurdering />}
        />
    );
};

const revurderingskjemaTilBrevForhåndsvisningDTO = (
    skjema: BehandlingInnvilgelseContext,
): RevurderingInnvilgelseBrevForhåndsvisningDTO => {
    return {
        resultat: RevurderingResultat.INNVILGELSE,
        fritekst: skjema.textAreas.brevtekst.getValue(),
        virkningsperiode: skjema.behandlingsperiode as Periode,
        barnetillegg: skjema.harBarnetillegg
            ? barnetilleggPeriodeFormDataTilBarnetilleggPeriode(skjema.barnetilleggPerioder)
            : null,
        antallDagerPerMeldeperiodeForPerioder: skjema.antallDagerPerMeldeperiode
            ? skjema.antallDagerPerMeldeperiode.map((dager) => ({
                  antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode!,
                  periode: {
                      fraOgMed: dager.periode!.fraOgMed!,
                      tilOgMed: dager.periode!.tilOgMed!,
                  },
              }))
            : null,
    };
};

export const barnetilleggPeriodeFormDataTilBarnetilleggPeriode = (
    barnetilleggPerioder: BarnetilleggPeriodeFormData[],
): BarnetilleggPeriode[] => {
    return barnetilleggPerioder.map((bt) => ({
        antallBarn: bt.antallBarn,
        periode: {
            fraOgMed: bt.periode.fraOgMed!,
            tilOgMed: bt.periode.tilOgMed!,
        },
    }));
};

export const HjelpetekstRevurdering = () => {
    return (
        <>
            <BodyLong size={'small'}>{'Informer bruker om:'}</BodyLong>
            <TekstListe
                tekster={[
                    'Hvorfor du har endret vedtaket',
                    'Hvordan du har vurdert faktum opp mot reglene',
                    'Eventuelt andre relevante opplysninger som ikke kommer frem i standardtekstene i brevet',
                ]}
            />
        </>
    );
};
