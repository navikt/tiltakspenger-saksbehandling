import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { RammevedtakMedBehandling, VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { Periode } from '~/types/Periode';
import { perioderOverlapper } from '~/utils/periode';
import { removeDuplicatesFilter } from '~/utils/array';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { MeldekortbehandlingPropsV2, MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { Rammebehandling, RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { MeldekortvedtakMedBehandling } from '~/lib/meldekort/typer/Meldekortvedtak';

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

export const hentTilbakekreving = (sak: SakProps, tilbakekrevingId: TilbakekrevingId) => {
    return sak.tilbakekrevinger.find((tilbakekreving) => tilbakekreving.id === tilbakekrevingId);
};

// Henter meldeperiodekjeden for kjedeId, eller kaster dersom den ikke finnes
export const hentMeldeperiodekjede = (
    sak: SakProps,
    kjedeId: MeldeperiodeKjedeId,
): MeldeperiodeKjedePropsV2 => {
    const kjede = sak.meldeperiodeKjederV2.find((it) => it.id === kjedeId);

    if (!kjede) {
        throw Error(`Fant ikke meldeperiodekjede med id ${kjedeId}`);
    }

    return kjede;
};

// Henter meldekortbehandlingen for id, eller kaster dersom den ikke finnes
export const hentMeldekortbehandling = (
    sak: SakProps,
    id: MeldekortbehandlingId,
): MeldekortbehandlingPropsV2 => {
    const meldekortbehandling = sak.meldekortbehandlinger[id];

    if (!meldekortbehandling) {
        throw Error(`Fant ikke meldekortbehandling med id ${id}`);
    }

    return meldekortbehandling;
};

// Henter rammebehandlingen for id, eller kaster dersom den ikke finnes
export const hentRammebehandling = (sak: SakProps, id: RammebehandlingId): Rammebehandling => {
    const rammebehandling = sak.behandlinger.find((beh) => beh.id === id);

    if (!rammebehandling) {
        throw Error(`Fant ikke rammebehandling med id ${id}`);
    }

    return rammebehandling;
};

export const hentRammevedtakMedBehandlinger = (sak: SakProps): RammevedtakMedBehandling[] => {
    return sak.alleRammevedtak.map((vedtak) => {
        return {
            ...vedtak,
            behandling: hentRammebehandling(sak, vedtak.behandlingId),
        };
    });
};

export const hentMeldekortvedtakMedBehandlinger = (
    sak: SakProps,
): MeldekortvedtakMedBehandling[] => {
    return sak.meldekortvedtak.map((vedtak) => {
        return {
            ...vedtak,
            behandling: hentMeldekortbehandling(sak, vedtak.meldekortId),
        };
    });
};
