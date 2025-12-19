import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { SakProps } from '~/types/Sak';
import { barnetilleggKrympetTilPeriode } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { Periode } from '~/types/Periode';
import { Rammebehandling, Rammebehandlingstype } from '~/types/Rammebehandling';

export const kunPerioderMedBarn = (it: BarnetilleggPeriode) => it.antallBarn > 0;

export const harSøktBarnetillegg = (periode: Periode, behandling: Rammebehandling, sak: SakProps) =>
    (behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
        ? behandling.søknad.barnetillegg
        : barnetilleggKrympetTilPeriode(sak.tidslinje, periode, true)
    ).length > 0;
