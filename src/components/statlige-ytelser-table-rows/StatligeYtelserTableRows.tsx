import React from 'react';
import { Vilkårsvurdering } from '../../types/Søknad';
import { Table } from '@navikt/ds-react';
import { Utfall } from '../../types/Utfall';
import IconWithText from '../icon-with-text/IconWithText';
import UtfallIcon from '../utfall-icon/UtfallIcon';
import { formatÅpenPeriode } from '../../utils/date';

interface StatligeYtelserTableRowsProps {
    vilkårsvurderinger: Vilkårsvurdering[];
    ytelseText: string;
}

function createVurderingText({ utfall }: Vilkårsvurdering, ytelseText: string) {
    if (Utfall.Oppfylt === utfall) {
        return `Bruker er ikke innvilget ${ytelseText}`;
    }
    if (Utfall.IkkeOppfylt === utfall || Utfall.KreverManuellVurdering === utfall) {
        return `Bruker er innvilget ${ytelseText}`;
    }
    return '';
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
