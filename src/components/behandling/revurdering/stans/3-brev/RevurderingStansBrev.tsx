import { useRevurderingBehandling } from '../../../context/BehandlingContext';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { revurderingStansValidering } from '~/components/behandling/revurdering/stans/revurderingStansValidering';
import { RevurderingStansBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { HjelpetekstRevurdering } from '~/components/behandling/revurdering/innvilgelse/brev/RevurderingInnvilgelseBrev';
import { RevurderingResultat } from '~/types/Revurdering';
import { useRevurderingStansSkjema } from '~/components/behandling/context/revurdering/revurderingStansSkjemaContext';

export const RevurderingStansBrev = () => {
    const skjema = useRevurderingStansSkjema();

    const { hjemlerForStans, fraDato, textAreas, harValgtStansFraFørsteDagSomGirRett } = skjema;
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
                ...(harValgtStansFraFørsteDagSomGirRett
                    ? {
                          harValgtStansFraFørsteDagSomGirRett,
                      }
                    : {
                          harValgtStansFraFørsteDagSomGirRett,
                          stansFraOgMed: fraDato!,
                      }),
                stansTilOgMed: null,
                harValgtStansTilSisteDagSomGirRett: true,
                fritekst: brevtekst.getValue(),
                valgteHjemler: hjemlerForStans,
                resultat: RevurderingResultat.STANS,
            })}
            hjelpetekst={<HjelpetekstRevurdering />}
        />
    );
};
