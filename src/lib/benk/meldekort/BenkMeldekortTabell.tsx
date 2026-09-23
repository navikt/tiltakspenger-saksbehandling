import { HStack } from '@navikt/ds-react';
import { BenkMeldekort, BenkMeldekortKolonne, BenkMeldekortMedTilgang } from '../typer/meldekort';
import { BenkBehandlingstype } from '../typer/felles';
import { BenkTab } from '../typer/tabs';
import { benkMeldekortTypeTekst } from '../utils/benkTekster';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { meldekortbehandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { hentVerdi } from '~/utils/sladdetVerdi';
import { BenkBehandlingMeny } from '../felles/BenkBehandlingMeny';
import { BenkFaneTabellProps, BenkTabell } from '../felles/tabell/BenkTabell';
import { BenkKolonne } from '../felles/tabell/BenkKolonne';
import { benkKolonner } from '../felles/tabell/benkKolonner';
import { BenkTabellCelle } from '../felles/tabell/BenkTabellCelle';
import { MeldeperiodekjedeTab } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';

/** Innsendte og korrigerte meldekort er ikke behandlinger, og tildeles derfor ikke noen */
const erMeldekortbehandling = (behandling: BenkMeldekort) =>
    behandling.type === BenkBehandlingstype.MELDEKORTBEHANDLING;

const kolonner: BenkKolonne<BenkMeldekort, BenkMeldekortKolonne>[] = [
    benkKolonner.fnr,
    {
        id: 'type',
        tittel: 'Type',
        sortKey: BenkMeldekortKolonne.type,
        celle: (behandling) => benkMeldekortTypeTekst[behandling.type],
    },
    benkKolonner.status,
    benkKolonner.ventestatus,
    {
        id: 'meldeperioder',
        tittel: 'Periode',
        sortKey: BenkMeldekortKolonne.meldeperioder,
        align: 'right',
        celle: (behandling) => (
            <BenkTabellCelle.Meldeperiode meldeperioder={behandling.meldeperioder} />
        ),
    },
    benkKolonner.sistEndret,
    benkKolonner.beløp,
    {
        ...benkKolonner.saksbehandler,
        celle: (behandling) =>
            erMeldekortbehandling(behandling) ? benkKolonner.saksbehandler.celle(behandling) : '-',
    },
    {
        ...benkKolonner.beslutter,
        celle: (behandling) =>
            erMeldekortbehandling(behandling) ? benkKolonner.beslutter.celle(behandling) : '-',
    },
    benkKolonner.handlinger<BenkMeldekort>((behandling) => <Handlinger behandling={behandling} />),
];

export const BenkMeldekortTabell = (props: BenkFaneTabellProps<BenkTab.MELDEKORT>) => (
    <BenkTabell kolonner={kolonner} {...props} />
);

const Handlinger = ({ behandling }: { behandling: BenkMeldekortMedTilgang }) => {
    const saksnummer = hentVerdi(behandling.saksnummer);

    return behandling.type === BenkBehandlingstype.MELDEKORTBEHANDLING ? (
        <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
            <InternLenkeKnapp href={meldekortbehandlingUrl(saksnummer, behandling.id)}>
                {'Åpne'}
            </InternLenkeKnapp>
            <BenkBehandlingMeny behandling={behandling} />
        </HStack>
    ) : (
        <InternLenkeKnapp
            href={meldeperiodeUrl(
                saksnummer,
                // Innsendte/korrigerte meldekort dekker nøyaktig én meldeperiode
                behandling.meldeperioder[0],
                MeldeperiodekjedeTab.BrukersMeldekort,
            )}
        >
            {'Åpne'}
        </InternLenkeKnapp>
    );
};
