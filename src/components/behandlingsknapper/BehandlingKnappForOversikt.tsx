import React from 'react';
import { Button, VStack } from '@navikt/ds-react';
import {
    BehandlingForOversiktData,
    BehandlingStatus,
    Behandlingstype,
} from '../../types/BehandlingTypes';
import { useTaBehandling } from './useTaBehandling';
import AvsluttBehandling from '../saksoversikt/avsluttBehandling/AvsluttBehandling';
import { useSaksbehandler } from '../../context/saksbehandler/SaksbehandlerContext';
import { eierBehandling, skalKunneTaBehandling } from '../../utils/tilganger';
import Link from 'next/link';
import router from 'next/router';

import style from './BehandlingKnapper.module.css';
import OvertaBehandling from './OvertaBehandling';
import { useLeggTilbakeBehandling } from './useLeggTilbakeBehandling';

type Props = {
    behandling: BehandlingForOversiktData;
    medAvsluttBehandling?: boolean;
};

export const BehandlingKnappForOversikt = ({ behandling, medAvsluttBehandling }: Props) => {
    const { status, id, saksnummer, sakId } = behandling;

    const { innloggetSaksbehandler } = useSaksbehandler();
    const { taBehandling, isBehandlingMutating } = useTaBehandling(sakId, id);
    const { leggTilbakeBehandling, isLeggTilbakeBehandlingMutating } = useLeggTilbakeBehandling(
        sakId,
        id,
    );

    const behandlingLenke = `/behandling/${id}`;

    switch (status) {
        case BehandlingStatus.UNDER_BEHANDLING:
        case BehandlingStatus.UNDER_BESLUTNING: {
            if (!eierBehandling(behandling, innloggetSaksbehandler)) {
                if (
                    innloggetSaksbehandler.navIdent === behandling.saksbehandler ||
                    innloggetSaksbehandler.navIdent === behandling.beslutter
                ) {
                    return null;
                }

                return (
                    <OvertaBehandling
                        sakId={sakId}
                        behandlingId={id}
                        overtarFra={
                            behandling.status === BehandlingStatus.UNDER_BEHANDLING
                                ? behandling.saksbehandler!
                                : behandling.status === BehandlingStatus.UNDER_BESLUTNING
                                  ? behandling.beslutter!
                                  : 'Ukjent saksbehandler/beslutter'
                        }
                    />
                );
            }

            return (
                <VStack align="start" gap="2">
                    <Button
                        className={style.knapp}
                        size="small"
                        variant="primary"
                        as={Link}
                        href={behandlingLenke}
                    >
                        Fortsett
                    </Button>
                    <Button
                        className={style.knapp}
                        size={'small'}
                        variant={'secondary'}
                        loading={isLeggTilbakeBehandlingMutating}
                        as={'a'}
                        onClick={(e) => {
                            e.preventDefault();
                            leggTilbakeBehandling().then(() => {
                                router.push(`/sak/${behandling.saksnummer}`);
                            });
                        }}
                    >
                        {'Legg tilbake'}
                    </Button>
                    {medAvsluttBehandling && status === BehandlingStatus.UNDER_BEHANDLING && (
                        <AvsluttBehandling
                            saksnummer={saksnummer}
                            behandlingsId={id}
                            modal={{
                                tittel: `Avslutt ${behandling.typeBehandling === Behandlingstype.REVURDERING ? 'revurdering' : 'behandling'}`,
                                tekst: `Er du sikker på at du vil avslutte ${behandling.typeBehandling === Behandlingstype.REVURDERING ? 'revurderingen' : 'behandling av søknad'}?`,
                                textareaLabel: `Hvorfor avsluttes ${behandling.typeBehandling === Behandlingstype.REVURDERING ? 'revurderingen' : 'behandlingen'}? (obligatorisk)`,
                            }}
                        />
                    )}
                </VStack>
            );
        }
        case BehandlingStatus.KLAR_TIL_BEHANDLING:
        case BehandlingStatus.KLAR_TIL_BESLUTNING: {
            if (!skalKunneTaBehandling(behandling, innloggetSaksbehandler)) {
                break;
            }

            return (
                <Button
                    className={style.knapp}
                    size={'small'}
                    variant={'primary'}
                    loading={isBehandlingMutating}
                    as={'a'}
                    href={behandlingLenke}
                    onClick={(e) => {
                        e.preventDefault();
                        taBehandling().then(() => {
                            router.push(behandlingLenke);
                        });
                    }}
                >
                    {'Tildel meg'}
                </Button>
            );
        }
    }

    return null;
};
