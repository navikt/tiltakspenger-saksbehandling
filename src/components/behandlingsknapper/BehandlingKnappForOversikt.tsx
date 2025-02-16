import React from 'react';
import { Button } from '@navikt/ds-react';
import { BehandlingForOversikt, BehandlingStatus } from '../../types/BehandlingTypes';
import { useTaBehandling } from '../../hooks/useTaBehandling';
import { useSaksbehandler } from '../../hooks/useSaksbehandler';
import { eierBehandling, skalKunneTaBehandling } from '../../utils/tilganger';
import Link from 'next/link';
import router from 'next/router';

import style from './BehandlingKnapper.module.css';

type Props = {
    behandling: BehandlingForOversikt;
};

export const BehandlingKnappForOversikt = ({ behandling }: Props) => {
    const { status, id } = behandling;

    const { innloggetSaksbehandler } = useSaksbehandler();
    const { taBehandling, isBehandlingMutating, taBehandlingError } = useTaBehandling();

    switch (status) {
        case BehandlingStatus.UNDER_BEHANDLING:
        case BehandlingStatus.UNDER_BESLUTNING: {
            if (!eierBehandling(behandling, innloggetSaksbehandler)) {
                break;
            }

            return (
                <Button
                    className={style.knapp}
                    size={'small'}
                    variant={'secondary'}
                    as={Link}
                    href={finnBehandlingslenke(id, status)}
                >
                    {'Fortsett'}
                </Button>
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
                    onClick={() =>
                        taBehandling({ id }).then((oppdatertBehandling) => {
                            router.push(
                                finnBehandlingslenke(
                                    oppdatertBehandling.id,
                                    oppdatertBehandling.status,
                                ),
                            );
                        })
                    }
                >
                    {'Tildel meg'}
                </Button>
            );
        }
    }

    return null;
};

const finnBehandlingslenke = (behandlingId: string, status: BehandlingStatus) => {
    switch (status) {
        case BehandlingStatus.KLAR_TIL_BEHANDLING:
        case BehandlingStatus.UNDER_BEHANDLING:
            return `/behandling/${behandlingId}/inngangsvilkar/kravfrist`;
        case BehandlingStatus.KLAR_TIL_BESLUTNING:
        case BehandlingStatus.UNDER_BESLUTNING:
            return `/behandling/${behandlingId}/oppsummering`;
        default:
            return '/';
    }
};
