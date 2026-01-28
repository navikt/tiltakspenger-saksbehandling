import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { SakProps } from '~/types/Sak';
import { VedtakId } from '~/types/Rammevedtak';

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
