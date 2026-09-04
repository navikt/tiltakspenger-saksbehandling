import { ActionMenu, HStack, InternalHeader, Tag, VStack } from '@navikt/ds-react';
import { AkselColor } from '@navikt/ds-react/types/theme';
import { LeaveIcon } from '@navikt/aksel-icons';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';

const rolleTekst: Record<SaksbehandlerRolle, string> = {
    [SaksbehandlerRolle.SAKSBEHANDLER]: 'Saksbehandler',
    [SaksbehandlerRolle.BESLUTTER]: 'Beslutter',
    [SaksbehandlerRolle.UTVIKLER]: 'Utvikler',
    [SaksbehandlerRolle.VEILEDER]: 'Veileder',
};

const rolleFarge: Record<SaksbehandlerRolle, AkselColor> = {
    [SaksbehandlerRolle.SAKSBEHANDLER]: 'accent',
    [SaksbehandlerRolle.BESLUTTER]: 'success',
    [SaksbehandlerRolle.UTVIKLER]: 'meta-purple',
    [SaksbehandlerRolle.VEILEDER]: 'info',
};

export const InnloggetSaksbehandlerStatus = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    return (
        <HStack gap={'space-8'} align={'center'}>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <InternalHeader.UserButton
                        name={innloggetSaksbehandler.navIdent}
                        description={innloggetSaksbehandler.brukernavn}
                    />
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <VStack gap={'space-4'} align={'stretch'}>
                        <ActionMenu.Label>{'Mine roller:'}</ActionMenu.Label>
                        {innloggetSaksbehandler.roller.map((rolle) => (
                            <Tag
                                key={rolle}
                                variant={'moderate'}
                                data-color={rolleFarge[rolle]}
                                size={'small'}
                            >
                                {rolleTekst[rolle]}
                            </Tag>
                        ))}
                    </VStack>
                    <ActionMenu.Divider />
                    <ActionMenu.Item as={'a'} href={'/oauth2/logout'} icon={<LeaveIcon />}>
                        {'Logg ut'}
                    </ActionMenu.Item>
                </ActionMenu.Content>
            </ActionMenu>
        </HStack>
    );
};
