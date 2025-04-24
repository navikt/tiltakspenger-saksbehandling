import React from 'react';
import { Button, VStack } from '@navikt/ds-react';
import Link from 'next/link';

import style from './MeldekortBehandlingKnapper.module.css';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../../../types/meldekort/MeldekortBehandling';
import { eierMeldekortBehandling } from '../../../utils/tilganger';
import { useSaksbehandler } from '../../../context/saksbehandler/SaksbehandlerContext';
import OvertaMeldekortBehandling from './OvertaMeldekortBehandling';
import { SakId } from '../../../types/SakTypes';

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

    switch (status) {
        case MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING:
            if (!eierMeldekortBehandling(meldekortBehandling, innloggetSaksbehandler)) {
                if (
                    innloggetSaksbehandler.navIdent === meldekortBehandling.saksbehandler ||
                    innloggetSaksbehandler.navIdent === meldekortBehandling.beslutter
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
    }

    return null;
};
