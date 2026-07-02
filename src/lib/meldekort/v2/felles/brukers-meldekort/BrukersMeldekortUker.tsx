import { HStack, Table } from '@navikt/ds-react';
import {
    formaterDatotekst,
    ukedagFraDato,
    ukedagFraDatoKort,
    ukenummerFraDatotekst,
} from '~/utils/date';
import { ikonForBrukersMeldekortDagStatus } from '~/lib/meldekort/0-felles-komponenter/MeldekortIkoner';
import { brukersMeldekortDagStatusTekst } from '~/utils/tekstformateringUtils';
import {
    BrukersMeldekortDagProps,
    BrukersMeldekortProps,
} from '~/lib/meldekort/typer/BrukersMeldekort';

import style from './BrukersMeldekortUker.module.css';

type Props = {
    brukersMeldekort: BrukersMeldekortProps;
    kompakt: boolean;
};

export const BrukersMeldekortUker = ({ brukersMeldekort, kompakt }: Props) => {
    const { dager } = brukersMeldekort;

    const uke1 = dager.slice(0, 7);
    const uke2 = dager.slice(7, 14);

    return (
        <Table size={'small'}>
            <Table.Body>
                <Uke dager={uke1} kompakt={kompakt} />
                <Table.Row>
                    <Table.DataCell colSpan={3} className={style.spacerRow} />
                </Table.Row>
                <Uke dager={uke2} kompakt={kompakt} />
            </Table.Body>
        </Table>
    );
};

type UkeProps = {
    dager: BrukersMeldekortDagProps[];
    kompakt: boolean;
};

const Uke = ({ dager, kompakt }: UkeProps) => {
    const numCols = kompakt ? 2 : 3;

    return (
        <>
            <Table.Row>
                <Table.HeaderCell
                    colSpan={numCols}
                >{`Uke ${ukenummerFraDatotekst(dager.at(0)!.dato)}`}</Table.HeaderCell>
            </Table.Row>

            {dager.map(({ dato, status }) => (
                <Table.Row key={dato}>
                    <Table.DataCell>
                        {kompakt ? ukedagFraDatoKort(dato) : ukedagFraDato(dato)}
                    </Table.DataCell>
                    {!kompakt && <Table.DataCell>{formaterDatotekst(dato)}</Table.DataCell>}
                    <Table.DataCell className={style.status}>
                        <HStack align="center" gap="space-12" wrap={false}>
                            {ikonForBrukersMeldekortDagStatus[status]}
                            {brukersMeldekortDagStatusTekst[status]}
                        </HStack>
                    </Table.DataCell>
                </Table.Row>
            ))}
        </>
    );
};
