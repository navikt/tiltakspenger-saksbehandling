import { HStack } from '@navikt/ds-react';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RammebehandlingMeny } from '~/lib/rammebehandling/felles/meny/RammebehandlingMeny';
import { RammebehandlingGodkjenn } from '~/lib/rammebehandling/felles/handlinger/godkjenn/RammebehandlingGodkjenn';

type Props = {
    behandling: Rammebehandling;
};

export const RammebehandlingBeslutterHandlinger = ({ behandling }: Props) => {
    return (
        <HStack justify={'space-between'}>
            <RammebehandlingMeny behandling={behandling} kallesFra={'behandling'} />

            <RammebehandlingGodkjenn />
        </HStack>
    );
};
