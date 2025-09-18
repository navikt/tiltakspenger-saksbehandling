import { useRevurderingBehandling } from '../../../context/BehandlingContext';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { revurderingStansValidering } from '~/components/behandling/revurdering/stans/revurderingStansValidering';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { RevurderingStansBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { HjelpetekstRevurdering } from '~/components/behandling/revurdering/innvilgelse/6-brev/RevurderingInnvilgelseBrev';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

export const RevurderingStansBrev = () => {
    const skjema = useBehandlingSkjema();

    const { hjemlerForStans, behandlingsperiode, textAreas } = skjema;
    const { brevtekst } = textAreas;

    const { behandling, rolleForBehandling } = useRevurderingBehandling();

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for stans'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekst.ref}
            validering={revurderingStansValidering(skjema)}
            hentDto={(): RevurderingStansBrevForhåndsvisningDTO => ({
                fritekst: brevtekst.getValue(),
                stansDato: behandlingsperiode.fraOgMed!,
                valgteHjemler: hjemlerForStans,
                resultat: RevurderingResultat.STANS,
            })}
            hjelpetekst={<HjelpetekstRevurdering />}
        />
    );
};
