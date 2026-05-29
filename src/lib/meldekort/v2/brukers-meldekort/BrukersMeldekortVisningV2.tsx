import { BodyShort, HStack, Table, VStack } from '@navikt/ds-react';
import {
    formaterDatotekst,
    formaterTidspunkt,
    ukedagFraDato,
    ukenummerFraDatotekst,
} from '~/utils/date';
import { ikonForBrukersMeldekortDagStatus } from '~/lib/meldekort/0-felles-komponenter/MeldekortIkoner';
import { brukersMeldekortDagStatusTekst } from '~/utils/tekstformateringUtils';
import {
    BrukersMeldekortDagProps,
    BrukersMeldekortProps,
} from '~/lib/meldekort/typer/BrukersMeldekort';
import { BrukersMeldekortAutomatiskBehandlingStatus } from '~/lib/meldekort/3-høyre-seksjon/brukers-meldekort/automatisk-behandling-status/BrukersMeldekortAutomatiskBehandlingStatus';

import style from './BrukersMeldekortVisningV2.module.css';

type Props = {
    brukersMeldekort: BrukersMeldekortProps;
};

export const BrukersMeldekortVisningV2 = ({ brukersMeldekort }: Props) => {
    const { dager, mottatt } = brukersMeldekort;

    const uke1 = dager.slice(0, 7);
    const uke2 = dager.slice(7, 14);

    return (
        <VStack gap={'space-8'}>
            <HStack gap={'space-4'} align={'center'} justify={'space-between'}>
                <BodyShort size={'small'}>
                    {'Mottatt fra bruker: '}
                    <strong>{formaterTidspunkt(mottatt)}</strong>
                </BodyShort>
            </HStack>
            <BrukersMeldekortAutomatiskBehandlingStatus meldekort={brukersMeldekort} />
            <div className={style.uker}>
                <Table size={'small'}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{'Dag'}</Table.HeaderCell>
                            <Table.HeaderCell>{'Dato'}</Table.HeaderCell>
                            <Table.HeaderCell>{'Status'}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Uke dager={uke1} />
                        <Uke dager={uke2} />
                    </Table.Body>
                </Table>
            </div>
        </VStack>
    );
};

type UkeProps = {
    dager: BrukersMeldekortDagProps[];
};

const Uke = ({ dager }: UkeProps) => {
    return (
        <>
            <Table.Row>
                <Table.DataCell colSpan={3} className={style.spacerRow} />
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell
                    colSpan={3}
                >{`Uke ${ukenummerFraDatotekst(dager.at(0)!.dato)}`}</Table.HeaderCell>
            </Table.Row>
            {dager.map(({ dato, status }) => (
                <Table.Row key={dato}>
                    <Table.DataCell>{ukedagFraDato(dato)}</Table.DataCell>
                    <Table.DataCell>{formaterDatotekst(dato)}</Table.DataCell>
                    <Table.DataCell className={style.full}>
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
