import { Button, Table } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { BenkTilbakekreving, BenkTilbakekrevingKolonne } from '../typer/tilbakekreving';
import { BenkSortering } from '../typer/felles';
import { benkTilbakekrevingKildeTekst } from '../utils/benkUtils';
import { BenkTilbakekrevingStatusTag } from '../felles/BenkStatusTag';
import { useBenkSortering } from '../felles/useBenkSortering';
import { BenkTabellKolonneHeader } from '../felles/BenkTabellKolonneHeader';
import { BenkTabellCelle } from '../felles/BenkTabellCelle';

type Props = {
    behandlinger: BenkTilbakekreving[];
    aktivSortering: BenkSortering<BenkTilbakekrevingKolonne>;
};

export const BenkTilbakekrevingTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <BenkTabellKolonneHeader.Fnr />
                    <Table.ColumnHeader sortable={true} sortKey={BenkTilbakekrevingKolonne.kilde}>
                        {'Kilde'}
                    </Table.ColumnHeader>
                    <BenkTabellKolonneHeader.Status />
                    <BenkTabellKolonneHeader.Ventestatus />
                    <Table.ColumnHeader
                        sortable={true}
                        sortKey={BenkTilbakekrevingKolonne.kravgrunnlagPeriode}
                        align={'right'}
                    >
                        {'Kravgrunnlagperiode'}
                    </Table.ColumnHeader>
                    <BenkTabellKolonneHeader.Beløp />
                    <BenkTabellKolonneHeader.Startet />
                    <BenkTabellKolonneHeader.SistEndret />
                    <BenkTabellKolonneHeader.Saksbehandler />
                    <BenkTabellKolonneHeader.Beslutter />
                    <BenkTabellKolonneHeader.Handlinger />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <BenkTabellCelle.Fnr
                            fnr={behandling.fnr}
                            saksnummer={behandling.saksnummer}
                        />
                        <Table.DataCell>
                            {benkTilbakekrevingKildeTekst[behandling.kilde]}
                        </Table.DataCell>
                        <Table.DataCell>
                            <BenkTilbakekrevingStatusTag status={behandling.status} />
                        </Table.DataCell>
                        <BenkTabellCelle.Ventestatus
                            ventestatus={behandling.ventestatus}
                            erTilbakekreving={true}
                        />
                        <BenkTabellCelle.Periode periode={behandling.kravgrunnlagPeriode} />
                        <BenkTabellCelle.Beløp beløp={behandling.beløp} />
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.startet} />
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.sistEndret} />
                        <BenkTabellCelle.Tildelt ident={behandling.saksbehandler} />
                        <BenkTabellCelle.Tildelt ident={behandling.beslutter} />
                        <Table.DataCell align={'right'}>
                            <Button
                                as={'a'}
                                href={behandling.url}
                                variant={'secondary'}
                                size={'small'}
                                icon={<ExternalLinkIcon aria-hidden />}
                                iconPosition={'right'}
                                target={'_blank'}
                            >
                                {'Åpne tilbakekreving'}
                            </Button>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
