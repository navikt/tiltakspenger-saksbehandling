import { ActionMenu, Button } from '@navikt/ds-react';
import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    ChevronDownIcon,
    PauseIcon,
    PersonIcon,
    PlayIcon,
    TrashIcon,
} from '@navikt/aksel-icons';
import { useState } from 'react';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import {
    eierMeldekortbehandling,
    erMeldekortbehandlingSattPaVent,
    skalKunneGjenopptaMeldekortbehandling,
    skalKunneOvertaMeldekortbehandling,
    skalKunneSetteMeldekortbehandlingPaVent,
    skalKunneTaMeldekortbehandling,
} from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
import { MeldekortbehandlingTildelMeg } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingTildelMeg';
import { MeldekortbehandlingGjenoppta } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingGjenoppta';
import { MeldekortbehandlingLeggTilbake } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingLeggTilbake';
import { MeldekortbehandlingSettPåVent } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingSettPåVent';
import { MeldekortbehandlingOverta } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingOverta';
import { MeldekortbehandlingAvslutt } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/handlinger/MeldekortbehandlingAvslutt';

type AktivDialog = 'tildelMeg' | 'gjenoppta' | 'leggTilbake' | 'settPåVent' | 'overta' | 'avslutt';

export const MeldekortbehandlingHandlingerMeny = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const meldekortbehandling = useMeldekortbehandling();

    const [aktivDialog, setAktivDialog] = useState<AktivDialog | null>(null);

    const erSattPåVent = erMeldekortbehandlingSattPaVent(meldekortbehandling);
    const eierBehandlingen = eierMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler);
    const kanTa = skalKunneTaMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler);
    const kanGjenoppta = skalKunneGjenopptaMeldekortbehandling(
        meldekortbehandling,
        innloggetSaksbehandler,
    );
    const kanOverta = skalKunneOvertaMeldekortbehandling(
        meldekortbehandling,
        innloggetSaksbehandler,
    );
    const kanSettePåVent = skalKunneSetteMeldekortbehandlingPaVent(
        meldekortbehandling,
        innloggetSaksbehandler,
    );

    const erTilknyttetBehandlingen =
        innloggetSaksbehandler.navIdent === meldekortbehandling.saksbehandler ||
        innloggetSaksbehandler.navIdent === meldekortbehandling.beslutter;

    const skalViseEierMenyvalg = eierBehandlingen && !erSattPåVent;
    const skalViseLeggTilbakeMenyvalg = eierBehandlingen;
    const skalViseOvertaMenyvalg = kanOverta && !erSattPåVent && !erTilknyttetBehandlingen;

    const harHandlinger =
        kanTa ||
        kanGjenoppta ||
        skalViseLeggTilbakeMenyvalg ||
        kanSettePåVent ||
        skalViseOvertaMenyvalg ||
        skalViseEierMenyvalg;

    if (!harHandlinger) {
        return null;
    }

    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant={'secondary'}
                        icon={<ChevronDownIcon aria-hidden />}
                        iconPosition={'right'}
                        size={'small'}
                    >
                        {'Handlinger'}
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    {kanTa && (
                        <ActionMenu.Item
                            icon={<PersonIcon aria-hidden />}
                            onSelect={() => setAktivDialog('tildelMeg')}
                        >
                            {'Tildel meg'}
                        </ActionMenu.Item>
                    )}

                    {kanGjenoppta && (
                        <ActionMenu.Item
                            icon={<PlayIcon aria-hidden />}
                            onSelect={() => setAktivDialog('gjenoppta')}
                        >
                            {'Gjenoppta'}
                        </ActionMenu.Item>
                    )}

                    {skalViseLeggTilbakeMenyvalg && (
                        <ActionMenu.Item
                            icon={<ArrowUndoIcon aria-hidden />}
                            onSelect={() => setAktivDialog('leggTilbake')}
                        >
                            {'Legg tilbake'}
                        </ActionMenu.Item>
                    )}

                    {kanSettePåVent && (
                        <ActionMenu.Item
                            icon={<PauseIcon aria-hidden />}
                            onSelect={() => setAktivDialog('settPåVent')}
                        >
                            {'Sett på vent'}
                        </ActionMenu.Item>
                    )}

                    {skalViseOvertaMenyvalg && (
                        <ActionMenu.Item
                            icon={<ArrowsSquarepathIcon aria-hidden />}
                            onSelect={() => setAktivDialog('overta')}
                        >
                            {'Overta behandling'}
                        </ActionMenu.Item>
                    )}

                    {skalViseEierMenyvalg && (
                        <>
                            <ActionMenu.Divider />
                            <ActionMenu.Item
                                variant={'danger'}
                                icon={<TrashIcon aria-hidden />}
                                onSelect={() => setAktivDialog('avslutt')}
                            >
                                {'Avslutt behandling'}
                            </ActionMenu.Item>
                        </>
                    )}
                </ActionMenu.Content>
            </ActionMenu>

            {kanTa && (
                <MeldekortbehandlingTildelMeg
                    åpen={aktivDialog === 'tildelMeg'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {kanGjenoppta && (
                <MeldekortbehandlingGjenoppta
                    åpen={aktivDialog === 'gjenoppta'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {skalViseLeggTilbakeMenyvalg && (
                <MeldekortbehandlingLeggTilbake
                    åpen={aktivDialog === 'leggTilbake'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {kanSettePåVent && (
                <MeldekortbehandlingSettPåVent
                    åpen={aktivDialog === 'settPåVent'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {skalViseOvertaMenyvalg && (
                <MeldekortbehandlingOverta
                    åpen={aktivDialog === 'overta'}
                    onClose={() => setAktivDialog(null)}
                />
            )}

            {skalViseEierMenyvalg && (
                <MeldekortbehandlingAvslutt
                    åpen={aktivDialog === 'avslutt'}
                    onClose={() => setAktivDialog(null)}
                />
            )}
        </>
    );
};
