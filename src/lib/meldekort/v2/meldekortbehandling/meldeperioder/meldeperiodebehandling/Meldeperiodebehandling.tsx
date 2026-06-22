import { BodyShort, Heading, Select, Table, VStack } from '@navikt/ds-react';
import {
    MeldekortbehandlingDagStatus,
    MeldekortBeregningsdag,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    MeldekortDagSkjema,
    MeldeperiodeSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { formaterDatotekst, ukedagFraDatoKort, ukenummerFraDatotekst } from '~/utils/date';
import { meldekortbehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { formatterBeløp } from '~/utils/beløp';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { ikonForMeldekortbehandlingDagStatusV2 } from './meldekortIkonerV2';
import { useSak } from '~/lib/sak/SakContext';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { MeldeperiodeInfo } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/info-panel/MeldeperiodeInfo';
import { MeldeperiodeBrukersMeldekort } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/brukers-meldekort/MeldeperiodeBrukersMeldekort';
import { classNames } from '~/utils/classNames';
import { MeldeperiodebehandlingBeregning } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/beregning/MeldeperiodebehandlingBeregning';
import { validerMeldekortDagSkjema } from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';

import style from './Meldeperiodebehandling.module.css';

type Props = {
    meldeperiodeSkjema: MeldeperiodeSkjema;
};

export const Meldeperiodebehandling = ({ meldeperiodeSkjema }: Props) => {
    const { kjedeId, dager } = meldeperiodeSkjema;

    const { sak } = useSak();

    const kjede = hentMeldeperiodekjede(sak, kjedeId);

    const { meldeperioder } = useMeldekortbehandling();

    const { erReadonly } = useMeldekortbehandlingSkjema();

    const meldeperiodebehandling = meldeperioder.find((it) => it.kjedeId === kjedeId);

    const beregningsdagPerDato = new Map<string, MeldekortBeregningsdag>();
    meldeperiodebehandling?.beregning?.dager.forEach((dag) => {
        if (dag.beregningsdag) {
            beregningsdagPerDato.set(dag.dato, dag.beregningsdag);
        }
    });

    return (
        <MeldekortbehandlingSeksjon gap={'space-16'}>
            <MeldekortbehandlingSeksjon.Venstre
                gap={'space-16'}
                className={classNames(style.venstre, style.info)}
            >
                <MeldeperiodeInfo
                    meldeperiodeKjede={kjede}
                    meldeperiodebehandling={meldeperiodebehandling}
                />
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre>
                <MeldeperiodebehandlingBeregning kjedeId={kjedeId} />
            </MeldekortbehandlingSeksjon.Høyre>

            <MeldekortbehandlingSeksjon.Venstre
                className={classNames(style.venstre, style.meldekort)}
            >
                <MeldeperiodeBrukersMeldekort meldeperiodeKjede={kjede} />
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-24'} className={style.uker}>
                <Heading size={'small'} level={'3'} className={style.ukerHeader}>
                    {'Behandling'}
                </Heading>

                <MeldeperiodeUke
                    dager={dager.slice(0, 7)}
                    dagIndexOffset={0}
                    kjedeId={kjedeId}
                    beregningsdagPerDato={beregningsdagPerDato}
                    erReadonly={erReadonly}
                />

                <MeldeperiodeUke
                    dager={dager.slice(7, 14)}
                    dagIndexOffset={7}
                    kjedeId={kjedeId}
                    beregningsdagPerDato={beregningsdagPerDato}
                    erReadonly={erReadonly}
                />
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};

type UkeProps = {
    dager: MeldekortDagSkjema[];
    dagIndexOffset: number;
    kjedeId: MeldeperiodeKjedeId;
    beregningsdagPerDato: Map<string, MeldekortBeregningsdag>;
    erReadonly: boolean;
};

const MeldeperiodeUke = ({
    dager,
    dagIndexOffset,
    kjedeId,
    beregningsdagPerDato,
    erReadonly,
}: UkeProps) => {
    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    return (
        <VStack gap={'space-8'}>
            <Heading size={'xsmall'} level={'4'}>
                {`Uke ${ukenummerFraDatotekst(dager.at(0)!.dato)}`}
            </Heading>

            <Table size={'small'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>{'Dag'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Dato'}</Table.HeaderCell>
                        <Table.HeaderCell colSpan={2}>{'Status'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Sats'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Beløp'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Barn'}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {dager.map((dag, index) => {
                        const { dato, status } = dag;
                        const dagIndex = index + dagIndexOffset;
                        const beregningsdag = beregningsdagPerDato.get(dato);

                        const kanEndres =
                            !erReadonly &&
                            status !== MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger;

                        const harValideringsfeil = !!validerMeldekortDagSkjema(dag);

                        return (
                            <Table.Row key={dag.dato}>
                                <Table.DataCell>{ukedagFraDatoKort(dag.dato)}</Table.DataCell>
                                <Table.DataCell>{formaterDatotekst(dag.dato)}</Table.DataCell>
                                <Table.DataCell className={style.ikon}>
                                    {ikonForMeldekortbehandlingDagStatusV2[dag.status]}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {kanEndres ? (
                                        <Select
                                            label={'Velg status for dag'}
                                            size={'small'}
                                            hideLabel={true}
                                            value={status}
                                            className={style.status}
                                            error={harValideringsfeil}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: 'oppdaterDagStatus',
                                                    payload: {
                                                        kjedeId,
                                                        dagIndex,
                                                        status: e.target
                                                            .value as MeldekortbehandlingDagStatus,
                                                    },
                                                })
                                            }
                                        >
                                            {dagStatusOptions}
                                        </Select>
                                    ) : (
                                        <BodyShort className={style.statusReadonly}>
                                            {meldekortbehandlingDagStatusTekst[status]}
                                        </BodyShort>
                                    )}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {beregningsdag && `${beregningsdag.prosent}%`}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {beregningsdag && formatterBeløp(beregningsdag.beløp)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {beregningsdag && formatterBeløp(beregningsdag.barnetillegg)}
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </VStack>
    );
};

const gyldigeStatusValg = Object.values(MeldekortbehandlingDagStatus).filter(
    (status) => status !== MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger,
);

const dagStatusOptions = gyldigeStatusValg.map((status) => (
    <option key={status} value={status}>
        {meldekortbehandlingDagStatusTekst[status]}
    </option>
));
