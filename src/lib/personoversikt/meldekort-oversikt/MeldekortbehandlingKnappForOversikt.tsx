import React from 'react';
import { Button, VStack } from '@navikt/ds-react';
import Link from 'next/link';

import style from './MeldekortbehandlingKnapper.module.css';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    eierMeldekortbehandling,
    skalKunneOvertaMeldekortbehandling,
    skalKunneTaMeldekortbehandling,
} from '~/lib/saksbehandler/tilganger';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import OvertaMeldekortbehandling from './OvertaMeldekortbehandling';
import { SakId } from '~/lib/sak/SakTyper';
import router from 'next/router';
import { useTaMeldekortbehandling } from './useTaMeldekortbehandling';
import { useLeggTilbakeMeldekortbehandling } from './useLeggTilbakeMeldekortbehandling';
import { TriggerWithOptionsArgs } from 'swr/mutation';
import { FetcherError } from '~/utils/fetch/fetch';
import AvsluttMeldekortbehandling from './avsluttMeldekortbehandling/AvsluttMeldekortbehandling';
import { PERSONOVERSIKT_TABS } from '~/lib/personoversikt/Personoversikt';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
    sakId: SakId;
    meldeperiodeUrl: string;
    saksnummer: string;
};

export const MeldekortbehandlingKnappForOversikt = ({
    meldekortbehandling,
    sakId,
    meldeperiodeUrl,
    saksnummer,
}: Props) => {
    const { status, id } = meldekortbehandling;

    const { innloggetSaksbehandler } = useSaksbehandler();
    const { taMeldekortbehandling, isMeldekortbehandlingMutating } = useTaMeldekortbehandling(
        sakId,
        id,
    );
    const { leggTilbakeMeldekortbehandling, isLeggTilbakeMeldekortbehandlingMutating } =
        useLeggTilbakeMeldekortbehandling(sakId, id);

    switch (status) {
        case MeldekortbehandlingStatus.UNDER_BEHANDLING:
        case MeldekortbehandlingStatus.UNDER_BESLUTNING:
        case MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING:
            if (!eierMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler)) {
                if (
                    innloggetSaksbehandler.navIdent === meldekortbehandling.saksbehandler ||
                    innloggetSaksbehandler.navIdent === meldekortbehandling.beslutter
                ) {
                    return null;
                }

                if (
                    skalKunneOvertaMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler)
                ) {
                    return (
                        <OvertaMeldekortbehandling
                            sakId={sakId}
                            meldekortbehandlingId={id}
                            overtarFra={
                                meldekortbehandling.status ===
                                MeldekortbehandlingStatus.UNDER_BEHANDLING
                                    ? meldekortbehandling.saksbehandler!
                                    : meldekortbehandling.status ===
                                        MeldekortbehandlingStatus.UNDER_BESLUTNING
                                      ? meldekortbehandling.beslutter!
                                      : 'Ukjent saksbehandler/beslutter'
                            }
                            meldeperiodeUrl={meldeperiodeUrl}
                        />
                    );
                }

                if (skalKunneTaMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler)) {
                    return (
                        <TildelMegButton
                            isMeldekortbehandlingMutating={isMeldekortbehandlingMutating}
                            meldeperiodeUrl={meldeperiodeUrl}
                            taMeldekortbehandling={taMeldekortbehandling}
                        />
                    );
                }

                return null;
            }

            return (
                <VStack align="start" gap="space-8">
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
                        loading={isLeggTilbakeMeldekortbehandlingMutating}
                        as={'a'}
                        onClick={(e) => {
                            e.preventDefault();
                            leggTilbakeMeldekortbehandling().then(() => {
                                router.push(`/sak/${saksnummer}#${PERSONOVERSIKT_TABS.meldekort}`);
                            });
                        }}
                    >
                        {'Legg tilbake'}
                    </Button>
                    <AvsluttMeldekortbehandling
                        sakId={sakId}
                        meldekortbehandlingId={id}
                        personoversiktUrl={`/sak/${saksnummer}`}
                    />
                </VStack>
            );

        case MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING: {
            if (!skalKunneTaMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler)) {
                break;
            }

            return (
                <TildelMegButton
                    isMeldekortbehandlingMutating={isMeldekortbehandlingMutating}
                    meldeperiodeUrl={meldeperiodeUrl}
                    taMeldekortbehandling={taMeldekortbehandling}
                />
            );
        }
    }

    return null;
};

const TildelMegButton = (props: {
    isMeldekortbehandlingMutating: boolean;
    meldeperiodeUrl: string;
    taMeldekortbehandling: TriggerWithOptionsArgs<
        MeldekortbehandlingProps,
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
                loading={props.isMeldekortbehandlingMutating}
                as={'a'}
                href={props.meldeperiodeUrl}
                onClick={(e) => {
                    e.preventDefault();
                    props.taMeldekortbehandling().then(() => {
                        router.push(props.meldeperiodeUrl);
                    });
                }}
            >
                {'Tildel meg'}
            </Button>
        </div>
    );
};
