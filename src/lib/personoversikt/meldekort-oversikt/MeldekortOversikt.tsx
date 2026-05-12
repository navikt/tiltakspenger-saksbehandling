import { ActionMenu, Alert, Button, Loader, Table } from '@navikt/ds-react';
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
};

export const MeldekortOversikt = ({ meldeperiodeKjeder }: Props) => {
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
                                        kjedePeriode={periode}
                                        meldekortbehandling={sisteMeldekortbehandling}
                                    />
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
            </Table.Body>
        </Table>
    );
};

type MeldeperiodeKjedeOversiktMenyProps = {
    kjedePeriode: Periode;
    meldekortbehandling?: MeldekortbehandlingProps;
};

/**
 * For at modalene ikke skal forsvinne når ActionMenu lukkes, så må de rendres utenfor ActionMenu. Da trenger vi state håndtering av det ved siden av ActionMenu
 */
export const MeldeperiodeKjedeOversiktMeny = ({
    kjedePeriode,
    meldekortbehandling,
}: MeldeperiodeKjedeOversiktMenyProps) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);
    const [vilOvertaBehandling, setVilOvertaBehandling] = useState(false);
    const [vilSettePåVent, setVilSettePåVent] = useState(false);
    const [apiError, setApiError] = useState<ApiErrorState>({ visFeilModal: false, feil: null });

    const { sakId, saksnummer } = useSak().sak;

    const url = meldeperiodeUrl(saksnummer, kjedePeriode);

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
                    <ActionMenu.Item as={NextLink} href={url}>
                        {'Åpne'}
                    </ActionMenu.Item>

                    {meldekortbehandling && (
                        <>
                            <ActionMenu.Divider />
                            <MeldekortbehandlingMenyKnapper
                                meldekortbehandling={meldekortbehandling}
                                meldeperiodeUrl={url}
                                setVilAvslutteBehandling={setVilAvslutteBehandling}
                                setVilOvertaBehandling={setVilOvertaBehandling}
                                setVilSettePåVent={setVilSettePåVent}
                                setApiError={setApiError}
                            />
                        </>
                    )}
                </ActionMenu.Content>
            </ActionMenu>

            {vilAvslutteBehandling && meldekortbehandling && (
                <AvsluttMeldekortbehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    sakId={sakId}
                    meldekortbehandlingId={meldekortbehandling.id}
                    personoversiktUrl={`/sak/${saksnummer}`}
                />
            )}

            {vilOvertaBehandling && meldekortbehandling && (
                <OvertaMeldekortbehandlingModal
                    åpen={vilOvertaBehandling}
                    onClose={() => setVilOvertaBehandling(false)}
                    sakId={sakId}
                    meldekortbehandlingId={meldekortbehandling.id}
                    overtarFra={
                        meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING
                            ? meldekortbehandling.saksbehandler!
                            : meldekortbehandling.status ===
                                MeldekortbehandlingStatus.UNDER_BESLUTNING
                              ? meldekortbehandling.beslutter!
                              : 'Ukjent saksbehandler/beslutter'
                    }
                    meldeperiodeUrl={url}
                />
            )}

            {vilSettePåVent && meldekortbehandling && (
                <SettMeldekortbehandlingPåVentModalForOversikt
                    åpen={vilSettePåVent}
                    onClose={() => setVilSettePåVent(false)}
                    sakId={sakId}
                    meldekortbehandling={meldekortbehandling}
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

type MeldekortbehandlingMenyKnapperProps = {
    meldeperiodeUrl: string;
    meldekortbehandling: MeldekortbehandlingProps;
    setVilAvslutteBehandling: (vilAvslutte: boolean) => void;
    setVilOvertaBehandling: (vilOverta: boolean) => void;
    setVilSettePåVent: (vilSettePåVent: boolean) => void;
    setApiError: (apiError: ApiErrorState) => void;
};

const MeldekortbehandlingMenyKnapper = ({
    meldeperiodeUrl,
    meldekortbehandling,
    setVilAvslutteBehandling,
    setVilOvertaBehandling,
    setVilSettePåVent,
    setApiError,
}: MeldekortbehandlingMenyKnapperProps) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { sak, setSak } = useSak();

    const { sakId } = sak;

    const leggTilbakeMeldekortbehandling = useLeggTilbakeMeldekortbehandling({
        sakId: sakId,
        meldekortbehandlingId: meldekortbehandling.id,
        onSuccess: (oppdatertSak) => {
            if (oppdatertSak) {
                setSak(oppdatertSak);
            }
        },
        onError: (error) => setApiError({ visFeilModal: true, feil: error }),
    });

    const gjenopptaMeldekortbehandling = useGjenopptaMeldekortbehandling({
        sakId: sakId,
        meldekortbehandlingId: meldekortbehandling.id,
        onSuccess: () => {
            router.push(meldeperiodeUrl);
        },
        onError: (error) => setApiError({ visFeilModal: true, feil: error }),
    });

    const erSattPåVent = erMeldekortbehandlingSattPaVent(meldekortbehandling);
    const eierBehandlingen = eierMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler);
    const kanTa = skalKunneTaMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler);
    const kanGjenoppta = skalKunneGjenopptaMeldekortbehandling(
        meldekortbehandling,
        innloggetSaksbehandler,
    );
    const kanOverta = skalKunneOvertaMeldekortbehandling(
        meldekortbehandling,
        innloggetSaksbehandler,
    );
    const kanSettePåVent = skalKunneSetteMeldekortbehandlingPaVent(
        meldekortbehandling,
        innloggetSaksbehandler,
    );
    const erTilknyttetBehandlingen =
        innloggetSaksbehandler.navIdent === meldekortbehandling.saksbehandler ||
        innloggetSaksbehandler.navIdent === meldekortbehandling.beslutter;
    const skalViseEierMenyvalg = eierBehandlingen && !erSattPåVent;
    const skalViseLeggTilbakeMenyvalg = eierBehandlingen;
    const skalViseOvertaMenyvalg = kanOverta && !erSattPåVent && !erTilknyttetBehandlingen;

    return (
        <>
            {skalViseEierMenyvalg && (
                <ActionMenu.Item
                    icon={<ArrowRightIcon aria-hidden />}
                    onClick={() => router.push(meldeperiodeUrl)}
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
                        setVilSettePåVent(true);
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
                            setVilAvslutteBehandling(true);
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
                        setVilOvertaBehandling(true);
                    }}
                >
                    Overta behandling
                </ActionMenu.Item>
            )}

            {kanTa && (
                <TildelMegButton
                    meldekortbehandling={meldekortbehandling}
                    meldeperiodeUrl={meldeperiodeUrl}
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

type SettMeldekortbehandlingPåVentModalForOversiktProps = {
    åpen: boolean;
    onClose: () => void;
    sakId: SakId;
    meldekortbehandling: MeldekortbehandlingProps;
    setApiError: (apiError: ApiErrorState) => void;
};

const SettMeldekortbehandlingPåVentModalForOversikt = ({
    åpen,
    onClose,
    sakId,
    meldekortbehandling,
    setApiError,
}: SettMeldekortbehandlingPåVentModalForOversiktProps) => {
    const { sak, setSak } = useSak();
    const settMeldekortbehandlingPåVent = useSettMeldekortbehandlingPåVent({
        sakId,
        meldekortbehandlingId: meldekortbehandling.id,
        onSuccess: (oppdatertMeldekortbehandling) => {
            setSak(oppdaterSakMedMeldekortbehandling(sak, oppdatertMeldekortbehandling));
            onClose();
        },
        onError: (error) => setApiError({ visFeilModal: true, feil: error }),
    });

    return (
        <SettBehandlingPåVentModal
            åpen={åpen}
            onClose={onClose}
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

type TildelMegProps = {
    meldekortbehandling: MeldekortbehandlingProps;
    meldeperiodeUrl: string;
};

const TildelMegButton = ({ meldekortbehandling, meldeperiodeUrl }: TildelMegProps) => {
    const { trigger, isMutating, error } = useTaMeldekortbehandling({
        sakId: meldekortbehandling.sakId,
        meldekortbehandlingId: meldekortbehandling.id,
    });

    return (
        <>
            {error && (
                <Alert variant={'error'} size={'small'} inline={true}>
                    {`Feil ved tildeling: ${error.message}`}
                </Alert>
            )}
            <ActionMenu.Item
                icon={<PersonIcon aria-hidden />}
                onClick={(e) => {
                    e.preventDefault();
                    trigger().then((oppdatertBehandling) => {
                        if (oppdatertBehandling) {
                            router.push(meldeperiodeUrl);
                        }
                    });
                }}
            >
                {isMutating ? <Loader /> : 'Tildel meg'}
            </ActionMenu.Item>
        </>
    );
};
