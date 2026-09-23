import { BenkKlagebehandling, BenkKlageKolonne } from '../typer/klage';
import { BenkTab } from '../typer/tabs';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { klagebehandlingUrl, KlageStegUrlSegment } from '~/utils/urls';
import { hentVerdi } from '~/utils/sladdetVerdi';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import { Nullable } from '~/types/UtilTypes';
import { BenkFaneTabellProps, BenkTabell } from '../felles/tabell/BenkTabell';
import { BenkKolonne } from '../felles/tabell/BenkKolonne';
import { benkKolonner } from '../felles/tabell/benkKolonner';

const kolonner: BenkKolonne<BenkKlagebehandling, BenkKlageKolonne>[] = [
    benkKolonner.fnr,
    benkKolonner.resultat,
    benkKolonner.status,
    benkKolonner.ventestatus,
    benkKolonner.kravtidspunkt,
    benkKolonner.sistEndret,
    benkKolonner.saksbehandler,
    benkKolonner.handlinger<BenkKlagebehandling>((behandling) => (
        <InternLenkeKnapp
            href={klagebehandlingUrl(
                hentVerdi(behandling.saksnummer),
                behandling.id,
                klageStegForBenkRad(behandling.resultat),
            )}
        >
            {'Åpne'}
        </InternLenkeKnapp>
    )),
];

export const BenkKlageTabell = (props: BenkFaneTabellProps<BenkTab.KLAGE>) => (
    <BenkTabell kolonner={kolonner} {...props} />
);

/**
 * Speiler `finnSisteGyldigeStegForKlage` med feltene en benk-rad har.
 * Uten resultat vet vi ikke om formkravene er fylt ut, så da lander vi på første steg.
 */
const klageStegForBenkRad = (resultat: Nullable<KlagebehandlingResultat>): KlageStegUrlSegment => {
    switch (resultat) {
        case KlagebehandlingResultat.AVVIST:
            return KlageStegUrlSegment.Brev;
        case KlagebehandlingResultat.OMGJØR:
            return KlageStegUrlSegment.Resultat;
        case KlagebehandlingResultat.OPPRETTHOLDT:
            return KlageStegUrlSegment.Brev;
        case null:
            return KlageStegUrlSegment.Formkrav;
    }
};
