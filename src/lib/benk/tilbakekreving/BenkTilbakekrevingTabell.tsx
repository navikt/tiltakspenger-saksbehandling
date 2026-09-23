import { Button } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { BenkTilbakekreving, BenkTilbakekrevingKolonne } from '../typer/tilbakekreving';
import { BenkTab } from '../typer/tabs';
import { benkTilbakekrevingKildeTekst } from '../utils/benkTekster';
import { BenkFaneTabellProps, BenkTabell } from '../felles/tabell/BenkTabell';
import { BenkKolonne } from '../felles/tabell/BenkKolonne';
import { benkKolonner } from '../felles/tabell/benkKolonner';
import { BenkTabellCelle } from '../felles/tabell/BenkTabellCelle';

const kolonner: BenkKolonne<BenkTilbakekreving, BenkTilbakekrevingKolonne>[] = [
    benkKolonner.fnr,
    {
        id: 'kilde',
        tittel: 'Kilde',
        sortKey: BenkTilbakekrevingKolonne.kilde,
        celle: (behandling) => benkTilbakekrevingKildeTekst[behandling.kilde],
    },
    benkKolonner.status,
    benkKolonner.ventestatus,
    {
        id: 'kravgrunnlagPeriode',
        tittel: 'Kravgrunnlagperiode',
        sortKey: BenkTilbakekrevingKolonne.kravgrunnlagPeriode,
        align: 'right',
        celle: (behandling) => <BenkTabellCelle.Periode periode={behandling.kravgrunnlagPeriode} />,
    },
    benkKolonner.beløp,
    benkKolonner.startet,
    benkKolonner.sistEndret,
    benkKolonner.saksbehandler,
    benkKolonner.beslutter,
    benkKolonner.handlinger<BenkTilbakekreving>((behandling) => (
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
    )),
];

export const BenkTilbakekrevingTabell = (props: BenkFaneTabellProps<BenkTab.TILBAKEKREVING>) => (
    <BenkTabell kolonner={kolonner} {...props} />
);
