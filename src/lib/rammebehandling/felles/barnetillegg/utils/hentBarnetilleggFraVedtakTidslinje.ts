import { krympPeriodisering } from '~/utils/periode';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import {
    kunPerioderMedBarn,
    slåSammenBarnetillegg,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { hentRammevedtak } from '~/lib/sak/sakUtils';
import { Periode } from '~/types/Periode';

type BarnetilleggMedBehandlingId = BarnetilleggPeriode & { behandlingId: RammebehandlingId };

const hentBarnetilleggFraVedtak = (sak: SakProps): BarnetilleggMedBehandlingId[] => {
    const relevanteBarnetillegg: BarnetilleggMedBehandlingId[] = sak.tidslinje.elementer
        .map((el) => hentRammevedtak(sak, el.rammevedtakId))
        .flatMap((vedtak) =>
            vedtak.gjeldendeBarnetilleggPerioder.map((bt) => ({
                ...bt,
                behandlingId: vedtak.behandlingId,
            })),
        );

    return slåSammenBarnetillegg(relevanteBarnetillegg);
};

export const hentBarnetilleggFraVedtakKunMedBarn = (
    sak: SakProps,
): BarnetilleggMedBehandlingId[] => {
    return hentBarnetilleggFraVedtak(sak).filter(kunPerioderMedBarn);
};

export const barnetilleggKrympetTilPeriode = (
    sak: SakProps,
    periode: Periode,
    kunMedBarn: boolean,
): BarnetilleggMedBehandlingId[] => {
    return krympPeriodisering(
        kunMedBarn ? hentBarnetilleggFraVedtakKunMedBarn(sak) : hentBarnetilleggFraVedtak(sak),
        periode,
    );
};
