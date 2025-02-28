import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { Datovelger } from '../../../datovelger/Datovelger';
import { dateTilISOTekst } from '../../../../utils/date';
import { BehandlingSendTilBeslutning } from '../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { useSendRevurderingVedtak } from './useSendRevurderingVedtak';
import { useGodkjennBehandling } from '../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingGodkjenn } from '../../send-og-godkjenn/BehandlingGodkjenn';
import { TekstfeltMedMellomlagring } from '../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBegrunnelseLagringDTO } from '../../../../types/VedtakTyper';
import { useRevurderingBehandling } from '../../BehandlingContext';
import { useRevurderingVedtak } from '../RevurderingVedtakContext';

import style from './RevurderingStansSkjema.module.css';

export const RevurderingStansSkjema = () => {
    const revurderingVedtak = useRevurderingVedtak();
    const { stansdato, setStansdato, begrunnelseRef } = revurderingVedtak;

    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const { begrunnelseVilkårsvurdering, sakId, id } = behandling;

    const {
        sendRevurderingTilBeslutning,
        sendRevurderingTilBeslutningLaster,
        sendRevurderingTilBeslutningError,
    } = useSendRevurderingVedtak(behandling, revurderingVedtak);

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
                lagringBody={(tekst) =>
                    ({ begrunnelse: tekst }) satisfies VedtakBegrunnelseLagringDTO
                }
                ref={begrunnelseRef}
            />
            <Datovelger
                label={'Stans fra og med'}
                defaultSelected={stansdato}
                readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                className={style.dato}
                onDateChange={(valgtDato) => {
                    if (valgtDato) {
                        setStansdato(dateTilISOTekst(valgtDato));
                    }
                }}
            />
            <BehandlingSendTilBeslutning
                sendTilBeslutning={sendRevurderingTilBeslutning}
                isLoading={sendRevurderingTilBeslutningLaster}
                error={sendRevurderingTilBeslutningError}
            />
            <BehandlingGodkjenn
                godkjennBehandling={godkjennVedtak}
                isLoading={godkjennVedtakLaster}
                error={godkjennVedtakError}
            />
        </>
    );
};
