import { useRevurderingBehandling } from '../../../context/BehandlingContext';
import { revurderingStansValidering } from '../revurderingStansValidering';
import { BehandlingResultatDTO, RevurderingVedtakStansDTO } from '~/types/VedtakTyper';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import {
    BehandlingSkjemaContext,
    useBehandlingSkjema,
} from '~/components/behandling/context/BehandlingSkjemaContext';

export const RevurderingStansSend = () => {
    const skjema = useBehandlingSkjema();
    const { behandling } = useRevurderingBehandling();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        vedtak: skjema,
        validerVedtak: () => revurderingStansValidering(skjema),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: BehandlingSkjemaContext): RevurderingVedtakStansDTO => {
    return {
        resultat: BehandlingResultatDTO.STANS,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        stansFraOgMed: skjema.behandlingsperiode.fraOgMed!,
        valgteHjemler: skjema.hjemlerForStans!,
    };
};
