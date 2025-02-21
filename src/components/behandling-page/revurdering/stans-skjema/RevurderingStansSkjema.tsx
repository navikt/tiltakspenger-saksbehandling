import { Textarea } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useRevurdering } from '../RevurderingContext';
import { Datovelger } from '../../../revurderingsmodal/Datovelger';
import { dateTilISOTekst } from '../../../../utils/date';

import style from './RevurderingStansSkjema.module.css';
import { BehandlingSendTilBeslutning } from '../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { useSendRevurdering } from './useSendRevurdering';
import { useGodkjennBehandling } from '../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingGodkjenn } from '../../send-og-godkjenn/BehandlingGodkjenn';

export const RevurderingStansSkjema = () => {
    const { behandling, setBegrunnelse, rolleForBehandling, setStansDato, vedtak } =
        useRevurdering();
    const { begrunnelseVilkårsvurdering } = behandling;

    const {
        sendRevurderingTilBeslutter,
        sendRevurderingTilBeslutterLaster,
        sendRevurderingTilBeslutterError,
    } = useSendRevurdering(behandling, vedtak);

    const { godkjennVedtak, godkjennVedtakLaster, godkjennVedtakError } =
        useGodkjennBehandling(behandling);

    return (
        <>
            <Textarea
                label={'Begrunnelse'}
                description={'Her skal det kanskje stå noe mer!'}
                minRows={10}
                resize={'vertical'}
                defaultValue={begrunnelseVilkårsvurdering ?? ''}
                readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                onChange={(event) => {
                    setBegrunnelse(event.target.value);
                }}
            />
            <Datovelger
                label={'Stans fra og med'}
                defaultSelected={new Date(vedtak.stansDato)}
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
