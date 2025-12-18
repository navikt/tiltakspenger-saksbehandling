import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';
import { RevurderingResultat } from '~/types/Revurdering';
import {
    BehandlingInnvilgelseMedPerioderContext,
    useBehandlingInnvilgelseMedPerioderSkjema,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { revurderingOmgjøringValidering } from '~/components/behandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { RevurderingInnvilgelseContext } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { RevurderingOmgjøringContext } from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useSak } from '~/context/sak/SakContext';

import { periodiseringTotalPeriode } from '~/utils/periode';

// TODO: split denne for innvilgelse og omgjøring
export const RevurderingInnvilgelseBrev = () => {
    const { behandling } = useRevurderingBehandling();
    const skjema = useBehandlingInnvilgelseMedPerioderSkjema();
    const { sak } = useSak();

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for revurdering av innvilgelse'}
            validering={
                skjema.resultat === RevurderingResultat.INNVILGELSE
                    ? revurderingInnvilgelseValidering(
                          behandling,
                          skjema as RevurderingInnvilgelseContext,
                          sak,
                      )
                    : revurderingOmgjøringValidering(
                          behandling,
                          skjema as RevurderingOmgjøringContext,
                          sak,
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
    skjema: BehandlingInnvilgelseMedPerioderContext,
): RevurderingInnvilgelseBrevForhåndsvisningDTO => {
    const { innvilgelse, textAreas } = skjema;

    return {
        resultat: RevurderingResultat.INNVILGELSE,
        fritekst: textAreas.brevtekst.getValue(),
        vedtaksperiode: periodiseringTotalPeriode(innvilgelse.innvilgelsesperioder),
        innvilgelsesperioder: innvilgelse.innvilgelsesperioder,
        barnetillegg: innvilgelse.harBarnetillegg ? innvilgelse.barnetilleggPerioder : null,
    };
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
