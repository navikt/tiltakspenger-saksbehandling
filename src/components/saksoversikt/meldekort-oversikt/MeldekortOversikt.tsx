import { ActionMenu, Button, Loader, Table, VStack } from '@navikt/ds-react';
import {
    finnMeldeperiodeKjedeStatusTekst,
    utbetalingsstatusTekst,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { MeldeperiodeKjedeProps, MeldeperiodeKjedeStatus } from '~/types/meldekort/Meldeperiode';
import { meldeperiodeUrl } from '~/utils/urls';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
    MeldekortBehandlingType,
} from '~/types/meldekort/MeldekortBehandling';
import { formatterBeløp } from '~/utils/beløp';
import { sorterMeldekortBehandlingerAsc } from '~/utils/meldekort';
import { SakId } from '~/types/Sak';
import router from 'next/router';
import { Periode } from '~/types/Periode';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { useTaMeldekortBehandling } from './useTaMeldekortBehandling';
import { useLeggTilbakeMeldekortBehandling } from './useLeggTilbakeMeldekortBehandling';
import { Nullable } from '~/types/UtilTypes';
import { TriggerWithOptionsArgs } from 'swr/mutation';
import { FetcherError } from '~/utils/fetch/fetch';
import {
    eierMeldekortBehandling,
    skalKunneOvertaMeldekortBehandling,
    skalKunneTaMeldekortBehandling,
} from '~/utils/tilganger';
import { OvertaMeldekortbehandlingModal } from './OvertaMeldekortBehandling';
import { AvsluttMeldekortbehandlingModal } from './avsluttMeldekortBehandling/AvsluttMeldekortBehandling';
import React, { useState } from 'react';
import { erMeldekortBehandlingUnderAktivBehandling } from '~/utils/MeldekortBehandlingUtils';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    PersonIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';

type Props = {
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    saksnummer: string;
    sakId: SakId;
};

export const MeldekortOversikt = ({ meldeperiodeKjeder, saksnummer, sakId }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beregnet beløp</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utbetalingsstatus</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Mottatt fra bruker</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {meldeperiodeKjeder
                    .toSorted((a, b) => (a.periode.fraOgMed > b.periode.fraOgMed ? -1 : 1))
                    .map((kjede) => {
                        const {
                            meldekortBehandlinger,
                            id,
                            status,
                            periode,
                            brukersMeldekort,
                            korrigeringFraTidligerePeriode,
                        } = kjede;

                        //TODO - raq - vi er interessert i å vise mottatt - men fra hvilket meldekort egentlig?
                        const sisteBrukersMeldekort = brukersMeldekort.at(-1);

                        const sisteMeldekortBehandling =
                            meldekortBehandlinger.toSorted(sorterMeldekortBehandlingerAsc).at(0) ||
                            null;

                        const beregnetBeløpForPeriode =
                            korrigeringFraTidligerePeriode?.beregning.beløp.totalt ??
                            sisteMeldekortBehandling?.beregning?.beregningForMeldekortetsPeriode
                                .beløp.totalt;

                        const erKorrigering =
                            status !== MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT &&
                            sisteMeldekortBehandling?.type === MeldekortBehandlingType.KORRIGERING;

                        const korrigeringTekst =
                            korrigeringFraTidligerePeriode && sisteMeldekortBehandling?.erAvsluttet
                                ? ` (korrigert via ${periodeTilFormatertDatotekst(korrigeringFraTidligerePeriode.periode)})`
                                : erKorrigering
                                  ? ' (korrigering)'
                                  : '';

                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>{`${finnMeldeperiodeKjedeStatusTekst[status]}${korrigeringTekst}`}</Table.DataCell>
                                <Table.DataCell>
                                    {periodeTilFormatertDatotekst(periode)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {beregnetBeløpForPeriode !== undefined
                                        ? formatterBeløp(beregnetBeløpForPeriode)
                                        : '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sisteMeldekortBehandling?.utbetalingsstatus
                                        ? utbetalingsstatusTekst[
                                              sisteMeldekortBehandling.utbetalingsstatus
                                          ]
                                        : '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sisteBrukersMeldekort
                                        ? formaterTidspunkt(sisteBrukersMeldekort.mottatt)
                                        : 'Ikke mottatt'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {(!(status === MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET) &&
                                        sisteMeldekortBehandling?.saksbehandler) ||
                                        '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {(!(status === MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET) &&
                                        sisteMeldekortBehandling?.beslutter) ||
                                        '-'}
                                </Table.DataCell>
                                <Table.DataCell scope="col" align="right">
                                    <MeldeperiodeKjedeOversiktMeny
                                        sakId={sakId}
                                        saksnummer={saksnummer}
                                        kjedePeriode={periode}
                                        meldekortBehandling={sisteMeldekortBehandling}
                                        meldeperiodeUrl={meldeperiodeUrl(saksnummer, periode)}
                                    />
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
            </Table.Body>
        </Table>
    );
};

/**
 * For at modalene ikke skal forsvinne når ActionMenu lukkes, så må dem rendres utenfor ActionMenu. Da trenger vi state håndtering av det på siden av ActionMenu
 */
export const MeldeperiodeKjedeOversiktMeny = (props: {
    sakId: SakId;
    saksnummer: string;
    kjedePeriode: Periode;
    meldeperiodeUrl: string;
    meldekortBehandling: Nullable<MeldekortBehandlingProps>;
}) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);
    const [vilOvertaBehandling, setVilOvertaBehandling] = useState(false);

    return (
        <div>
            {vilAvslutteBehandling && props.meldekortBehandling && (
                <AvsluttMeldekortbehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    sakId={props.sakId}
                    meldekortBehandlingId={props.meldekortBehandling.id}
                    saksoversiktUrl={`/sak/${props.saksnummer}`}
                />
            )}

            {vilOvertaBehandling && props.meldekortBehandling && (
                <OvertaMeldekortbehandlingModal
                    åpen={vilOvertaBehandling}
                    onClose={() => setVilOvertaBehandling(false)}
                    sakId={props.sakId}
                    meldekortBehandlingId={props.meldekortBehandling.id}
                    overtarFra={
                        props.meldekortBehandling.status ===
                        MeldekortBehandlingStatus.UNDER_BEHANDLING
                            ? props.meldekortBehandling.saksbehandler!
                            : props.meldekortBehandling.status ===
                                MeldekortBehandlingStatus.UNDER_BESLUTNING
                              ? props.meldekortBehandling.beslutter!
                              : 'Ukjent saksbehandler/beslutter'
                    }
                    meldeperiodeUrl={props.meldeperiodeUrl}
                />
            )}

            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant="secondary"
                        iconPosition="right"
                        icon={<ChevronDownIcon title="Menyvalg" />}
                        size="small"
                    >
                        Velg
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <ActionMenu.Item
                        onSelect={() =>
                            router.push(meldeperiodeUrl(props.saksnummer, props.kjedePeriode))
                        }
                    >
                        Åpne
                    </ActionMenu.Item>

                    {props.meldekortBehandling && (
                        <>
                            {erMeldekortBehandlingUnderAktivBehandling(
                                props.meldekortBehandling,
                            ) && <ActionMenu.Divider />}
                            <MeldekortBehandlingMenyKnapper
                                sakId={props.sakId}
                                meldekortBehandling={props.meldekortBehandling}
                                saksnummer={props.saksnummer}
                                meldeperiodeUrl={meldeperiodeUrl(
                                    props.saksnummer,
                                    props.kjedePeriode,
                                )}
                                setVilAvslutteBehandling={setVilAvslutteBehandling}
                                setVilOvertaBehandling={setVilOvertaBehandling}
                            />
                        </>
                    )}
                </ActionMenu.Content>
            </ActionMenu>
        </div>
    );
};

const MeldekortBehandlingMenyKnapper = (props: {
    sakId: SakId;
    saksnummer: string;
    meldeperiodeUrl: string;
    meldekortBehandling: MeldekortBehandlingProps;
    setVilAvslutteBehandling: (vilAvslutte: boolean) => void;
    setVilOvertaBehandling: (vilOverta: boolean) => void;
}) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { taMeldekortBehandling, isMeldekortBehandlingMutating } = useTaMeldekortBehandling(
        props.sakId,
        props.meldekortBehandling.id,
    );
    const { leggTilbakeMeldekortBehandling, isLeggTilbakeMeldekortBehandlingMutating } =
        useLeggTilbakeMeldekortBehandling(props.sakId, props.meldekortBehandling.id);

    switch (props.meldekortBehandling.status) {
        case MeldekortBehandlingStatus.UNDER_BEHANDLING:
        case MeldekortBehandlingStatus.UNDER_BESLUTNING:
            if (!eierMeldekortBehandling(props.meldekortBehandling, innloggetSaksbehandler)) {
                if (
                    innloggetSaksbehandler.navIdent === props.meldekortBehandling.saksbehandler ||
                    innloggetSaksbehandler.navIdent === props.meldekortBehandling.beslutter
                ) {
                    return null;
                }

                if (
                    skalKunneOvertaMeldekortBehandling(
                        props.meldekortBehandling,
                        innloggetSaksbehandler,
                    )
                ) {
                    return (
                        <ActionMenu.Item
                            icon={<ArrowRightIcon aria-hidden />}
                            onSelect={() => {
                                props.setVilOvertaBehandling(true);
                            }}
                        >
                            Overta behandling
                        </ActionMenu.Item>
                    );
                }

                if (
                    skalKunneTaMeldekortBehandling(
                        props.meldekortBehandling,
                        innloggetSaksbehandler,
                    )
                ) {
                    return (
                        <TildelMegButton
                            isMeldekortBehandlingMutating={isMeldekortBehandlingMutating}
                            meldeperiodeUrl={props.meldeperiodeUrl}
                            taMeldekortBehandling={taMeldekortBehandling}
                        />
                    );
                }

                return null;
            }

            return (
                <VStack align="start" gap="2">
                    <ActionMenu.Item
                        icon={<ArrowRightIcon aria-hidden />}
                        onClick={() => router.push(props.meldeperiodeUrl)}
                    >
                        Fortsett
                    </ActionMenu.Item>
                    <ActionMenu.Item
                        icon={<ArrowLeftIcon aria-hidden />}
                        onClick={(e) => {
                            e.preventDefault();
                            leggTilbakeMeldekortBehandling().then(() => {
                                router.push(`/sak/${props.saksnummer}`);
                            });
                        }}
                    >
                        {isLeggTilbakeMeldekortBehandlingMutating ? <Loader /> : 'Legg tilbake'}
                    </ActionMenu.Item>

                    <ActionMenu.Item
                        variant={'danger'}
                        icon={<XMarkOctagonIcon aria-hidden />}
                        onSelect={() => {
                            props.setVilAvslutteBehandling(true);
                        }}
                    >
                        Avslutt behandling
                    </ActionMenu.Item>
                </VStack>
            );

        case MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING: {
            if (
                !skalKunneTaMeldekortBehandling(props.meldekortBehandling, innloggetSaksbehandler)
            ) {
                break;
            }

            return (
                <TildelMegButton
                    isMeldekortBehandlingMutating={isMeldekortBehandlingMutating}
                    taMeldekortBehandling={taMeldekortBehandling}
                    meldeperiodeUrl={props.meldeperiodeUrl}
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
        <ActionMenu.Item
            icon={<PersonIcon aria-hidden />}
            onClick={(e) => {
                e.preventDefault();
                props.taMeldekortBehandling().then(() => {
                    router.push(props.meldeperiodeUrl);
                });
            }}
        >
            {props.isMeldekortBehandlingMutating ? <Loader /> : 'Tildel meg'}
        </ActionMenu.Item>
    );
};
