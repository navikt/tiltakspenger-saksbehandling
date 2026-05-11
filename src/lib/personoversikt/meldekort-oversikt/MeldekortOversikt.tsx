import { ActionMenu, Button, Loader, Table } from '@navikt/ds-react';
import {
    finnMeldeperiodeKjedeStatusTekst,
    utbetalingsstatusTekst,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import {
    MeldeperiodeKjedeProps,
    MeldeperiodeKjedeStatus,
} from '~/lib/meldekort/typer/Meldeperiode';
import { meldeperiodeUrl } from '~/utils/urls';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldekortbehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { formatterBeløp } from '~/utils/beløp';
import { SakId } from '~/lib/sak/SakTyper';
import router from 'next/router';
import { Periode } from '~/types/Periode';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import {
    eierMeldekortbehandling,
    erMeldekortbehandlingSattPaVent,
    oppdaterSakMedMeldekortbehandling,
    skalKunneGjenopptaMeldekortbehandling,
    skalKunneOvertaMeldekortbehandling,
    skalKunneSetteMeldekortbehandlingPaVent,
    skalKunneTaMeldekortbehandling,
    sorterMeldekortbehandlingerDesc,
} from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
import OvertaMeldekortbehandlingModal from './OvertaMeldekortbehandling';
import { AvsluttMeldekortbehandlingModal } from './avsluttMeldekortbehandling/AvsluttMeldekortbehandling';
import React, { useState } from 'react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    PauseIcon,
    PersonIcon,
    PlayIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { PERSONOVERSIKT_TABS } from '~/lib/personoversikt/Personoversikt';
import NextLink from 'next/link';
import SettBehandlingPåVentModal from '~/lib/_felles/modaler/SettBehandlingPåVentModal';
import { useSak } from '~/lib/sak/SakContext';
import {
    useGjenopptaMeldekortbehandling,
    useLeggTilbakeMeldekortbehandling,
    useSettMeldekortbehandlingPåVent,
    useTaMeldekortbehandling,
} from '~/lib/meldekort/api/MeldekortApi';
import { ApiErrorFeilModal, ApiErrorState } from '~/lib/_felles/modaler/ApiErrorFeilModal';

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
                            .toSorted(sorterMeldekortbehandlingerDesc)
                            .at(0);

                        const beregnetBeløpForPeriode =
                            korrigeringFraTidligerePeriode?.beregning.beløp.totalt ??
                            sisteMeldekortbehandling?.beregning?.beregningForMeldekortetsPeriode
                                .beløp.totalt;

                        const erKorrigering =
                            status !== MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT &&
                            sisteMeldekortbehandling?.type === MeldekortbehandlingType.KORRIGERING;

                        const erSattPåVent = sisteMeldekortbehandling
                            ? erMeldekortbehandlingSattPaVent(sisteMeldekortbehandling)
                            : false;

                        const korrigeringTekst =
                            korrigeringFraTidligerePeriode && sisteMeldekortbehandling?.erAvsluttet
                                ? ` (korrigert via ${periodeTilFormatertDatotekst(korrigeringFraTidligerePeriode.periode)})`
                                : erKorrigering
                                  ? ' (korrigering)'
                                  : '';

                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>{`${erSattPåVent ? 'Satt på vent' : finnMeldeperiodeKjedeStatusTekst[status]}${korrigeringTekst}`}</Table.DataCell>
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
 * For at modalene ikke skal forsvinne når ActionMenu lukkes, så må de rendres utenfor ActionMenu. Da trenger vi state håndtering av det ved siden av ActionMenu
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
    const [vilSettePåVent, setVilSettePåVent] = useState(false);
    const [apiError, setApiError] = useState<ApiErrorState>({ visFeilModal: false, feil: null });

    return (
        <div>
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
                            <ActionMenu.Divider />
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
                                setVilSettePåVent={setVilSettePåVent}
                                setApiError={setApiError}
                            />
                        </>
                    )}
                </ActionMenu.Content>
            </ActionMenu>

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

            {vilSettePåVent && props.meldekortbehandling && (
                <SettMeldekortbehandlingPåVentModalForOversikt
                    åpen={vilSettePåVent}
                    onClose={() => setVilSettePåVent(false)}
                    sakId={props.sakId}
                    meldekortbehandling={props.meldekortbehandling}
                    setApiError={setApiError}
                />
            )}

            {apiError.visFeilModal && (
                <ApiErrorFeilModal
                    åpen={apiError.visFeilModal}
                    onClose={() => setApiError({ visFeilModal: false, feil: null })}
                    error={apiError.feil!}
                />
            )}
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
    setVilSettePåVent: (vilSettePåVent: boolean) => void;
    setApiError: (apiError: ApiErrorState) => void;
}) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { sak, setSak } = useSak();

    const taMeldekortbehandling = useTaMeldekortbehandling({
        sakId: props.sakId,
        meldekortbehandlingId: props.meldekortbehandling.id,
        onSuccess: () => router.push(props.meldeperiodeUrl),
        onError: (error) => props.setApiError({ visFeilModal: true, feil: error }),
    });
    const leggTilbakeMeldekortbehandling = useLeggTilbakeMeldekortbehandling({
        sakId: props.sakId,
        meldekortbehandlingId: props.meldekortbehandling.id,
        onSuccess: (oppdatertMeldekortbehandling) => {
            setSak(oppdaterSakMedMeldekortbehandling(sak, oppdatertMeldekortbehandling));
            router.push(`/sak/${props.saksnummer}#${PERSONOVERSIKT_TABS.meldekort}`);
        },
        onError: (error) => props.setApiError({ visFeilModal: true, feil: error }),
    });
    const gjenopptaMeldekortbehandling = useGjenopptaMeldekortbehandling({
        sakId: props.sakId,
        meldekortbehandlingId: props.meldekortbehandling.id,
        onSuccess: (oppdatertMeldekortbehandling) => {
            setSak(oppdaterSakMedMeldekortbehandling(sak, oppdatertMeldekortbehandling));
            router.push(props.meldeperiodeUrl);
        },
        onError: (error) => props.setApiError({ visFeilModal: true, feil: error }),
    });

    const erSattPåVent = erMeldekortbehandlingSattPaVent(props.meldekortbehandling);
    const eierBehandlingen = eierMeldekortbehandling(
        props.meldekortbehandling,
        innloggetSaksbehandler,
    );
    const kanTa = skalKunneTaMeldekortbehandling(props.meldekortbehandling, innloggetSaksbehandler);
    const kanGjenoppta = skalKunneGjenopptaMeldekortbehandling(
        props.meldekortbehandling,
        innloggetSaksbehandler,
    );
    const kanOverta = skalKunneOvertaMeldekortbehandling(
        props.meldekortbehandling,
        innloggetSaksbehandler,
    );
    const kanSettePåVent = skalKunneSetteMeldekortbehandlingPaVent(
        props.meldekortbehandling,
        innloggetSaksbehandler,
    );
    const erTilknyttetBehandlingen =
        innloggetSaksbehandler.navIdent === props.meldekortbehandling.saksbehandler ||
        innloggetSaksbehandler.navIdent === props.meldekortbehandling.beslutter;
    const skalViseEierMenyvalg = eierBehandlingen && !erSattPåVent;
    const skalViseLeggTilbakeMenyvalg = eierBehandlingen;
    const skalViseOvertaMenyvalg = kanOverta && !erSattPåVent && !erTilknyttetBehandlingen;

    return (
        <>
            {skalViseEierMenyvalg && (
                <ActionMenu.Item
                    icon={<ArrowRightIcon aria-hidden />}
                    onClick={() => router.push(props.meldeperiodeUrl)}
                >
                    Fortsett
                </ActionMenu.Item>
            )}

            {skalViseLeggTilbakeMenyvalg && (
                <ActionMenu.Item
                    icon={<ArrowLeftIcon aria-hidden />}
                    onClick={(e) => {
                        e.preventDefault();
                        leggTilbakeMeldekortbehandling.trigger();
                    }}
                >
                    {leggTilbakeMeldekortbehandling.isMutating ? <Loader /> : 'Legg tilbake'}
                </ActionMenu.Item>
            )}

            {kanSettePåVent && (
                <ActionMenu.Item
                    icon={<PauseIcon aria-hidden />}
                    onSelect={() => {
                        props.setVilSettePåVent(true);
                    }}
                >
                    Sett på vent
                </ActionMenu.Item>
            )}

            {skalViseEierMenyvalg && (
                <>
                    <ActionMenu.Divider />
                    <ActionMenu.Item
                        variant={'danger'}
                        icon={<XMarkOctagonIcon aria-hidden />}
                        onSelect={() => {
                            props.setVilAvslutteBehandling(true);
                        }}
                    >
                        Avslutt behandling
                    </ActionMenu.Item>
                </>
            )}

            {skalViseOvertaMenyvalg && (
                <ActionMenu.Item
                    icon={<ArrowRightIcon aria-hidden />}
                    onSelect={() => {
                        props.setVilOvertaBehandling(true);
                    }}
                >
                    Overta behandling
                </ActionMenu.Item>
            )}

            {kanTa && (
                <TildelMegButton
                    isMeldekortbehandlingMutating={taMeldekortbehandling.isMutating}
                    taMeldekortbehandling={taMeldekortbehandling.trigger}
                />
            )}

            {kanGjenoppta && (
                <ActionMenu.Item
                    icon={<PlayIcon aria-hidden />}
                    onClick={(e) => {
                        e.preventDefault();
                        gjenopptaMeldekortbehandling.trigger();
                    }}
                >
                    {gjenopptaMeldekortbehandling.isMutating ? <Loader /> : 'Gjenoppta'}
                </ActionMenu.Item>
            )}
        </>
    );
};

const SettMeldekortbehandlingPåVentModalForOversikt = (props: {
    åpen: boolean;
    onClose: () => void;
    sakId: SakId;
    meldekortbehandling: MeldekortbehandlingProps;
    setApiError: (apiError: ApiErrorState) => void;
}) => {
    const { sak, setSak } = useSak();
    const settMeldekortbehandlingPåVent = useSettMeldekortbehandlingPåVent({
        sakId: props.sakId,
        meldekortbehandlingId: props.meldekortbehandling.id,
        onSuccess: (oppdatertMeldekortbehandling) => {
            setSak(oppdaterSakMedMeldekortbehandling(sak, oppdatertMeldekortbehandling));
            props.onClose();
        },
        onError: (error) => props.setApiError({ visFeilModal: true, feil: error }),
    });

    return (
        <SettBehandlingPåVentModal
            åpen={props.åpen}
            onClose={props.onClose}
            api={{
                trigger: (begrunnelse, frist) => {
                    settMeldekortbehandlingPåVent.trigger({ begrunnelse, frist });
                },
                isMutating: settMeldekortbehandlingPåVent.isMutating,
                error: settMeldekortbehandlingPåVent.error ?? null,
            }}
        />
    );
};

const TildelMegButton = (props: {
    isMeldekortbehandlingMutating: boolean;
    taMeldekortbehandling: () => void;
}) => {
    return (
        <ActionMenu.Item
            icon={<PersonIcon aria-hidden />}
            onClick={(e) => {
                e.preventDefault();
                props.taMeldekortbehandling();
            }}
        >
            {props.isMeldekortbehandlingMutating ? <Loader /> : 'Tildel meg'}
        </ActionMenu.Item>
    );
};
