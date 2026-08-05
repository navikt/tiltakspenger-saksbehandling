import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import {
    Rammevedtak,
    RammevedtakMedBehandling,
    VedtakId,
} from '~/lib/rammebehandling/typer/Rammevedtak';
import { Periode } from '~/types/Periode';
import { perioderOverlapper } from '~/utils/periode';
import { removeDuplicatesFilter } from '~/utils/array';
import {
    TilbakekrevingBehandling,
    TilbakekrevingId,
} from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { MeldeperiodeKjedeId, MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { Rammebehandling, RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { MeldekortvedtakMedBehandling } from '~/lib/meldekort/typer/Meldekortvedtak';
import { Klagebehandling, KlageId } from '~/lib/klage/typer/Klage';
import { KlagevedtakMedBehandling } from '~/lib/klage/typer/Klagevedtak';
import { VedtakType } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Søknad, SøknadId } from '~/types/Søknad';
import { ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';

export const hentVedtatteSøknadsbehandlinger = (sak: SakProps) => {
    const { alleRammevedtak, rammebehandlinger } = sak;

    return alleRammevedtak
        .map((vedtak) => rammebehandlinger.find((beh) => beh.id === vedtak.behandlingId)!)
        .filter((beh) => beh.resultat === SøknadsbehandlingResultat.INNVILGELSE)
        .toSorted((a, b) => (a.iverksattTidspunkt! > b.iverksattTidspunkt! ? -1 : 1));
};

// Henter rammevedtaket for id, eller kaster dersom det ikke finnes
export const hentRammevedtak = (sak: SakProps, vedtakId: VedtakId): Rammevedtak => {
    const vedtak = sak.alleRammevedtak.find((it) => it.id === vedtakId);

    if (!vedtak) {
        throw Error(`Fant ikke rammevedtak med id ${vedtakId}`);
    }

    return vedtak;
};

export const hentGjeldendeRammevedtak = (
    sak: SakProps,
    vedtakId: VedtakId,
): Rammevedtak | undefined => {
    return sak.tidslinje.elementer.some((el) => el.rammevedtakId === vedtakId)
        ? hentRammevedtak(sak, vedtakId)
        : undefined;
};

export const hentGjeldendeRammevedtakIPeriode = (
    sak: SakProps,
    periode: Periode,
): Rammevedtak[] => {
    return sak.tidslinje.elementer
        .filter((el) => perioderOverlapper(el.periode, periode))
        .map((el) => hentRammevedtak(sak, el.rammevedtakId))
        .filter(removeDuplicatesFilter((a, b) => a.id === b.id));
};

// Henter søknaden for id, eller kaster dersom den ikke finnes
export const hentSøknad = (sak: SakProps, søknadId: SøknadId): Søknad => {
    const søknad = sak.søknader.find((it) => it.id === søknadId);

    if (!søknad) {
        throw Error(`Fant ikke søknad med id ${søknadId}`);
    }

    return søknad;
};

// Henter tilbakekrevingen for id, eller kaster dersom den ikke finnes
export const hentTilbakekreving = (
    sak: SakProps,
    tilbakekrevingId: TilbakekrevingId,
): TilbakekrevingBehandling => {
    const tilbakekreving = sak.tilbakekrevinger.find((it) => it.id === tilbakekrevingId);

    if (!tilbakekreving) {
        throw Error(`Fant ikke tilbakekreving med id ${tilbakekrevingId}`);
    }

    return tilbakekreving;
};

// Henter meldeperiodekjeden for kjedeId, eller kaster dersom den ikke finnes
export const hentMeldeperiodekjede = (
    sak: SakProps,
    kjedeId: MeldeperiodeKjedeId,
): MeldeperiodekjedeProps => {
    const kjede = sak.meldeperiodeKjeder.find((it) => it.id === kjedeId);

    if (!kjede) {
        throw Error(`Fant ikke meldeperiodekjede med id ${kjedeId}`);
    }

    return kjede;
};

// Henter meldekortbehandlingen for id, eller kaster dersom den ikke finnes
export const hentMeldekortbehandling = (
    sak: SakProps,
    id: MeldekortbehandlingId,
): MeldekortbehandlingProps => {
    const meldekortbehandling = sak.meldekortbehandlinger[id];

    if (!meldekortbehandling) {
        throw Error(`Fant ikke meldekortbehandling med id ${id}`);
    }

    return meldekortbehandling;
};

// Henter rammebehandlingen for id, eller kaster dersom den ikke finnes
export const hentRammebehandling = (sak: SakProps, id: RammebehandlingId): Rammebehandling => {
    const rammebehandling = sak.rammebehandlinger.find((beh) => beh.id === id);

    if (!rammebehandling) {
        throw Error(`Fant ikke rammebehandling med id ${id}`);
    }

    return rammebehandling;
};

export const hentRammevedtakMedBehandlinger = (sak: SakProps): RammevedtakMedBehandling[] => {
    return sak.alleRammevedtak.map((vedtak) => {
        return {
            ...vedtak,
            vedtakType: VedtakType.Rammebehandling,
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
            vedtakType: VedtakType.Meldekort,
            behandling: hentMeldekortbehandling(sak, vedtak.meldekortId),
        };
    });
};

// Henter de åpne meldekortbehandlingene på saken
export const hentÅpneMeldekortbehandlinger = (sak: SakProps): MeldekortbehandlingProps[] =>
    sak.åpneBehandlinger
        .filter((åpenBehandling) => åpenBehandling.type === ÅpenBehandlingType.MELDEKORT)
        .map((åpenBehandling) => hentMeldekortbehandling(sak, åpenBehandling.id));

export const hentKlagebehandling = (sak: SakProps, klageId: KlageId): Klagebehandling => {
    const klagebehandling = sak.klagebehandlinger.find((klage) => klage.id === klageId);

    if (!klagebehandling) {
        throw Error(`Fant ikke klagebehandling med id ${klageId}`);
    }

    return klagebehandling;
};

export const hentKlagevedtakMedBehandlinger = (sak: SakProps): KlagevedtakMedBehandling[] => {
    return sak.alleKlagevedtak.map((vedtak) => {
        return {
            ...vedtak,
            vedtakType: VedtakType.Klage,
            behandling: hentKlagebehandling(sak, vedtak.klagebehandlingId),
        };
    });
};
