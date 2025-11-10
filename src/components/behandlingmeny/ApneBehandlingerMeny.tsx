import React, { useState } from 'react';
import { ActionMenu, Button } from '@navikt/ds-react';
import {
    ÅpenBehandlingForOversiktType,
    ÅpenRammebehandlingForOversikt,
} from '~/types/ÅpenBehandlingForOversikt';
import OvertaBehandlingMenyvalg, {
    visOvertaBehandlingMenyvalg,
} from './menyvalg/OvertaBehandlingMenyvalg';
import AvsluttBehandlingMenyvalg, {
    visAvsluttBehandlingMenyvalg,
} from '~/components/saksoversikt/avsluttBehandling/AvsluttBehandlingMenyvalg';
import FortsettBehandlingMenyvalg, {
    visFortsettBehandlingMenyvalg,
} from '~/components/behandlingmeny/menyvalg/FortsettBehandlingMenyvalg';
import LeggTilbakeBehandlingMenyValg, {
    visLeggTilbakeMenyvalg,
} from '~/components/behandlingmeny/menyvalg/LeggTilbakeBehandlingMenyvalg';
import TildelMegMenyvalg, {
    visTildelMegMenyvalg,
} from '~/components/behandlingmeny/menyvalg/TildelMegMenyvalg';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import SeBehandlingMenyvalg from '~/components/behandlingmeny/menyvalg/SeBehandlingMenyvalg';
import AvsluttBehandlingModal from '~/components/modaler/AvsluttBehandlingModal';
import OvertabehandlingModal from '~/components/behandlingmeny/OvertaBehandlingModal';
import Link from 'next/link';
import SettBehandlingPåVentMenyvalg, {
    visSettBehandlingPåVentMenyvalg,
} from '~/components/behandlingmeny/menyvalg/SettBehandlingPåVentMenyvalg';
import GjenopptaBehandlingMenyvalg, {
    visGjenopptaBehandlingMenyvalg,
} from '~/components/behandlingmeny/menyvalg/GjenopptaBehandlingMenyvalg';
import SettBehandlingPåVentModal from '~/components/modaler/SettBehandlingPåVentModal';
import { behandlingUrl } from '~/utils/urls';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';

type Props = {
    behandling: ÅpenRammebehandlingForOversikt;
    medAvsluttBehandling: boolean;
};

export const ApneBehandlingerMeny = ({ behandling, medAvsluttBehandling }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { status, id, saksnummer } = behandling;
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);
    const [visOvertaBehandlingModal, setVisOvertaBehandlingModal] = useState(false);
    const [visSettBehandlingPåVentModal, setVisSettBehandlingPåVentModal] = useState(false);

    const visTildelMeg = visTildelMegMenyvalg(behandling, innloggetSaksbehandler);
    const visFortsettBehandling = visFortsettBehandlingMenyvalg(behandling, innloggetSaksbehandler);
    const visLeggTilbake = visLeggTilbakeMenyvalg(behandling, innloggetSaksbehandler);
    const visOvertaBehandling = visOvertaBehandlingMenyvalg(behandling, innloggetSaksbehandler);
    const visSettBehandlingPåVent = visSettBehandlingPåVentMenyvalg(
        behandling,
        innloggetSaksbehandler,
    );
    const visGjenopptaBehandling = visGjenopptaBehandlingMenyvalg(
        behandling,
        innloggetSaksbehandler,
    );
    const visAvsluttBehandling = visAvsluttBehandlingMenyvalg(
        behandling,
        innloggetSaksbehandler,
        medAvsluttBehandling,
    );

    const menySkalVises =
        visTildelMeg ||
        visFortsettBehandling ||
        visLeggTilbake ||
        visOvertaBehandling ||
        visSettBehandlingPåVent ||
        visGjenopptaBehandling ||
        visAvsluttBehandling;

    if (!menySkalVises) {
        return (
            <Button variant={'secondary'} as={Link} href={behandlingUrl(behandling)} size={'small'}>
                Se behandling
            </Button>
        );
    }

    const erRevurdering = behandling.type === ÅpenBehandlingForOversiktType.REVURDERING;

    return (
        <>
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
                    {visOvertaBehandling && (
                        <OvertaBehandlingMenyvalg
                            setVisOvertaBehandlingModal={setVisOvertaBehandlingModal}
                        />
                    )}
                    {visFortsettBehandling && (
                        <FortsettBehandlingMenyvalg behandling={behandling} />
                    )}
                    {visLeggTilbake && <LeggTilbakeBehandlingMenyValg behandling={behandling} />}
                    {visSettBehandlingPåVent && (
                        <SettBehandlingPåVentMenyvalg
                            setVisSettBehandlingPåVentModal={setVisSettBehandlingPåVentModal}
                        />
                    )}
                    {visGjenopptaBehandling && (
                        <GjenopptaBehandlingMenyvalg behandling={behandling} />
                    )}
                    {visTildelMeg && <TildelMegMenyvalg behandling={behandling} />}
                    {menySkalVises && !visFortsettBehandling && (
                        <>
                            <ActionMenu.Divider />
                            <SeBehandlingMenyvalg behandlingHref={behandlingUrl(behandling)} />
                        </>
                    )}
                    {visAvsluttBehandling && (
                        <>
                            <ActionMenu.Divider />
                            <AvsluttBehandlingMenyvalg
                                skalVises={medAvsluttBehandling}
                                setVisAvsluttBehandlingModal={setVisAvsluttBehandlingModal}
                                behandlingStatus={status}
                                saksnummer={saksnummer}
                                behandlingId={id}
                            />
                        </>
                    )}
                </ActionMenu.Content>
            </ActionMenu>
            {medAvsluttBehandling && visAvsluttBehandlingModal && (
                <AvsluttBehandlingModal
                    åpen={visAvsluttBehandlingModal}
                    onClose={() => setVisAvsluttBehandlingModal(false)}
                    saksnummer={behandling.saksnummer}
                    behandlingId={behandling.id}
                    tittel={`Avslutt ${erRevurdering ? 'revurdering' : 'behandling'}`}
                    tekst={`Er du sikker på at du vil avslutte ${erRevurdering ? 'revurderingen' : 'behandling av søknad'}?`}
                    textareaLabel={`Hvorfor avsluttes ${erRevurdering ? 'revurderingen' : 'behandlingen'}? (obligatorisk)`}
                />
            )}
            {visOvertaBehandlingModal && (
                <OvertabehandlingModal
                    åpen={visOvertaBehandlingModal}
                    onClose={() => setVisOvertaBehandlingModal(false)}
                    sakId={behandling.sakId}
                    behandlingId={behandling.id}
                    overtarFra={
                        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING
                            ? behandling.saksbehandler!
                            : behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING
                              ? behandling.beslutter!
                              : 'Ukjent saksbehandler/beslutter'
                    }
                />
            )}
            {visSettBehandlingPåVentModal && (
                <SettBehandlingPåVentModal
                    sakId={behandling.sakId}
                    behandlingId={behandling.id}
                    saksnummer={behandling.saksnummer}
                    åpen={visSettBehandlingPåVentModal}
                    onClose={() => setVisSettBehandlingPåVentModal(false)}
                />
            )}
        </>
    );
};
