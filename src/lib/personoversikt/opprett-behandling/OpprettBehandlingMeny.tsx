import { ActionMenu, Button } from '@navikt/ds-react';
import {
    ArrowsCirclepathIcon,
    ChevronDownIcon,
    FilePlusIcon,
    TasklistSaveIcon,
} from '@navikt/aksel-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakId } from '~/lib/sak/SakTyper';
import { OpprettSøknadModal } from '~/lib/personoversikt/opprett-behandling/manuell-søknad/OpprettSøknadModal';
import { StartRevurderingModal } from '~/lib/personoversikt/opprett-behandling/opprett-revurdering/StartRevurderingModal';
import { opprettKlageUrl } from '~/utils/urls';

type Props = {
    sakId: SakId;
    saksnummer: string;
    behandlinger: Rammebehandling[];
    className?: string;
};

export const OpprettBehandlingMeny = ({ sakId, saksnummer, behandlinger, className }: Props) => {
    const router = useRouter();

    const [startRevurderingModalÅpen, setStartRevurderingModalÅpen] = useState(false);
    const [registrerSøknadManueltModalÅpen, setRegistrerSøknadManueltModalÅpen] = useState(false);

    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant={'tertiary'}
                        icon={<ChevronDownIcon aria-hidden />}
                        iconPosition={'right'}
                        className={className}
                    >
                        {'Opprett behandling'}
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <ActionMenu.Item
                        icon={<FilePlusIcon aria-hidden />}
                        onSelect={() => router.push(opprettKlageUrl(saksnummer))}
                    >
                        {'Registrer klage'}
                    </ActionMenu.Item>

                    <ActionMenu.Item
                        icon={<TasklistSaveIcon aria-hidden />}
                        onClick={() => setRegistrerSøknadManueltModalÅpen(true)}
                    >
                        {'Registrer søknad manuelt'}
                    </ActionMenu.Item>

                    <ActionMenu.Item
                        icon={<ArrowsCirclepathIcon aria-hidden />}
                        onClick={() => setStartRevurderingModalÅpen(true)}
                        disabled={!harVedtattSøknadsbehandling(behandlinger)}
                    >
                        {'Opprett revurdering'}
                    </ActionMenu.Item>
                </ActionMenu.Content>
            </ActionMenu>

            <OpprettSøknadModal
                saksnummer={saksnummer}
                åpen={registrerSøknadManueltModalÅpen}
                setÅpen={setRegistrerSøknadManueltModalÅpen}
            />

            <StartRevurderingModal
                sakId={sakId}
                åpen={startRevurderingModalÅpen}
                setÅpen={setStartRevurderingModalÅpen}
            />
        </>
    );
};

const harVedtattSøknadsbehandling = (behandlingsoversikt: Rammebehandling[]) =>
    behandlingsoversikt.some(
        (behandling) =>
            behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING &&
            behandling.status === Rammebehandlingsstatus.VEDTATT,
    );
