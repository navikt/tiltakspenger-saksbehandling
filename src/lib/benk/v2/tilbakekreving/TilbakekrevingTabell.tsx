import { Table } from '@navikt/ds-react';
import { BenkTilbakekreving, BenkTilbakekrevingKolonne } from '../typer/tilbakekreving';
import { BenkV2Sortering } from '../typer/felles';
import { benkTilbakekrevingKildeTekst } from '../benkV2Utils';
import { FnrCelle } from '../felles/FnrCelle';
import { TilbakekrevingStatusTag } from '../felles/BenkStatusTag';
import { VentestatusCelle } from '../felles/VentestatusCelle';
import { TidspunktCelle } from '../felles/TidspunktCelle';
import { TildeltCelle } from '../felles/TildeltCelle';
import { PeriodeCelle } from '../felles/PeriodeCelle';
import { BeløpCelle } from '../felles/BeløpCelle';
import { useBenkSortering } from '../felles/useBenkSortering';
import { Button } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import {
    BeløpKolonne,
    FnrKolonne,
    HandlingerKolonne,
    SaksbehandlerKolonne,
    SistEndretKolonne,
    StartetKolonne,
    StatusKolonne,
    VentestatusKolonne,
} from '../felles/kolonner';

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
                    <FnrKolonne />
                    <Table.ColumnHeader sortable={true} sortKey={BenkTilbakekrevingKolonne.kilde}>
                        {'Kilde'}
                    </Table.ColumnHeader>
                    <StatusKolonne />
                    <VentestatusKolonne />
                    <Table.ColumnHeader>{'Kravgrunnlagperiode'}</Table.ColumnHeader>
                    <BeløpKolonne />
                    <StartetKolonne />
                    <SistEndretKolonne />
                    <SaksbehandlerKolonne />
                    <HandlingerKolonne />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <FnrCelle fnr={behandling.fnr} saksnummer={behandling.saksnummer} />
                        <Table.DataCell>
                            {benkTilbakekrevingKildeTekst[behandling.kilde]}
                        </Table.DataCell>
                        <Table.DataCell>
                            <TilbakekrevingStatusTag status={behandling.status} />
                        </Table.DataCell>
                        <VentestatusCelle
                            ventestatus={behandling.ventestatus}
                            erTilbakekreving={true}
                        />
                        <PeriodeCelle periode={behandling.kravgrunnlagPeriode} />
                        <BeløpCelle beløp={behandling.beløp} />
                        <TidspunktCelle tidspunkt={behandling.startet} />
                        <TidspunktCelle tidspunkt={behandling.sistEndret} />
                        <TildeltCelle ident={behandling.saksbehandler} />
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
