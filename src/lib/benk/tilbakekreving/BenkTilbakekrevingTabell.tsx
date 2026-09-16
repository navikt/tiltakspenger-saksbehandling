import { Button, Table } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { BenkTilbakekreving, BenkTilbakekrevingKolonne } from '../typer/tilbakekreving';
import { BenkSortering } from '../typer/felles';
import { benkTilbakekrevingKildeTekst } from '../utils/benkUtils';
import { BenkTilbakekrevingStatusTag } from '../felles/BenkStatusTag';
import { useBenkSortering } from '../felles/useBenkSortering';
import { BenkTabellKolonneHeader } from '../felles/BenkTabellKolonneHeader';
import { BenkTabellCelle } from '../felles/BenkTabellCelle';
import { BenkTab } from '~/lib/benk/typer/tabs';

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
                    <BenkTabellKolonneHeader.Tilgang />
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
                    <BenkTabellKolonneHeader.Handlinger tab={BenkTab.TILBAKEKREVING} />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <BenkTabellCelle.Fnr behandling={behandling} />
                        <BenkTabellCelle.Tilgang behandling={behandling} />
                        <Table.DataCell>
                            {benkTilbakekrevingKildeTekst[behandling.kilde]}
                        </Table.DataCell>
                        <Table.DataCell>
                            <BenkTilbakekrevingStatusTag status={behandling.status} />
                        </Table.DataCell>
                        <BenkTabellCelle.Ventestatus
                            behandling={behandling}
                            erTilbakekreving={true}
                        />
                        <BenkTabellCelle.Periode periode={behandling.kravgrunnlagPeriode} />
                        <BenkTabellCelle.Beløp beløp={behandling.beløp} />
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.startet} />
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.sistEndret} />
                        <BenkTabellCelle.Tildelt ident={behandling.saksbehandler} />
                        <BenkTabellCelle.Tildelt ident={behandling.beslutter} />
                        <BenkTabellCelle.Handlinger behandling={behandling}>
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
                        </BenkTabellCelle.Handlinger>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
