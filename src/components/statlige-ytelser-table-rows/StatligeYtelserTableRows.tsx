import React from 'react';
import { Table } from '@navikt/ds-react';
import { Vilkårsvurdering } from '../../types/Søknad';
import IconWithText from '../icon-with-text/IconWithText';
import { UtfallIcon } from '../utfall-icon/UtfallIcon';
import { formatÅpenPeriode } from '../../utils/date';
import createVurderingText from '../../utils/vurderingText';

interface StatligeYtelserTableRowsProps {
    vilkårsvurderinger: Vilkårsvurdering[];
    ytelseText: string;
}

const StatligeYtelserTableRows = ({ vilkårsvurderinger, ytelseText }: StatligeYtelserTableRowsProps) => {
    return (
        <React.Fragment>
            {vilkårsvurderinger.map((vilkårsvurdering, index) => {
                const { periode, kilde, detaljer, utfall } = vilkårsvurdering;
                return (
                    <Table.Row key={`${ytelseText}${index}`}>
                        <Table.DataCell>
                            <IconWithText
                                iconRenderer={() => <UtfallIcon utfall={utfall} />}
                                text={createVurderingText(vilkårsvurdering, ytelseText)}
                            />
                        </Table.DataCell>
                        <Table.DataCell>{(periode && formatÅpenPeriode(periode)) || '-'}</Table.DataCell>
                        <Table.DataCell>{kilde}</Table.DataCell>
                        <Table.DataCell>{detaljer}</Table.DataCell>
                    </Table.Row>
                );
            })}
        </React.Fragment>
    );
};

export default StatligeYtelserTableRows;
