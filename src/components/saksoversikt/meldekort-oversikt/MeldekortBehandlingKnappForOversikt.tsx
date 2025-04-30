import React from 'react';
import { Button, VStack } from '@navikt/ds-react';
import Link from 'next/link';

import style from './MeldekortBehandlingKnapper.module.css';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../../../types/meldekort/MeldekortBehandling';
import {
    eierMeldekortBehandling,
    skalKunneOvertaMeldekortBehandling,
    skalKunneTaMeldekortBehandling,
} from '../../../utils/tilganger';
import { useSaksbehandler } from '../../../context/saksbehandler/SaksbehandlerContext';
import OvertaMeldekortBehandling from './OvertaMeldekortBehandling';
import { SakId } from '../../../types/SakTypes';
import router from 'next/router';
import { useTaMeldekortBehandling } from './useTaMeldekortBehandling';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    sakId: SakId;
    meldeperiodeUrl: string;
};

export const MeldekortBehandlingKnappForOversikt = ({
    meldekortBehandling,
    sakId,
    meldeperiodeUrl,
}: Props) => {
    const { status, id } = meldekortBehandling;

    const { innloggetSaksbehandler } = useSaksbehandler();
    const { taMeldekortBehandling, isMeldekortBehandlingMutating } = useTaMeldekortBehandling(
        sakId,
        id,
    );

    switch (status) {
        case MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING:
        case MeldekortBehandlingStatus.UNDER_BESLUTNING:
            if (!eierMeldekortBehandling(meldekortBehandling, innloggetSaksbehandler)) {
                if (
                    innloggetSaksbehandler.navIdent === meldekortBehandling.saksbehandler ||
                    innloggetSaksbehandler.navIdent === meldekortBehandling.beslutter
                ) {
                    return null;
                }

                if (
                    !skalKunneOvertaMeldekortBehandling(meldekortBehandling, innloggetSaksbehandler)
                ) {
                    return null;
                }

                return (
                    <OvertaMeldekortBehandling
                        sakId={sakId}
                        meldekortBehandlingId={id}
                        overtarFra={
                            meldekortBehandling.status ===
                            MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING
                                ? meldekortBehandling.saksbehandler!
                                : meldekortBehandling.status ===
                                    MeldekortBehandlingStatus.UNDER_BESLUTNING
                                  ? meldekortBehandling.beslutter!
                                  : 'Ukjent saksbehandler/beslutter'
                        }
                        meldeperiodeUrl={meldeperiodeUrl}
                    />
                );
            }

            return (
                <VStack align="start" gap="2">
                    <Button
                        className={style.knapp}
                        size="small"
                        variant="secondary"
                        as={Link}
                        href={meldeperiodeUrl}
                    >
                        Fortsett
                    </Button>
                </VStack>
            );

        case MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING: {
            if (!skalKunneTaMeldekortBehandling(meldekortBehandling, innloggetSaksbehandler)) {
                break;
            }

            return (
                <Button
                    className={style.knapp}
                    size={'small'}
                    variant={'primary'}
                    loading={isMeldekortBehandlingMutating}
                    as={'a'}
                    href={meldeperiodeUrl}
                    onClick={(e) => {
                        e.preventDefault();
                        taMeldekortBehandling().then(() => {
                            router.push(meldeperiodeUrl);
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
