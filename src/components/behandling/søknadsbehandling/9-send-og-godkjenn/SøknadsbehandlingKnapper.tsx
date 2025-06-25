import { useSendSøknadsbehandling } from './useSendSøknadsbehandling';
import { useSøknadsbehandlingSkjema } from '../context/SøknadsbehandlingVedtakContext';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { søknadsbehandlingValidering } from '../søknadsbehandlingValidering';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';

export const SøknadsbehandlingKnapper = () => {
    const { behandling } = useSøknadsbehandling();
    const vedtakSkjema = useSøknadsbehandlingSkjema();

    const { sendTilBeslutning, sendTilBeslutningLaster, sendTilBeslutningError } =
        useSendSøknadsbehandling(behandling, vedtakSkjema);

    return (
        <BehandlingSendOgGodkjenn
            behandling={behandling}
            sendTilBeslutningProps={{
                send: sendTilBeslutning,
                laster: sendTilBeslutningLaster,
                feil: sendTilBeslutningError,
                validering: () => søknadsbehandlingValidering(behandling, vedtakSkjema),
            }}
        />
    );
};
