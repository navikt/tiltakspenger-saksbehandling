import { Box, Button, HStack, Heading, Select, Table, VStack, InfoCard } from '@navikt/ds-react';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    MeldekortDagSkjema,
    MeldeperiodeSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { formaterDatotekst, ukedagFraDatotekst } from '~/utils/date';
import { meldekortbehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { formatterBeløp } from '~/utils/beløp';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { ikonForMeldekortbehandlingDagStatusV2 } from './meldekortIkonerV2';

import style from './Meldeperiodebehandling.module.css';
import { useSak } from '~/lib/sak/SakContext';

type Beregningsdag = {
    beløp: number;
    prosent: number;
    barnetillegg: number;
};

type Props = {
    meldeperiodeSkjema: MeldeperiodeSkjema;
    onFjern: () => void;
};

export const Meldeperiodebehandling = ({ meldeperiodeSkjema, onFjern }: Props) => {
    const { kjedeId, dager } = meldeperiodeSkjema;

    const { meldeperiodeKjederV2 } = useSak().sak;
    const kjede = meldeperiodeKjederV2.find((it) => (it.id = kjedeId));

    const meldekortbehandling = useMeldekortbehandling();
    const { erReadonly } = useMeldekortbehandlingSkjema();

    if (!kjede) {
        return (
            <InfoCard className={style.outer}>
                <InfoCard.Message
                    icon={null}
                    data-color={'danger'}
                >{`Fant ikke meldeperiodekjede med id ${kjedeId}`}</InfoCard.Message>
            </InfoCard>
        );
    }

    const meldeperiodebehandling = meldekortbehandling.meldeperioder.find(
        (it) => it.kjedeId === kjedeId,
    );

    const beregningsdagPerDato = new Map<string, Beregningsdag>();
    meldeperiodebehandling?.beregning?.dager.forEach((dag) => {
        if (dag.beregningsdag) {
            beregningsdagPerDato.set(dag.dato, dag.beregningsdag);
        }
    });

    return (
        <VStack gap={'space-16'} className={style.outer}>
            <HStack justify={'space-between'} align={'center'}>
                <Heading size={'small'} level={'3'}>
                    {`Meldeperiode: ${kjedeId}`}
                </Heading>
                {!erReadonly && (
                    <Button size={'small'} variant={'secondary'} onClick={onFjern}>
                        {'Fjern'}
                    </Button>
                )}
            </HStack>

            <VStack gap={'space-4'}>
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
            </VStack>
        </VStack>
    );
};

type UkeProps = {
    dager: MeldekortDagSkjema[];
    dagIndexOffset: number;
    kjedeId: MeldeperiodeKjedeId;
    beregningsdagPerDato: Map<string, Beregningsdag>;
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
        <Box className={style.uke}>
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
                        const dagIndex = index + dagIndexOffset;
                        const beregningsdag = beregningsdagPerDato.get(dag.dato);
                        return (
                            <Table.Row key={dag.dato}>
                                <Table.DataCell>{ukedagFraDatotekst(dag.dato)}</Table.DataCell>
                                <Table.DataCell>{formaterDatotekst(dag.dato)}</Table.DataCell>
                                <Table.DataCell className={style.ikon}>
                                    {ikonForMeldekortbehandlingDagStatusV2[dag.status]}
                                </Table.DataCell>
                                <Table.DataCell>
                                    <Select
                                        label={'Velg status for dag'}
                                        size={'small'}
                                        hideLabel={true}
                                        value={dag.status}
                                        readOnly={erReadonly}
                                        className={style.select}
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
        </Box>
    );
};

const dagStatusOptions = Object.values(MeldekortbehandlingDagStatus).map((status) => (
    <option key={status} value={status}>
        {meldekortbehandlingDagStatusTekst[status]}
    </option>
));
