import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import router from 'next/router';
import { Klagebehandling } from '~/types/Klage';

const KlageMeny = (props: { klage: Klagebehandling }) => {
    return (
        <div>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant="secondary"
                        iconPosition="right"
                        icon={<ChevronDownIcon title="Menyvalg" />}
                        size="small"
                    >
                        Velg
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <ActionMenu.Item
                        onSelect={() =>
                            router.push(
                                `/sak/${props.klage.saksnummer}/klage/${props.klage.id}/brev`,
                            )
                        }
                    >
                        Åpne
                    </ActionMenu.Item>
                </ActionMenu.Content>
            </ActionMenu>
        </div>
    );
};

export default KlageMeny;
