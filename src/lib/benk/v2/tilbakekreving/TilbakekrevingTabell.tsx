import { Table } from '@navikt/ds-react';
import { BenkTilbakekreving, BenkTilbakekrevingKolonne } from '../typer/tilbakekreving';
import { BenkV2Sortering } from '../typer/felles';
import { formaterPeriode, formaterTidspunkt } from '~/utils/date';
import { formatterBeløp } from '~/lib/_felles/utbetaling/beløp/beløpUtils';
import { benkTilbakekrevingKildeTekst } from '../benkV2Utils';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { personoversiktUrl } from '~/utils/urls';
import { FnrCelle } from '../felles/FnrCelle';
import { TilbakekrevingStatusTag } from '../felles/BenkStatusTag';
import { VentestatusCelle } from '../felles/VentestatusCelle';
import { useBenkSortering } from '../felles/useBenkSortering';

type Props = {
    behandlinger: BenkTilbakekreving[];
    aktivSortering: BenkV2Sortering<BenkTilbakekrevingKolonne>;
};

export const TilbakekrevingTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader sortable={true} sortKey={BenkTilbakekrevingKolonne.fnr}>
                        {'Fødselsnummer'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkTilbakekrevingKolonne.beløp}>
                        {'Beløp'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkTilbakekrevingKolonne.kilde}>
                        {'Kilde'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>{'Kravgrunnlagperiode'}</Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkTilbakekrevingKolonne.status}>
                        {'Status'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>{'Ventestatus'}</Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkTilbakekrevingKolonne.startet}>
                        {'Startet'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                        sortable={true}
                        sortKey={BenkTilbakekrevingKolonne.sistEndret}
                    >
                        {'Sist endret'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                        sortable={true}
                        sortKey={BenkTilbakekrevingKolonne.saksbehandler}
                    >
                        {'Saksbehandler'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.sakId}>
                        <Table.HeaderCell scope={'row'}>
                            <FnrCelle fnr={behandling.fnr} />
                        </Table.HeaderCell>
                        <Table.DataCell align={'right'}>
                            {formatterBeløp(behandling.beløp)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {benkTilbakekrevingKildeTekst[behandling.kilde]}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterPeriode(behandling.kravgrunnlagPeriode)}
                        </Table.DataCell>
                        <Table.DataCell>
                            <TilbakekrevingStatusTag status={behandling.status} />
                        </Table.DataCell>
                        <Table.DataCell>
                            <VentestatusCelle ventestatus={behandling.ventestatus} />
                        </Table.DataCell>
                        <Table.DataCell>{formaterTidspunkt(behandling.startet)}</Table.DataCell>
                        <Table.DataCell>{formaterTidspunkt(behandling.sistEndret)}</Table.DataCell>
                        <Table.DataCell>
                            {behandling.saksbehandler ?? 'Ikke tildelt'}
                        </Table.DataCell>
                        <Table.DataCell>
                            <InternLenkeKnapp href={personoversiktUrl(behandling.saksnummer)}>
                                {'Se sak'}
                            </InternLenkeKnapp>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
