import { ActionMenu, Button, Loader, Table, VStack } from '@navikt/ds-react';
import {
    finnMeldeperiodeKjedeStatusTekst,
    utbetalingsstatusTekst,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { MeldeperiodeKjedeProps, MeldeperiodeKjedeStatus } from '~/types/meldekort/Meldeperiode';
import { meldeperiodeUrl } from '~/utils/urls';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldekortbehandlingType,
} from '~/types/meldekort/Meldekortbehandling';
import { formatterBeløp } from '~/utils/beløp';
import { sorterMeldekortbehandlingerAsc } from '~/utils/meldekort';
import { SakId } from '~/types/Sak';
import router from 'next/router';
import { Periode } from '~/types/Periode';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { useTaMeldekortbehandling } from './useTaMeldekortbehandling';
import { useLeggTilbakeMeldekortbehandling } from './useLeggTilbakeMeldekortbehandling';
import { TriggerWithOptionsArgs } from 'swr/mutation';
import { FetcherError } from '~/utils/fetch/fetch';
import {
    eierMeldekortbehandling,
    skalKunneOvertaMeldekortbehandling,
    skalKunneTaMeldekortbehandling,
} from '~/utils/tilganger';
import { OvertaMeldekortbehandlingModal } from './OvertaMeldekortbehandling';
import { AvsluttMeldekortbehandlingModal } from './avsluttMeldekortbehandling/AvsluttMeldekortbehandling';
import React, { useState } from 'react';
import { erMeldekortbehandlingUnderAktivBehandling } from '~/utils/meldekortbehandling';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    PersonIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { PERSONOVERSIKT_TABS } from '~/lib/personoversikt/Personoversikt';
import NextLink from 'next/link';

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
                            meldekortbehandlinger,
                            id,
                            status,
                            periode,
                            brukersMeldekort,
                            korrigeringFraTidligerePeriode,
                        } = kjede;

                        //TODO - raq - vi er interessert i å vise mottatt - men fra hvilket meldekort egentlig?
                        const sisteBrukersMeldekort = brukersMeldekort.at(-1);

                        const sisteMeldekortbehandling = meldekortbehandlinger
                            .toSorted(sorterMeldekortbehandlingerAsc)
                            .at(0);

                        const beregnetBeløpForPeriode =
                            korrigeringFraTidligerePeriode?.beregning.beløp.totalt ??
                            sisteMeldekortbehandling?.beregning?.beregningForMeldekortetsPeriode
                                .beløp.totalt;

                        const erKorrigering =
                            status !== MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT &&
                            sisteMeldekortbehandling?.type === MeldekortbehandlingType.KORRIGERING;

                        const korrigeringTekst =
                            korrigeringFraTidligerePeriode && sisteMeldekortbehandling?.erAvsluttet
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
                                    {sisteMeldekortbehandling?.utbetalingsstatus
                                        ? utbetalingsstatusTekst[
                                              sisteMeldekortbehandling.utbetalingsstatus
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
                                        sisteMeldekortbehandling?.saksbehandler) ||
                                        '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {(!(status === MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET) &&
                                        sisteMeldekortbehandling?.beslutter) ||
                                        '-'}
                                </Table.DataCell>
                                <Table.DataCell scope="col" align="right">
                                    <MeldeperiodeKjedeOversiktMeny
                                        sakId={sakId}
                                        saksnummer={saksnummer}
                                        kjedePeriode={periode}
                                        meldekortbehandling={sisteMeldekortbehandling}
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
    meldekortbehandling?: MeldekortbehandlingProps;
}) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);
    const [vilOvertaBehandling, setVilOvertaBehandling] = useState(false);

    return (
        <div>
            {vilAvslutteBehandling && props.meldekortbehandling && (
                <AvsluttMeldekortbehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    sakId={props.sakId}
                    meldekortbehandlingId={props.meldekortbehandling.id}
                    personoversiktUrl={`/sak/${props.saksnummer}`}
                />
            )}

            {vilOvertaBehandling && props.meldekortbehandling && (
                <OvertaMeldekortbehandlingModal
                    åpen={vilOvertaBehandling}
                    onClose={() => setVilOvertaBehandling(false)}
                    sakId={props.sakId}
                    meldekortbehandlingId={props.meldekortbehandling.id}
                    overtarFra={
                        props.meldekortbehandling.status ===
                        MeldekortbehandlingStatus.UNDER_BEHANDLING
                            ? props.meldekortbehandling.saksbehandler!
                            : props.meldekortbehandling.status ===
                                MeldekortbehandlingStatus.UNDER_BESLUTNING
                              ? props.meldekortbehandling.beslutter!
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
                        {'Velg'}
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <ActionMenu.Item
                        as={NextLink}
                        href={meldeperiodeUrl(props.saksnummer, props.kjedePeriode)}
                    >
                        {'Åpne'}
                    </ActionMenu.Item>

                    {props.meldekortbehandling && (
                        <>
                            {erMeldekortbehandlingUnderAktivBehandling(
                                props.meldekortbehandling,
                            ) && <ActionMenu.Divider />}
                            <MeldekortbehandlingMenyKnapper
                                sakId={props.sakId}
                                meldekortbehandling={props.meldekortbehandling}
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

const MeldekortbehandlingMenyKnapper = (props: {
    sakId: SakId;
    saksnummer: string;
    meldeperiodeUrl: string;
    meldekortbehandling: MeldekortbehandlingProps;
    setVilAvslutteBehandling: (vilAvslutte: boolean) => void;
    setVilOvertaBehandling: (vilOverta: boolean) => void;
}) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { taMeldekortbehandling, isMeldekortbehandlingMutating } = useTaMeldekortbehandling(
        props.sakId,
        props.meldekortbehandling.id,
    );
    const { leggTilbakeMeldekortbehandling, isLeggTilbakeMeldekortbehandlingMutating } =
        useLeggTilbakeMeldekortbehandling(props.sakId, props.meldekortbehandling.id);

    switch (props.meldekortbehandling.status) {
        case MeldekortbehandlingStatus.UNDER_BEHANDLING:
        case MeldekortbehandlingStatus.UNDER_BESLUTNING:
            if (!eierMeldekortbehandling(props.meldekortbehandling, innloggetSaksbehandler)) {
                if (
                    innloggetSaksbehandler.navIdent === props.meldekortbehandling.saksbehandler ||
                    innloggetSaksbehandler.navIdent === props.meldekortbehandling.beslutter
                ) {
                    return null;
                }

                if (
                    skalKunneOvertaMeldekortbehandling(
                        props.meldekortbehandling,
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
                    skalKunneTaMeldekortbehandling(
                        props.meldekortbehandling,
                        innloggetSaksbehandler,
                    )
                ) {
                    return (
                        <TildelMegButton
                            isMeldekortbehandlingMutating={isMeldekortbehandlingMutating}
                            meldeperiodeUrl={props.meldeperiodeUrl}
                            taMeldekortbehandling={taMeldekortbehandling}
                        />
                    );
                }

                return null;
            }

            return (
                <VStack align="start" gap="space-8">
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
                            leggTilbakeMeldekortbehandling().then(() => {
                                router.push(
                                    `/sak/${props.saksnummer}#${PERSONOVERSIKT_TABS.meldekort}`,
                                );
                            });
                        }}
                    >
                        {isLeggTilbakeMeldekortbehandlingMutating ? <Loader /> : 'Legg tilbake'}
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

        case MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING: {
            if (
                !skalKunneTaMeldekortbehandling(props.meldekortbehandling, innloggetSaksbehandler)
            ) {
                break;
            }

            return (
                <TildelMegButton
                    isMeldekortbehandlingMutating={isMeldekortbehandlingMutating}
                    taMeldekortbehandling={taMeldekortbehandling}
                    meldeperiodeUrl={props.meldeperiodeUrl}
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
        <ActionMenu.Item
            icon={<PersonIcon aria-hidden />}
            onClick={(e) => {
                e.preventDefault();
                props.taMeldekortbehandling().then(() => {
                    router.push(props.meldeperiodeUrl);
                });
            }}
        >
            {props.isMeldekortbehandlingMutating ? <Loader /> : 'Tildel meg'}
        </ActionMenu.Item>
    );
};
