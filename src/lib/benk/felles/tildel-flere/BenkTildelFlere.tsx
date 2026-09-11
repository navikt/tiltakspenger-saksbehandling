import { BenkTildelFlereMeny } from '~/lib/benk/felles/tildel-flere/BenkTildelFlereMeny';
import { BenkSøknadsbehandling } from '~/lib/benk/typer/søknader';
import { BenkRevurdering } from '~/lib/benk/typer/revurderinger';
import { useBenkVisning } from '~/lib/benk/felles/filter/BenkVisningContext';
import { Button, HStack } from '@navikt/ds-react';

type Props = {
    behandlinger: Array<BenkSøknadsbehandling | BenkRevurdering>;
};

export const BenkTildelFlere = ({ behandlinger }: Props) => {
    const { valgtTildeling, valgtTildelingType, setValgtTildelingType } = useBenkVisning();

    return valgtTildelingType ? (
        <HStack gap={'space-8'} justify={'end'}>
            <Button onClick={() => console.log(valgtTildeling)} variant={'primary'} size={'small'}>
                Tildel
            </Button>
            <Button
                onClick={() => setValgtTildelingType(null)}
                variant={'secondary'}
                size={'small'}
            >
                Avbryt
            </Button>
        </HStack>
    ) : (
        <BenkTildelFlereMeny behandlinger={behandlinger} />
    );
};
