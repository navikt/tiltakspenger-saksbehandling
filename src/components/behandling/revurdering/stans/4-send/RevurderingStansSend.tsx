import { useRevurderingBehandling } from '../../../context/BehandlingContext';
import { revurderingStansValidering } from '../revurderingStansValidering';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { RevurderingResultat, RevurderingVedtakStansRequest } from '~/types/Revurdering';
import {
    RevurderingStansContext,
    useRevurderingStansSkjema,
} from '~/components/behandling/context/revurdering/revurderingStansSkjemaContext';

export const RevurderingStansSend = () => {
    const skjema = useRevurderingStansSkjema();
    const { behandling } = useRevurderingBehandling();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema: skjema,
        validerSkjema: () => revurderingStansValidering(skjema),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: RevurderingStansContext): RevurderingVedtakStansRequest => {
    return {
        resultat: RevurderingResultat.STANS,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue()
            ? skjema.textAreas.brevtekst.getValue()
            : null,
        stansFraOgMed: skjema.harValgtStansFraFørsteDagSomGirRett ? null : skjema.fraDato!,
        harValgtStansFraFørsteDagSomGirRett: skjema.harValgtStansFraFørsteDagSomGirRett,
        stansTilOgMed: null,
        harValgtStansTilSisteDagSomGirRett: true,
        valgteHjemler: skjema.hjemlerForStans!,
    };
};
