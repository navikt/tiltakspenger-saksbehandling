import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';
import { Periode } from '~/types/Periode';

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
            hentDto={(): RevurderingInnvilgelseBrevForhåndsvisningDTO => ({
                resultat: RevurderingResultat.REVURDERING_INNVILGELSE,
                fritekst: brevtekst.getValue(),
                virkningsperiode: skjema.behandlingsperiode as Periode,
                barnetillegg: skjema.harBarnetillegg ? skjema.barnetilleggPerioder : null,
            })}
            hjelpetekst={<HjelpetekstRevurdering />}
        />
    );
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
