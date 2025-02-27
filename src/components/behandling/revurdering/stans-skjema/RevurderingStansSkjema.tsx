import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useRevurdering } from '../RevurderingContext';
import { Datovelger } from '../../../datovelger/Datovelger';
import { dateTilISOTekst } from '../../../../utils/date';
import { BehandlingSendTilBeslutning } from '../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { useSendRevurdering } from './useSendRevurdering';
import { useGodkjennBehandling } from '../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingGodkjenn } from '../../send-og-godkjenn/BehandlingGodkjenn';
import { TekstfeltMedMellomlagring } from '../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBegrunnelseDTO } from '../../../../types/VedtakTyper';

import style from './RevurderingStansSkjema.module.css';

export const RevurderingStansSkjema = () => {
    const { behandling, setBegrunnelse, rolleForBehandling, setStansDato, vedtak } =
        useRevurdering();
    const { begrunnelseVilkårsvurdering, sakId, id } = behandling;

    const {
        sendRevurderingTilBeslutter,
        sendRevurderingTilBeslutterLaster,
        sendRevurderingTilBeslutterError,
    } = useSendRevurdering(behandling, vedtak);

    const { godkjennVedtak, godkjennVedtakLaster, godkjennVedtakError } =
        useGodkjennBehandling(behandling);

    return (
        <>
            <TekstfeltMedMellomlagring
                label={'Begrunnelse revurdering'}
                description={'Her skal det kanskje stå noe mer!'}
                defaultValue={begrunnelseVilkårsvurdering ?? ''}
                readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                lagringUrl={`/sak/${sakId}/behandling/${id}/begrunnelse`}
                lagringBody={(tekst) => ({ begrunnelse: tekst }) satisfies VedtakBegrunnelseDTO}
                onChange={(event) => {
                    setBegrunnelse(event.target.value);
                }}
            />
            <Datovelger
                label={'Stans fra og med'}
                defaultSelected={vedtak.stansDato}
                readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                className={style.dato}
                onDateChange={(valgtDato) => {
                    if (valgtDato) {
                        setStansDato(dateTilISOTekst(valgtDato));
                    }
                }}
            />
            <BehandlingSendTilBeslutning
                sendTilBeslutning={sendRevurderingTilBeslutter}
                isLoading={sendRevurderingTilBeslutterLaster}
                error={sendRevurderingTilBeslutterError}
            />
            <BehandlingGodkjenn
                godkjennBehandling={godkjennVedtak}
                isLoading={godkjennVedtakLaster}
                error={godkjennVedtakError}
            />
        </>
    );
};
