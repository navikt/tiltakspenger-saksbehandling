import { HStack, InlineMessage } from '@navikt/ds-react';
import { useRolleForBehandling, useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { BehandlingLagringProps } from '~/lib/rammebehandling/felles/handlinger/lagre/useHentBehandlingLagringProps';
import { RammebehandlingSaksbehandlerHandlinger } from '~/lib/rammebehandling/felles/handlinger/RammebehandlingSaksbehandlerHandlinger';
import { formaterTidspunkt } from '~/utils/date';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RammebehandlingUnderkjenn } from '~/lib/rammebehandling/felles/handlinger/underkjenn/RammebehandlingUnderkjenn';
import { RammebehandlingGodkjenn } from '~/lib/rammebehandling/felles/handlinger/godkjenn/RammebehandlingGodkjenn';

type Props = {
    behandling: Rammebehandling;
    lagringProps: BehandlingLagringProps;
};

export const RammebehandlingHandlinger = ({ behandling, lagringProps }: Props) => {
    const rolleForBehandling = useRolleForBehandling(behandling);
    const { erBeslutter: harBeslutterrolle } = useSaksbehandler();

    const erSaksbehandlerForBehandling = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;
    // Kan også være en saksbehandler uten beslutterrolle på en delautomatisk innstilling, se kanOpptreSomBeslutter.
    const erBeslutterForBehandling = rolleForBehandling === SaksbehandlerRolle.BESLUTTER;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                {erSaksbehandlerForBehandling && (
                    <RammebehandlingSaksbehandlerHandlinger
                        behandling={behandling}
                        lagringProps={lagringProps}
                    />
                )}

                {erBeslutterForBehandling && (
                    <HStack gap={'space-16'} justify={'end'}>
                        <RammebehandlingUnderkjenn behandling={behandling} />
                        {harBeslutterrolle && <RammebehandlingGodkjenn />}
                    </HStack>
                )}
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <InlineMessage
                    status={'info'}
                >{`Sist lagret: ${formaterTidspunkt(behandling.sistEndret)}`}</InlineMessage>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
