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
import { useLeggTilbakeMeldekortBehandling } from './useLeggTilbakeMeldekortBehandling';
import { TriggerWithOptionsArgs } from 'swr/mutation';
import { FetcherError } from '../../../utils/fetch/fetch';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    sakId: SakId;
    meldeperiodeUrl: string;
    saksnummer: string;
};

export const MeldekortBehandlingKnappForOversikt = ({
    meldekortBehandling,
    sakId,
    meldeperiodeUrl,
    saksnummer,
}: Props) => {
    const { status, id } = meldekortBehandling;

    const { innloggetSaksbehandler } = useSaksbehandler();
    const { taMeldekortBehandling, isMeldekortBehandlingMutating } = useTaMeldekortBehandling(
        sakId,
        id,
    );
    const { leggTilbakeMeldekortBehandling, isLeggTilbakeMeldekortBehandlingMutating } =
        useLeggTilbakeMeldekortBehandling(sakId, id);

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
                    skalKunneOvertaMeldekortBehandling(meldekortBehandling, innloggetSaksbehandler)
                ) {
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

                if (skalKunneTaMeldekortBehandling(meldekortBehandling, innloggetSaksbehandler)) {
                    return (
                        <TildelMegButton
                            isMeldekortBehandlingMutating={isMeldekortBehandlingMutating}
                            meldeperiodeUrl={meldeperiodeUrl}
                            taMeldekortBehandling={taMeldekortBehandling}
                        />
                    );
                }

                return null;
            }

            return (
                <VStack align="start" gap="2">
                    <Button
                        className={style.knapp}
                        size="small"
                        variant="primary"
                        as={Link}
                        href={meldeperiodeUrl}
                    >
                        Fortsett
                    </Button>
                    <Button
                        className={style.knapp}
                        size={'small'}
                        variant={'secondary'}
                        loading={isLeggTilbakeMeldekortBehandlingMutating}
                        as={'a'}
                        onClick={(e) => {
                            e.preventDefault();
                            leggTilbakeMeldekortBehandling().then(() => {
                                router.push(`/sak/${saksnummer}`);
                            });
                        }}
                    >
                        {'Legg tilbake'}
                    </Button>
                </VStack>
            );

        case MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING: {
            if (!skalKunneTaMeldekortBehandling(meldekortBehandling, innloggetSaksbehandler)) {
                break;
            }

            return (
                <TildelMegButton
                    isMeldekortBehandlingMutating={isMeldekortBehandlingMutating}
                    meldeperiodeUrl={meldeperiodeUrl}
                    taMeldekortBehandling={taMeldekortBehandling}
                />
            );
        }
    }

    return null;
};

const TildelMegButton = (props: {
    isMeldekortBehandlingMutating: boolean;
    meldeperiodeUrl: string;
    taMeldekortBehandling: TriggerWithOptionsArgs<
        MeldekortBehandlingProps | undefined,
        FetcherError,
        string,
        undefined
    >;
}) => {
    return (
        <div>
            <Button
                className={style.knapp}
                size={'small'}
                variant={'primary'}
                loading={props.isMeldekortBehandlingMutating}
                as={'a'}
                href={props.meldeperiodeUrl}
                onClick={(e) => {
                    e.preventDefault();
                    props.taMeldekortBehandling().then(() => {
                        router.push(props.meldeperiodeUrl);
                    });
                }}
            >
                {'Tildel meg'}
            </Button>
        </div>
    );
};
