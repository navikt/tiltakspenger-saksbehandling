import { Alert } from '@navikt/ds-react';
import { useRolleForBehandling } from '~/lib/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { BehandlingLagringProps } from '~/lib/rammebehandling/felles/handlinger/lagre/useHentBehandlingLagringProps';
import { RammebehandlingSaksbehandlerHandlinger } from '~/lib/rammebehandling/felles/handlinger/RammebehandlingSaksbehandlerHandlinger';
import { RammebehandlingBeslutterHandlinger } from '~/lib/rammebehandling/felles/handlinger/RammebehandlingBeslutterHandlinger';
import { formaterTidspunkt } from '~/utils/date';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    behandling: Rammebehandling;
    lagringProps: BehandlingLagringProps;
};

export const RammebehandlingHandlinger = ({ behandling, lagringProps }: Props) => {
    const rolleForBehandling = useRolleForBehandling(behandling);

    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;
    const erBeslutter = rolleForBehandling === SaksbehandlerRolle.BESLUTTER;

    if (!erSaksbehandler && !erBeslutter) {
        return null;
    }

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                {erSaksbehandler ? (
                    <RammebehandlingSaksbehandlerHandlinger
                        behandling={behandling}
                        lagringProps={lagringProps}
                    />
                ) : (
                    <RammebehandlingBeslutterHandlinger behandling={behandling} />
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
