import React, { useState } from 'react';
import { ActionMenu, Button } from '@navikt/ds-react';
import { visOvertaBehandlingMenyvalg } from './menyvalg/OvertaBehandlingMenyvalg';
import AvsluttBehandlingMenyvalg from '~/lib/personoversikt/avsluttBehandling/AvsluttBehandlingMenyvalg';
import LeggTilbakeBehandlingMenyValg, {
    visLeggTilbakeMenyvalg,
} from '~/lib/behandling-felles/behandlingmeny/menyvalg/LeggTilbakeBehandlingMenyvalg';
import { visTildelMegMenyvalg } from '~/lib/behandling-felles/behandlingmeny/menyvalg/TildelMegMenyvalg';
import { ArrowRightIcon, MenuElipsisVerticalIcon, PersonIcon } from '@navikt/aksel-icons';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';

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
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { useAvsluttBehandling } from './useAvsluttBehandling';
import { useSak } from '~/lib/sak/SakContext';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { eierBehandlingSomKanAvbrytes } from '~/lib/saksbehandler/tilganger';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import router from 'next/router';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSettBehandlingPåVent } from './useSettBehandlingPåVent';
import { ApiErrorFeilModal, ApiErrorState } from '~/lib/_felles/modaler/ApiErrorFeilModal';
import AvbrytRammebehandlingModal from '~/lib/rammebehandling/modaler/AvbrytRammebehandlingModal';

type Props = {
    behandling: Rammebehandling;
    medAvsluttBehandling: boolean;
};

const visAvsluttBehandlingMenyvalg = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
    behandlingKanAvsluttes: boolean,
) => {
    return (
        behandlingKanAvsluttes &&
        eierBehandlingSomKanAvbrytes(behandling, innloggetSaksbehandler) &&
        !erBehandlingSattPåVent(behandling)
    );
};

export const ApneBehandlingerMeny = ({ behandling, medAvsluttBehandling }: Props) => {
    const { id } = behandling;
    const { sak, setSak } = useSak();
    const { sakId, saksnummer } = sak;
    const { innloggetSaksbehandler } = useSaksbehandler();
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);
    const [visOvertaBehandlingModal, setVisOvertaBehandlingModal] = useState(false);
    const [visSettBehandlingPåVentModal, setVisSettBehandlingPåVentModal] = useState(false);
    const [apiError, setApiError] = React.useState<ApiErrorState>({
        visFeilModal: false,
        feil: null,
    });

    const visTildelMeg = visTildelMegMenyvalg(behandling, innloggetSaksbehandler);
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
        visLeggTilbake ||
        visOvertaBehandling ||
        visSettBehandlingPåVent ||
        visGjenopptaBehandling ||
        visAvsluttBehandling;

    const { avsluttBehandling, avsluttBehandlingIsMutating, avsluttBehandlingError } =
        useAvsluttBehandling(saksnummer, (oppdatertSak) => {
            setSak(oppdatertSak);
            setVisAvsluttBehandlingModal(false);
        });

    const { settBehandlingPåVent, isSettBehandlingPåVentMutating, settBehandlingPåVentError } =
        useSettBehandlingPåVent(sakId, id);

    const overtaBehandlingApi = useFetchJsonFraApi<Rammebehandling, { overtarFra: string }>(
        `/sak/${sakId}/behandling/${id}/overta`,
        'PATCH',
        {
            onSuccess: (oppdatertBehandling) => {
                if (oppdatertBehandling) {
                    router.push(behandlingUrl(oppdatertBehandling));
                }
            },
        },
    );

    const behandlingLenke = behandlingUrl({ saksnummer, id });

    const taBehandling = useFetchJsonFraApi<Rammebehandling>(
        `/sak/${sakId}/behandling/${id}/ta`,
        'POST',
        {
            onSuccess: () => {
                router.push(behandlingLenke);
            },
            onError: (error) => setApiError({ visFeilModal: true, feil: error }),
        },
    );

    if (!menySkalVises) {
        return null;
    }

    const erRevurdering = behandling.type === Rammebehandlingstype.REVURDERING;

    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant={'secondary'}
                        iconPosition={'right'}
                        icon={<MenuElipsisVerticalIcon aria-hidden />}
                        size={'small'}
                    >
                        {'Meny'}
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
                    {visLeggTilbake && (
                        <LeggTilbakeBehandlingMenyValg
                            behandling={behandling}
                            onSuccess={(oppdatertSak) => setSak(oppdatertSak)}
                            onError={(error) => setApiError({ visFeilModal: true, feil: error })}
                        />
                    )}
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
                        error: avsluttBehandlingError ?? null,
                        saksnummer,
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
                                sakId,
                                behandlingId: id,
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
