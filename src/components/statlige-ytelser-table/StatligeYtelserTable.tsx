import React from 'react';
import { Table } from '@navikt/ds-react';
import StatligeYtelserTableRows from '../statlige-ytelser-table-rows/StatligeYtelserTableRows';
import StatligYtelseNotImplementedRow from '../statlig-ytelse-not-implemented-row/StatligYtelseNotImplementedRow';
import StatligeYtelser from '../../types/StatligeYtelser';

interface StatligeYtelserTableProps {
    statligeYtelser: StatligeYtelser;
}

const StatligeYtelserTable = ({ statligeYtelser }: StatligeYtelserTableProps) => {
    const { aap, dagpenger, uføre, foreldrepenger, pleiepengerNærstående, pleiepengerSyktBarn, svangerskapspenger, opplæringspenger, omsorgspenger, overgangsstønad } = statligeYtelser;
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
                <StatligeYtelserTableRows ytelseText="Uføretrygd" vilkårsvurderinger={uføre} />
                <StatligeYtelserTableRows ytelseText="Foreldrepenger" vilkårsvurderinger={foreldrepenger} />
                <StatligeYtelserTableRows ytelseText="Pleiepenger nærstående" vilkårsvurderinger={pleiepengerNærstående} />
                <StatligeYtelserTableRows ytelseText="Pleiepenger sykt barn" vilkårsvurderinger={pleiepengerSyktBarn} />
                <StatligeYtelserTableRows ytelseText="Svangerskapspenger" vilkårsvurderinger={svangerskapspenger} />
                <StatligeYtelserTableRows ytelseText="Opplæringspenger" vilkårsvurderinger={opplæringspenger} />
                <StatligeYtelserTableRows ytelseText="Omsorgspenger" vilkårsvurderinger={omsorgspenger} />
                <StatligeYtelserTableRows ytelseText="Overgangsstønad" vilkårsvurderinger={overgangsstønad} />
                <StatligYtelseNotImplementedRow ytelseText="Sykepenger" />
                <StatligYtelseNotImplementedRow ytelseText="Gjenlevendepensjon" />
                <StatligYtelseNotImplementedRow ytelseText="Supplerende stønad" />
                <StatligYtelseNotImplementedRow ytelseText="Alderspensjon" />
            </Table.Body>
        </Table>
    );
};

export default StatligeYtelserTable;
