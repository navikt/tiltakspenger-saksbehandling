import React, { useState } from 'react';
import { ActionMenu, Button } from '@navikt/ds-react';
import {
    ÅpenBehandlingForOversiktType,
    ÅpenRammebehandlingForOversikt,
} from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { visOvertaBehandlingMenyvalg } from './menyvalg/OvertaBehandlingMenyvalg';
import AvsluttBehandlingMenyvalg from '~/lib/personoversikt/avsluttBehandling/AvsluttBehandlingMenyvalg';
import FortsettBehandlingMenyvalg, {
    visFortsettBehandlingMenyvalg,
} from '~/lib/behandling-felles/behandlingmeny/menyvalg/FortsettBehandlingMenyvalg';
import LeggTilbakeBehandlingMenyValg, {
    visLeggTilbakeMenyvalg,
} from '~/lib/behandling-felles/behandlingmeny/menyvalg/LeggTilbakeBehandlingMenyvalg';
import { visTildelMegMenyvalg } from '~/lib/behandling-felles/behandlingmeny/menyvalg/TildelMegMenyvalg';
import { ArrowRightIcon, ChevronDownIcon, PersonIcon } from '@navikt/aksel-icons';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import SeBehandlingMenyvalg from '~/lib/behandling-felles/behandlingmeny/menyvalg/SeBehandlingMenyvalg';

import OvertabehandlingModal from '~/lib/behandling-felles/behandlingmeny/OvertaBehandlingModal';
import Link from 'next/link';
import SettBehandlingPåVentMenyvalg, {
    visSettBehandlingPåVentMenyvalg,
} from '~/lib/behandling-felles/behandlingmeny/menyvalg/SettBehandlingPåVentMenyvalg';
import GjenopptaBehandlingMenyvalg, {
    visGjenopptaBehandlingMenyvalg,
} from '~/lib/behandling-felles/behandlingmeny/menyvalg/GjenopptaBehandlingMenyvalg';
import SettBehandlingPåVentModal from '~/lib/_felles/modaler/SettBehandlingPåVentModal';
import { behandlingUrl } from '~/utils/urls';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { useAvsluttBehandling } from './useAvsluttBehandling';
import { useSak } from '~/lib/sak/SakContext';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { eierBehandling, erSattPaVent } from '~/lib/saksbehandler/tilganger';
import router from 'next/router';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSettBehandlingPåVent } from './useSettBehandlingPåVent';
import { ApiErrorFeilModal, ApiErrorState } from '~/lib/_felles/modaler/ApiErrorFeilModal';
import AvbrytRammebehandlingModal from '~/lib/rammebehandling/modaler/AvbrytRammebehandlingModal';

type Props = {
    behandling: ÅpenRammebehandlingForOversikt;
    medAvsluttBehandling: boolean;
};

const visAvsluttBehandlingMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
    behandlingKanAvsluttes: boolean,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING;
    return (
        behandlingKanAvsluttes &&
        erRelevantMenyValgForStatus &&
        eierBehandling(behandling, innloggetSaksbehandler) &&
        !erSattPaVent(behandling)
    );
};

export const ApneBehandlingerMeny = ({ behandling, medAvsluttBehandling }: Props) => {
    const { id } = behandling;
    const { sak, setSak } = useSak();
    const { innloggetSaksbehandler } = useSaksbehandler();
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);
    const [visOvertaBehandlingModal, setVisOvertaBehandlingModal] = useState(false);
    const [visSettBehandlingPåVentModal, setVisSettBehandlingPåVentModal] = useState(false);
    const [apiError, setApiError] = React.useState<ApiErrorState>({
        visFeilModal: false,
        feil: null,
    });

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

    const { avsluttBehandling, avsluttBehandlingIsMutating, avsluttBehandlingError } =
        useAvsluttBehandling(behandling.saksnummer, (oppdatertSak) => {
            setSak(oppdatertSak);
            setVisAvsluttBehandlingModal(false);
        });

    const { settBehandlingPåVent, isSettBehandlingPåVentMutating, settBehandlingPåVentError } =
        useSettBehandlingPåVent(behandling.sakId, behandling.id);

    const overtaBehandlingApi = useFetchJsonFraApi<Rammebehandling, { overtarFra: string }>(
        `/sak/${sak.sakId}/behandling/${behandling.id}/overta`,
        'PATCH',
        {
            onSuccess: (behandling) => {
                if (behandling) {
                    router.push(behandlingUrl(behandling));
                }
            },
        },
    );

    const behandlingLenke = behandlingUrl(behandling);

    const taBehandling = useFetchJsonFraApi<Rammebehandling>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/ta`,
        'POST',
        {
            onSuccess: () => {
                router.push(behandlingLenke);
            },
            onError: (error) => setApiError({ visFeilModal: true, feil: error }),
        },
    );

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
                        <ActionMenu.Item
                            icon={<ArrowRightIcon aria-hidden />}
                            onClick={() => {
                                setVisOvertaBehandlingModal(true);
                            }}
                        >
                            Overta behandling
                        </ActionMenu.Item>
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
                    {visTildelMeg && (
                        <ActionMenu.Item
                            as={Link}
                            href={behandlingLenke}
                            onClick={(e) => {
                                e.preventDefault();
                                taBehandling.trigger();
                            }}
                            icon={<PersonIcon aria-hidden />}
                        >
                            {'Tildel meg'}
                        </ActionMenu.Item>
                    )}
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
                                setVisAvsluttBehandlingModal={setVisAvsluttBehandlingModal}
                            />
                        </>
                    )}
                </ActionMenu.Content>
            </ActionMenu>
            {visAvsluttBehandlingModal && (
                <AvbrytRammebehandlingModal
                    åpen={visAvsluttBehandlingModal}
                    onClose={() => setVisAvsluttBehandlingModal(false)}
                    onSubmit={(begrunnelse) =>
                        avsluttBehandling({
                            behandlingId: id,
                            begrunnelse: begrunnelse,
                        })
                    }
                    tittel={`Avslutt ${erRevurdering ? 'revurdering' : 'behandling'}`}
                    tekst={`Er du sikker på at du vil avslutte ${erRevurdering ? 'revurderingen' : 'behandling av søknad'}?`}
                    textareaLabel={`Hvorfor avsluttes ${erRevurdering ? 'revurderingen' : 'behandlingen'}? (obligatorisk)`}
                    footer={{
                        isMutating: avsluttBehandlingIsMutating,
                        error: avsluttBehandlingError ? avsluttBehandlingError.message : null,
                    }}
                />
            )}
            {visOvertaBehandlingModal && (
                <OvertabehandlingModal
                    åpen={visOvertaBehandlingModal}
                    onClose={() => setVisOvertaBehandlingModal(false)}
                    overtarFra={
                        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING
                            ? behandling.saksbehandler!
                            : behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING
                              ? behandling.beslutter!
                              : 'Ukjent saksbehandler/beslutter'
                    }
                    api={{
                        trigger: overtaBehandlingApi.trigger,
                        isMutating: overtaBehandlingApi.isMutating,
                        error: overtaBehandlingApi.error ?? null,
                    }}
                />
            )}
            {visSettBehandlingPåVentModal && (
                <SettBehandlingPåVentModal
                    åpen={visSettBehandlingPåVentModal}
                    onClose={() => setVisSettBehandlingPåVentModal(false)}
                    api={{
                        trigger: (begrunnelse, frist) =>
                            settBehandlingPåVent({
                                sakId: behandling.sakId,
                                behandlingId: behandling.id,
                                begrunnelse: begrunnelse,
                                frist: frist,
                            }).then((oppdatertSak) => {
                                if (oppdatertSak) {
                                    setSak(oppdatertSak);
                                    setVisSettBehandlingPåVentModal(false);
                                }
                            }),
                        isMutating: isSettBehandlingPåVentMutating,
                        error: settBehandlingPåVentError ?? null,
                    }}
                />
            )}

            {apiError.visFeilModal && (
                <ApiErrorFeilModal
                    åpen={apiError.visFeilModal}
                    onClose={() => setApiError({ visFeilModal: false, feil: null })}
                    error={apiError.feil!}
                />
            )}
        </>
    );
};
