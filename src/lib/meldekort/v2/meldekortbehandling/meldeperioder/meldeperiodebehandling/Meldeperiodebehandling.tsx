import { Button, HStack, Heading, Select, Table, VStack } from '@navikt/ds-react';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeContext } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { formaterDatotekst, ukedagFraDatotekst } from '~/utils/date';
import { meldekortbehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';

type Props = {
    meldeperiode: MeldeperiodeContext;
    index: number;
    onFjern: () => void;
};

export const Meldeperiodebehandling = ({ meldeperiode, index, onFjern }: Props) => {
    const { erReadonly } = useMeldekortbehandlingSkjema();
    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    return (
        <VStack gap={'space-16'}>
            <HStack justify={'space-between'} align={'center'}>
                <Heading size={'small'} level={'3'}>
                    {`Meldeperiode ${index + 1}: ${meldeperiode.kjedeId}`}
                </Heading>
                {!erReadonly && (
                    <Button size={'small'} variant={'tertiary-neutral'} onClick={onFjern}>
                        {'Fjern'}
                    </Button>
                )}
            </HStack>

            <Table size={'small'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>{'Ukedag'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Dato'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Status'}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {meldeperiode.dager.map((dag, dagIndex) => (
                        <Table.Row key={dag.dato}>
                            <Table.DataCell>{ukedagFraDatotekst(dag.dato)}</Table.DataCell>
                            <Table.DataCell>{formaterDatotekst(dag.dato)}</Table.DataCell>
                            <Table.DataCell>
                                <Select
                                    label={'Velg status for dag'}
                                    size={'small'}
                                    hideLabel={true}
                                    value={dag.status}
                                    readOnly={erReadonly}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'oppdaterDagStatus',
                                            payload: {
                                                kjedeId: meldeperiode.kjedeId,
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
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </VStack>
    );
};

const dagStatusOptions = Object.values(MeldekortbehandlingDagStatus).map((status) => (
    <option key={status} value={status}>
        {meldekortbehandlingDagStatusTekst[status]}
    </option>
));
