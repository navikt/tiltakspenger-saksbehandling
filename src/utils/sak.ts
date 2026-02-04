import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { SakProps } from '~/types/Sak';
import { VedtakId } from '~/types/Rammevedtak';
import { Periode } from '~/types/Periode';
import { perioderOverlapper } from '~/utils/periode';
import { removeDuplicatesFilter } from '~/utils/array';

export const hentVedtatteSøknadsbehandlinger = (sak: SakProps) => {
    const { alleRammevedtak, behandlinger } = sak;

    return alleRammevedtak
        .map((vedtak) => behandlinger.find((beh) => beh.id === vedtak.behandlingId)!)
        .filter((beh) => beh.resultat === SøknadsbehandlingResultat.INNVILGELSE)
        .toSorted((a, b) => (a.iverksattTidspunkt! > b.iverksattTidspunkt! ? -1 : 1));
};

export const hentRammevedtak = (sak: SakProps, vedtakId: VedtakId) => {
    return sak.alleRammevedtak.find((vedtak) => vedtak.id === vedtakId);
};

export const hentGjeldendeRammevedtak = (sak: SakProps, vedtakId: VedtakId) => {
    return sak.tidslinje.elementer.find((el) => el.rammevedtak.id === vedtakId)?.rammevedtak;
};

export const hentGjeldendeRammevedtakIPeriode = (sak: SakProps, periode: Periode) => {
    return sak.tidslinje.elementer
        .filter((el) => perioderOverlapper(el.periode, periode))
        .map((el) => el.rammevedtak)
        .filter(removeDuplicatesFilter((a, b) => a.id === b.id));
};
