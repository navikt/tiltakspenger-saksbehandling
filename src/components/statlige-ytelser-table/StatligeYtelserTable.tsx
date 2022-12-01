import React from 'react';
import { Table } from '@navikt/ds-react';
import { StatligeYtelser } from '../../types/Søknad';
import StatligeYtelserTableRows from '../statlige-ytelser-table-rows/StatligeYtelserTableRows';
import StatligYtelseNotImplementedRow from '../statlig-ytelse-not-implemented-row/StatligYtelseNotImplementedRow';

interface StatligeYtelserTableProps {
    statligeYtelser: StatligeYtelser;
}

const StatligeYtelserTable = ({ statligeYtelser }: StatligeYtelserTableProps) => {
    const { aap, dagpenger } = statligeYtelser;
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Ytelse</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <StatligeYtelserTableRows ytelseText="Arbeidsavklaringspenger" vilkårsvurderinger={aap} />
                <StatligeYtelserTableRows ytelseText="Dagpenger" vilkårsvurderinger={dagpenger} />
                <StatligYtelseNotImplementedRow ytelseText="Sykepenger" />
                <StatligYtelseNotImplementedRow ytelseText="Uføretrygd" />
                <StatligYtelseNotImplementedRow ytelseText="Overgangsstønad" />
                <StatligYtelseNotImplementedRow ytelseText="Pleiepenger" />
                <StatligYtelseNotImplementedRow ytelseText="Foreldrepenger" />
                <StatligYtelseNotImplementedRow ytelseText="Svangerskapspenger" />
                <StatligYtelseNotImplementedRow ytelseText="Gjenlevendepensjon" />
                <StatligYtelseNotImplementedRow ytelseText="Supplerende stønad" />
                <StatligYtelseNotImplementedRow ytelseText="Alderspensjon" />
                <StatligYtelseNotImplementedRow ytelseText="Opplæringspenger" />
                <StatligYtelseNotImplementedRow ytelseText="Omsorgspenger" />
            </Table.Body>
        </Table>
    );
};

export default StatligeYtelserTable;
