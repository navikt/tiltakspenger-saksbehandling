import { Textarea } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useRevurdering } from '../RevurderingContext';
import { Datovelger } from '../../../revurderingsmodal/Datovelger';
import { dateTilISOTekst } from '../../../../utils/date';

import style from './RevurderingStansSkjema.module.css';
import { BehandlingSendTilBeslutter } from '../../send-og-godkjenn/BehandlingSendTilBeslutter';
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
                defaultSelected={new Date()}
                readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                className={style.dato}
                onDateChange={(valgtDato) => {
                    if (valgtDato) {
                        setStansDato(dateTilISOTekst(valgtDato));
                    }
                }}
            />
            <BehandlingSendTilBeslutter
                sendTilBeslutter={sendRevurderingTilBeslutter}
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
