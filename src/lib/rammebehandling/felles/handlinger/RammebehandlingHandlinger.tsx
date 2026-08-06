import { HStack, InlineMessage } from '@navikt/ds-react';
import { useRolleForBehandling } from '~/lib/saksbehandler/SaksbehandlerContext';
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

    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;
    const erBeslutter = rolleForBehandling === SaksbehandlerRolle.BESLUTTER;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                {erSaksbehandler && (
                    <RammebehandlingSaksbehandlerHandlinger
                        behandling={behandling}
                        lagringProps={lagringProps}
                    />
                )}

                {erBeslutter && (
                    <HStack gap={'space-16'} justify={'end'}>
                        <RammebehandlingUnderkjenn behandling={behandling} />
                        <RammebehandlingGodkjenn />
                    </HStack>
                )}

                <InlineMessage status={'info'} size={'small'}>
                    {'Handlinger er flyttet til menyen, øverst til venstre'}
                </InlineMessage>
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <InlineMessage
                    status={'info'}
                >{`Sist lagret: ${formaterTidspunkt(behandling.sistEndret)}`}</InlineMessage>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
