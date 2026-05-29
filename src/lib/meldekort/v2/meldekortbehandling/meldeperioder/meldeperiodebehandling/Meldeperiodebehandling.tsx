import { Box, Button, HStack, Heading, Select, Table, VStack } from '@navikt/ds-react';
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
import { formaterDatotekst, formatterMeldeperiode, ukedagFraDatotekst } from '~/utils/date';
import { meldekortbehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { formatterBeløp } from '~/utils/beløp';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { ikonForMeldekortbehandlingDagStatusV2 } from './meldekortIkonerV2';
import { useSak } from '~/lib/sak/SakContext';
import { classNames } from '~/utils/classNames';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { MeldeperiodeInfo } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiode-info/MeldeperiodeInfo';

import style from './Meldeperiodebehandling.module.css';
import { Separator } from '~/lib/_felles/separator/Separator';

type Props = {
    meldeperiodeSkjema: MeldeperiodeSkjema;
    onFjern: () => void;
    className?: string;
};

export const Meldeperiodebehandling = ({ meldeperiodeSkjema, onFjern, className }: Props) => {
    const { kjedeId, dager } = meldeperiodeSkjema;

    const { sak } = useSak();

    const kjede = hentMeldeperiodekjede(sak, kjedeId);
    const { periode } = kjede;

    const meldekortbehandling = useMeldekortbehandling();
    const { erReadonly } = useMeldekortbehandlingSkjema();

    const meldeperiodebehandling = meldekortbehandling.meldeperioder.find(
        (it) => it.kjedeId === kjedeId,
    );

    const beregningsdagPerDato = new Map<string, MeldekortBeregningsdag>();
    meldeperiodebehandling?.beregning?.dager.forEach((dag) => {
        if (dag.beregningsdag) {
            beregningsdagPerDato.set(dag.dato, dag.beregningsdag);
        }
    });

    return (
        <VStack gap={'space-16'} className={classNames(style.outer, className)}>
            <Separator className={style.full} />

            <HStack justify={'space-between'} align={'center'} className={style.venstre}>
                <Heading size={'small'} level={'3'}>
                    {`Meldeperiode: ${formatterMeldeperiode(periode)}`}
                </Heading>

                {!erReadonly && (
                    <Button size={'small'} variant={'secondary'} onClick={onFjern}>
                        {'Fjern'}
                    </Button>
                )}
            </HStack>

            <VStack gap={'space-4'} className={style.venstre}>
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

            <MeldeperiodeInfo meldeperiodeKjede={kjede} className={style.høyre} />
        </VStack>
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
