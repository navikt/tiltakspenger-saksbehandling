import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import { SakProps } from '~/lib/sak/SakTyper';
import { barnetilleggKrympetTilPeriode } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { Periode } from '~/types/Periode';
import { Rammebehandling, Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { slåSammenPeriodisering } from '~/utils/periode';

export const kunPerioderMedBarn = (it: BarnetilleggPeriode) => it.antallBarn > 0;

export const harSøktBarnetillegg = (periode: Periode, behandling: Rammebehandling, sak: SakProps) =>
    (behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
        ? behandling.søknad.barnetillegg
        : barnetilleggKrympetTilPeriode(sak.tidslinje, periode, true)
    ).length > 0;

export const slåSammenBarnetillegg = <T extends BarnetilleggPeriode>(periodisering: T[]): T[] => {
    return slåSammenPeriodisering(periodisering, (a, b) => a.antallBarn === b.antallBarn);
};
