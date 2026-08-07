import { HStack, Table } from '@navikt/ds-react';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { behandlingUrl } from '~/utils/urls';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { BenkSøknadsbehandling } from '../typer/søknader';
import { BenkRevurdering } from '../typer/revurderinger';
import { BenkBehandlingMeny } from './BenkBehandlingMeny';
import { kanFortsetteBenkRad } from '../benkV2Utils';

type Props = {
    behandling: BenkSøknadsbehandling | BenkRevurdering;
};

/** Lenke til behandlingen og menyen med handlingene den innloggede saksbehandleren kan gjøre */
export const RammebehandlingHandlingerCelle = ({ behandling }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    return (
        <Table.DataCell align={'right'}>
            <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
                <InternLenkeKnapp
                    href={behandlingUrl({
                        saksnummer: behandling.saksnummer,
                        id: behandling.id,
                    })}
                >
                    {kanFortsetteBenkRad(behandling, innloggetSaksbehandler.navIdent)
                        ? 'Fortsett'
                        : 'Se behandling'}
                </InternLenkeKnapp>
                <BenkBehandlingMeny behandling={behandling} />
            </HStack>
        </Table.DataCell>
    );
};
