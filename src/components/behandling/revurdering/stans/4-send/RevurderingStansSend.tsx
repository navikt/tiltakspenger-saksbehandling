import { useRevurderingBehandling } from '../../../context/BehandlingContext';
import { revurderingStansValidering } from '../revurderingStansValidering';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import {
    BehandlingSkjemaContext,
    useBehandlingSkjema,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { RevurderingVedtakStansRequest } from '~/types/Revurdering';
import { RammebehandlingResultatType } from '~/types/Behandling';

export const RevurderingStansSend = () => {
    const skjema = useBehandlingSkjema();
    const { behandling } = useRevurderingBehandling();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema: skjema,
        validerSkjema: () => revurderingStansValidering(skjema),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: BehandlingSkjemaContext): RevurderingVedtakStansRequest => {
    return {
        resultat: RammebehandlingResultatType.STANS,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        stansFraOgMed: skjema.harValgtStansFraFørsteDagSomGirRett
            ? null
            : skjema.behandlingsperiode!.fraOgMed!,
        harValgtStansFraFørsteDagSomGirRett: skjema.harValgtStansFraFørsteDagSomGirRett,
        stansTilOgMed: null,
        harValgtStansTilSisteDagSomGirRett: true,
        valgteHjemler: skjema.hjemlerForStans!,
    };
};
