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

    const behandlingLenke = `/behandling/${id}`;

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
                    onClick={() => {
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
