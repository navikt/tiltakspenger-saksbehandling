import {
    SøknadsbehandlingInnvilgelse,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
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
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { Rammebehandling, RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { MeldekortvedtakMedBehandling } from '~/lib/meldekort/typer/Meldekortvedtak';
import { Klagebehandling, KlageId } from '~/lib/klage/typer/Klage';
import { KlagevedtakMedBehandling } from '~/lib/klage/typer/Klagevedtak';
import { VedtakType } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Søknad, SøknadId } from '~/lib/søknad/søknadTyper';
import { ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';
import {
    MeldeperiodeKjedeId,
    MeldeperiodekjedeProps,
} from '~/lib/meldekort/typer/Meldeperiodekjede';
import { nonNullish } from '~/utils/object';

export const hentVedtatteSøknadsbehandlinger = (sak: SakProps): SøknadsbehandlingInnvilgelse[] => {
    const { alleRammevedtak } = sak;

    return alleRammevedtak
        .map((vedtak) => hentRammebehandling(sak, vedtak.behandlingId))
        .filter((beh) => beh.resultat === SøknadsbehandlingResultat.INNVILGELSE)
        .toSorted((a, b) => (a.iverksattTidspunkt! > b.iverksattTidspunkt! ? -1 : 1));
};

// Henter rammevedtaket for id, eller kaster dersom det ikke finnes
export const hentRammevedtak = (sak: SakProps, vedtakId: VedtakId): Rammevedtak => {
    return nonNullish(
        sak.alleRammevedtak.find((it) => it.id === vedtakId),
        `Fant ikke rammevedtak med id ${vedtakId}`,
    );
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
    return nonNullish(
        sak.søknader.find((it) => it.id === søknadId),
        `Fant ikke søknad med id ${søknadId}`,
    );
};

// Henter tilbakekrevingen for id, eller kaster dersom den ikke finnes
export const hentTilbakekreving = (
    sak: SakProps,
    tilbakekrevingId: TilbakekrevingId,
): TilbakekrevingBehandling => {
    return nonNullish(
        sak.tilbakekrevinger.find((it) => it.id === tilbakekrevingId),
        `Fant ikke tilbakekreving med id ${tilbakekrevingId}`,
    );
};

// Henter meldeperiodekjeden for kjedeId, eller kaster dersom den ikke finnes
export const hentMeldeperiodekjede = (
    sak: SakProps,
    kjedeId: MeldeperiodeKjedeId,
): MeldeperiodekjedeProps => {
    return nonNullish(
        sak.meldeperiodeKjeder.find((it) => it.id === kjedeId),
        `Fant ikke meldeperiodekjede med id ${kjedeId}`,
    );
};

// Henter meldekortbehandlingen for id, eller kaster dersom den ikke finnes
export const hentMeldekortbehandling = (
    sak: SakProps,
    id: MeldekortbehandlingId,
): MeldekortbehandlingProps => {
    return nonNullish(sak.meldekortbehandlinger[id], `Fant ikke meldekortbehandling med id ${id}`);
};

// Henter rammebehandlingen for id, eller kaster dersom den ikke finnes
export const hentRammebehandling = (sak: SakProps, id: RammebehandlingId): Rammebehandling => {
    return nonNullish(
        sak.rammebehandlinger.find((beh) => beh.id === id),
        `Fant ikke rammebehandling med id ${id}`,
    );
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

export const hentÅpneMeldekortbehandlinger = (sak: SakProps): MeldekortbehandlingProps[] =>
    sak.åpneBehandlinger
        .filter((åpenBehandling) => åpenBehandling.type === ÅpenBehandlingType.MELDEKORT)
        .map((åpenBehandling) => hentMeldekortbehandling(sak, åpenBehandling.id));

export const hentKlagebehandling = (sak: SakProps, klageId: KlageId): Klagebehandling => {
    return nonNullish(
        sak.klagebehandlinger.find((klage) => klage.id === klageId),
        `Fant ikke klagebehandling med id ${klageId}`,
    );
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
