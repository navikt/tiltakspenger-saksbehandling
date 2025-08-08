import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { useRevurderingInnvilgelseSkjema } from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { useSak } from '~/context/sak/SakContext';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';

export const RevurderingInnvilgelseBrev = () => {
    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const vedtak = useRevurderingInnvilgelseSkjema();
    const { sak } = useSak();

    const { brevtekst } = vedtak.textAreas;

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for revurdering av innvilgelse'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekst.ref}
            validering={revurderingInnvilgelseValidering(sak, behandling, vedtak)}
            hentDto={(): RevurderingInnvilgelseBrevForhåndsvisningDTO => ({
                resultat: RevurderingResultat.REVURDERING_INNVILGELSE,
                fritekst: brevtekst.getValue(),
                virkningsperiode: vedtak.behandlingsperiode,
                barnetillegg: vedtak.harBarnetillegg ? vedtak.barnetilleggPerioder : null,
            })}
            hjelpetekst={<Hjelpetekst />}
        />
    );
};

const Hjelpetekst = () => {
    return (
        <>
            <BodyLong size={'small'}>{'Informer bruker om:'}</BodyLong>
            <TekstListe
                tekster={[
                    'Tiltaket de har fått godkjent tiltakspenger for og perioden det gjelder',
                    'Om det er noe som reduserer retten i deler av perioden de har søkt på',
                    'Eventuelt andre relevante opplysninger som ikke kommer frem i standardtekstene i brevet',
                ]}
            />
        </>
    );
};
