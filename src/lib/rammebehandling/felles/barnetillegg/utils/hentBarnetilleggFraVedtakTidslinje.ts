import { krympPeriodisering, slåSammenPeriodisering, sorterPeriodisering } from '~/utils/periode';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import {
    barnetilleggForInnvilgelsesperiodene,
    kunPerioderMedBarn,
    slåSammenBarnetillegg,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { hentRammevedtak } from '~/lib/sak/sakUtils';
import { Periode } from '~/types/Periode';
import { removeDuplicatesFilter } from '~/utils/array';

type BarnetilleggMedBehandlingId = BarnetilleggPeriode & { behandlingId: RammebehandlingId };

const hentBarnetilleggFraVedtak = (sak: SakProps): BarnetilleggMedBehandlingId[] => {
    const relevanteBarnetillegg: BarnetilleggMedBehandlingId[] = sak.innvilgetTidslinje.elementer
        .filter(removeDuplicatesFilter((a, b) => a.rammevedtakId === b.rammevedtakId))
        .map((el) => hentRammevedtak(sak, el.rammevedtakId))
        .flatMap((vedtak) =>
            vedtak.gjeldendeBarnetilleggPerioder.map((bt) => ({
                ...bt,
                behandlingId: vedtak.behandlingId,
            })),
        )
        .toSorted(sorterPeriodisering('asc'));

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

/** Gjeldende barnetillegg fra tidligere vedtak innenfor perioden, med 0 barn der det er innvilget uten barnetillegg. */
export const gjeldendeBarnetilleggIPeriode = (
    sak: SakProps,
    periode: Periode,
): BarnetilleggMedBehandlingId[] =>
    slåSammenPeriodisering(
        krympPeriodisering(sak.innvilgetTidslinje.elementer, periode).flatMap((element) => {
            const vedtak = hentRammevedtak(sak, element.rammevedtakId);

            return barnetilleggForInnvilgelsesperiodene(
                krympPeriodisering(vedtak.gjeldendeBarnetilleggPerioder, element.periode),
                [element.periode],
            ).map((bt) => ({ ...bt, behandlingId: vedtak.behandlingId }));
        }),
        (a, b) => a.antallBarn === b.antallBarn && a.behandlingId === b.behandlingId,
    );
