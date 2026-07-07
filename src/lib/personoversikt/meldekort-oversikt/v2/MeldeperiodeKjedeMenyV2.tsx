import { ActionMenu, Button } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

// TODO: Egen handlingsmeny for meldeperiodekjeder. Foreløpig bare en placeholder.
export const MeldeperiodeKjedeMenyV2 = ({ meldeperiodeKjede }: Props) => {
    void meldeperiodeKjede;

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button
                    variant={'secondary'}
                    icon={<MenuElipsisVerticalIcon aria-hidden />}
                    iconPosition={'right'}
                    size={'small'}
                >
                    {'Meny'}
                </Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                <ActionMenu.Item disabled>{'Ingen handlinger tilgjengelig'}</ActionMenu.Item>
            </ActionMenu.Content>
        </ActionMenu>
    );
};
