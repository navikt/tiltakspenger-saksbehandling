import { Alert, HStack } from '@navikt/ds-react';
import { useRolleForBehandling } from '~/lib/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { BehandlingLagringProps } from '~/lib/rammebehandling/felles/handlinger/lagre/useHentBehandlingLagringProps';
import { RammebehandlingSaksbehandlerHandlinger } from '~/lib/rammebehandling/felles/handlinger/RammebehandlingSaksbehandlerHandlinger';
import { formaterTidspunkt } from '~/utils/date';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RammebehandlingMeny } from '~/lib/rammebehandling/felles/meny/RammebehandlingMeny';
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
            <VedtakSeksjon.Venstre>
                {erSaksbehandler ? (
                    <RammebehandlingSaksbehandlerHandlinger
                        behandling={behandling}
                        lagringProps={lagringProps}
                    />
                ) : (
                    <HStack gap={'space-16'} justify={'space-between'}>
                        <RammebehandlingMeny behandling={behandling} kallesFra={'behandling'} />

                        {erBeslutter && (
                            <HStack gap={'space-16'} justify={'end'}>
                                <RammebehandlingUnderkjenn behandling={behandling} />
                                <RammebehandlingGodkjenn />
                            </HStack>
                        )}
                    </HStack>
                )}
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <Alert
                    variant={'info'}
                    inline={true}
                >{`Sist lagret: ${formaterTidspunkt(behandling.sistEndret)}`}</Alert>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
