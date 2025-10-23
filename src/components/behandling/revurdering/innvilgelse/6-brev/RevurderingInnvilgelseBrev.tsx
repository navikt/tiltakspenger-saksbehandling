import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';

import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';
import {
    BehandlingSkjemaContext,
    useBehandlingSkjema,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { Periode } from '~/types/Periode';
import { BehandlingResultat } from '~/types/Behandling';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { BarnetilleggPeriodeFormData } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';

export const RevurderingInnvilgelseBrev = () => {
    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const skjema = useBehandlingSkjema();

    const { brevtekst } = skjema.textAreas;

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for revurdering av innvilgelse'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekst.ref}
            validering={revurderingInnvilgelseValidering(behandling, skjema)}
            hentDto={(): RevurderingInnvilgelseBrevForhåndsvisningDTO =>
                revurderingskjemaTilBrevForhåndsvisningDTO(skjema)
            }
            hjelpetekst={<HjelpetekstRevurdering />}
        />
    );
};

const revurderingskjemaTilBrevForhåndsvisningDTO = (
    skjema: BehandlingSkjemaContext,
): RevurderingInnvilgelseBrevForhåndsvisningDTO => {
    return {
        resultat: BehandlingResultat.REVURDERING_INNVILGELSE,
        fritekst: skjema.textAreas.brevtekst.getValue(),
        virkningsperiode: skjema.behandlingsperiode as Periode,
        barnetillegg: skjema.harBarnetillegg
            ? barnetilleggPeriodeFormDataTilBarnetilleggPeriode(skjema.barnetilleggPerioder)
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
