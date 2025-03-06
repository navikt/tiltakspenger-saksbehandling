import React from 'react';
import { Button, VStack } from '@navikt/ds-react';
import { BehandlingForOversiktData, BehandlingStatus } from '../../types/BehandlingTypes';
import { useTaBehandling } from './useTaBehandling';
import AvsluttBehandling from '../saksoversikt/avsluttBehandling/AvsluttBehandling';
import { useSaksbehandler } from '../../context/saksbehandler/SaksbehandlerContext';
import { eierBehandling, skalKunneTaBehandling } from '../../utils/tilganger';
import Link from 'next/link';
import router from 'next/router';

import style from './BehandlingKnapper.module.css';

type Props = {
    behandling: BehandlingForOversiktData;
    medAvsluttBehandling?: boolean;
};

export const BehandlingKnappForOversikt = ({ behandling, medAvsluttBehandling }: Props) => {
    const { status, id, saksnummer } = behandling;

    const { innloggetSaksbehandler } = useSaksbehandler();
    const { taBehandling, isBehandlingMutating } = useTaBehandling(id);

    const behandlingLenke = `/behandling/${id}`;

    switch (status) {
        case BehandlingStatus.UNDER_BEHANDLING:
        case BehandlingStatus.UNDER_BESLUTNING: {
            if (!eierBehandling(behandling, innloggetSaksbehandler)) {
                break;
            }

            return (
                <VStack align="start" gap="2">
                    <Button
                        className={style.knapp}
                        size="small"
                        variant="secondary"
                        as={Link}
                        href={behandlingLenke}
                    >
                        Fortsett
                    </Button>
                    {medAvsluttBehandling && (
                        <AvsluttBehandling saksnummer={saksnummer} behandlingsId={id} />
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
