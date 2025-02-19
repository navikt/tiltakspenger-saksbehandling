import React from 'react';
import { Button } from '@navikt/ds-react';
import { BehandlingForOversiktData, BehandlingStatus } from '../../types/BehandlingTypes';
import { useTaBehandling } from '../../hooks/useTaBehandling';
import { useSaksbehandler } from '../../hooks/useSaksbehandler';
import { eierBehandling, skalKunneTaBehandling } from '../../utils/tilganger';
import Link from 'next/link';
import router from 'next/router';

import style from './BehandlingKnapper.module.css';

type Props = {
    behandling: BehandlingForOversiktData;
};

export const BehandlingKnappForOversikt = ({ behandling }: Props) => {
    const { status, id } = behandling;

    const { innloggetSaksbehandler } = useSaksbehandler();
    const { taBehandling, isBehandlingMutating } = useTaBehandling();

    const behandlingLenke = finnBehandlingslenke(behandling);

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
                    href={behandlingLenke}
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
                    as={Link}
                    href={behandlingLenke}
                    onClick={(e) => {
                        e.preventDefault();
                        taBehandling({ id }).then(() => {
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

const finnBehandlingslenke = (behandling: BehandlingForOversiktData) => {
    const { id, status, erDeprecatedBehandling } = behandling;

    switch (status) {
        case BehandlingStatus.KLAR_TIL_BEHANDLING:
        case BehandlingStatus.UNDER_BEHANDLING:
            return erDeprecatedBehandling
                ? `/behandling/${id}/inngangsvilkar/kravfrist`
                : `/behandling/${id}`;
        case BehandlingStatus.KLAR_TIL_BESLUTNING:
        case BehandlingStatus.UNDER_BESLUTNING:
            return erDeprecatedBehandling ? `/behandling/${id}/oppsummering` : `/behandling/${id}`;
        default:
            return '/';
    }
};
