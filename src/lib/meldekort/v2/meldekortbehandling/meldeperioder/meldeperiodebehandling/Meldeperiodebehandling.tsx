import { Box, Button, HStack, Heading, Select, Table, BodyShort } from '@navikt/ds-react';
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
import { formaterDatotekst, formatterMeldeperiode, ukedagFraDatoKort } from '~/utils/date';
import { meldekortbehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { formatterBeløp } from '~/utils/beløp';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { ikonForMeldekortbehandlingDagStatusV2 } from './meldekortIkonerV2';
import { useSak } from '~/lib/sak/SakContext';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { MeldeperiodeInfo } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiode-info/MeldeperiodeInfo';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';

import style from './Meldeperiodebehandling.module.css';

type Props = {
    meldeperiodeSkjema: MeldeperiodeSkjema;
    onFjern: () => void;
    className?: string;
};

export const Meldeperiodebehandling = ({ meldeperiodeSkjema, onFjern }: Props) => {
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
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.FullBredde className={style.header}>
                <HStack justify={'space-between'} align={'center'}>
                    <Heading size={'small'} level={'3'}>
                        {`Meldeperiode: ${formatterMeldeperiode(periode)}`}
                    </Heading>

                    {!erReadonly && (
                        <Button size={'small'} variant={'secondary'} onClick={onFjern}>
                            {'Fjern'}
                        </Button>
                    )}
                </HStack>
            </MeldekortbehandlingSeksjon.FullBredde>

            <MeldekortbehandlingSeksjon.Venstre gap={'space-12'} className={style.info}>
                <MeldeperiodeInfo meldeperiodeKjede={kjede} />
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-4'}>
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
                        const { dato, status } = dag;
                        const dagIndex = index + dagIndexOffset;
                        const beregningsdag = beregningsdagPerDato.get(dato);

                        const kanEndres =
                            !erReadonly &&
                            status !== MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger;

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
                                    ) : (
                                        <BodyShort>
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
        </Box>
    );
};

const dagStatusOptions = Object.values(MeldekortbehandlingDagStatus).map((status) => (
    <option key={status} value={status}>
        {meldekortbehandlingDagStatusTekst[status]}
    </option>
));
