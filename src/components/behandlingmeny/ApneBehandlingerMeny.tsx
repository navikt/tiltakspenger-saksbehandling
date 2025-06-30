import React, { useState } from 'react';
import { ActionMenu, Button } from '@navikt/ds-react';
import {
    BehandlingForOversiktData,
    BehandlingStatus,
    Behandlingstype,
} from '~/types/BehandlingTypes';
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

type Props = {
    behandling: BehandlingForOversiktData;
    medAvsluttBehandling: boolean;
};

export const ApneBehandlingerMeny = ({ behandling, medAvsluttBehandling }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { status, id, saksnummer } = behandling;
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);
    const [visOvertaBehandlingModal, setVisOvertaBehandlingModal] = useState(false);

    const visTildelMeg = visTildelMegMenyvalg(behandling, innloggetSaksbehandler);
    const visFortsettBehandling = visFortsettBehandlingMenyvalg(behandling, innloggetSaksbehandler);
    const visLeggTilbake = visLeggTilbakeMenyvalg(behandling, innloggetSaksbehandler);
    const visOvertaBehandling = visOvertaBehandlingMenyvalg(behandling, innloggetSaksbehandler);
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
        visAvsluttBehandling;

    if (!menySkalVises) {
        return (
            <Button
                variant={'secondary'}
                as={Link}
                href={`/behandling/${behandling.id}`}
                size={'small'}
            >
                Se behandling
            </Button>
        );
    }

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
                    {visTildelMeg && <TildelMegMenyvalg behandling={behandling} />}
                    {menySkalVises && (
                        <>
                            <ActionMenu.Divider />
                            <SeBehandlingMenyvalg behandlingHref={`/behandling/${behandling.id}`} />
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
                                behandlingsId={id}
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
                    søknadsId={null}
                    behandlingsId={behandling.id ?? null}
                    tittel={`Avslutt ${behandling.typeBehandling === Behandlingstype.REVURDERING ? 'revurdering' : 'behandling'}`}
                    tekst={`Er du sikker på at du vil avslutte ${behandling.typeBehandling === Behandlingstype.REVURDERING ? 'revurderingen' : 'behandling av søknad'}?`}
                    textareaLabel={`Hvorfor avsluttes ${behandling.typeBehandling === Behandlingstype.REVURDERING ? 'revurderingen' : 'behandlingen'}? (obligatorisk)`}
                />
            )}
            {visOvertaBehandlingModal && (
                <OvertabehandlingModal
                    åpen={visOvertaBehandlingModal}
                    onClose={() => setVisOvertaBehandlingModal(false)}
                    sakId={behandling.sakId}
                    behandlingId={behandling.id}
                    overtarFra={
                        behandling.status === BehandlingStatus.UNDER_BEHANDLING
                            ? behandling.saksbehandler!
                            : behandling.status === BehandlingStatus.UNDER_BESLUTNING
                              ? behandling.beslutter!
                              : 'Ukjent saksbehandler/beslutter'
                    }
                />
            )}
        </>
    );
};
