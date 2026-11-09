import { Periode } from '~/types/Periode';
import { nonNullish } from '~/utils/object';
import {
    InnvilgbarTiltaksperiode,
    Tiltaksdeltakelse,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { erDatoIPeriode, perioderOverlapper, totalPeriode } from '~/utils/periode';
import { Nullable } from '~/types/UtilTypes';
import {
    beslutterEndringAvJournalførNotat,
    EndringAvJournalførNotat,
} from '~/lib/_felles/journalføring/beslutterEndringAvJournalførNotat';
import {
    Rammebehandling,
    RammebehandlingMedInnvilgelse,
    RammebehandlingResultat,
    Rammebehandlingsstatus,
    Rammebehandlingstype,
    SkalJournalføreNotat,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    Søknadsbehandling,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { OmgjøringResultat, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { finn18årsdag } from '~/utils/date';
import { erSladdet } from '~/utils/sladdetVerdi';
import { hentVedtatteSøknadsbehandlinger } from '~/lib/sak/sakUtils';
import { SakProps } from '~/lib/sak/SakTyper';
import { Dato } from '~/types/DatoTid';
import { hentPerioderForReversertOpphør } from '~/lib/rammebehandling/felles/innvilgelsesperiode/reversertOpphør/reversertOpphørUtils';

export const hentTiltaksperiode = (behandling: Søknadsbehandling): Nullable<Periode> => {
    const forsteStartdatoForDeltakelse = finnForsteStartdatoForTiltaksdeltakelse(behandling);
    const sisteSluttdatoForDeltakelse = finnSisteSluttdatoForTiltaksdeltakelse(behandling);
    const tiltakFraSøknad = behandling.søknad.tiltak;
    if (forsteStartdatoForDeltakelse && sisteSluttdatoForDeltakelse) {
        return {
            fraOgMed: forsteStartdatoForDeltakelse,
            tilOgMed: sisteSluttdatoForDeltakelse,
        };
    } else if (tiltakFraSøknad?.fraOgMed && tiltakFraSøknad?.tilOgMed) {
        return {
            fraOgMed: tiltakFraSøknad.fraOgMed,
            tilOgMed: tiltakFraSøknad.tilOgMed,
        };
    }
    return null;
};

export const hentTiltaksdeltakelser = (behandling: Rammebehandling): Tiltaksdeltakelse[] =>
    behandling.saksopplysninger.tiltaksdeltagelse ?? [];

/**
 * Periodene det kan innvilges for, slik backend har avgjort dem.
 * Typenavn og antall dager per uke hentes fra tiltaksdeltakelsen i saksopplysningene, og er bare visningsinformasjon.
 */
export const hentInnvilgbarePerioder = (
    behandling: Rammebehandling,
): InnvilgbarTiltaksperiode[] => {
    const tiltaksdeltakelser = hentTiltaksdeltakelser(behandling);

    return behandling.innvilgbarePerioder.map(({ internDeltakelseId, periode }) => {
        const tiltaksdeltakelse = tiltaksdeltakelser.find(
            (t) => t.internDeltakelseId === internDeltakelseId,
        );

        return {
            internDeltakelseId,
            periode,
            typeNavn: tiltaksdeltakelse?.typeNavn ?? `Tiltak med id ${internDeltakelseId}`,
            antallDagerPerUke: tiltaksdeltakelse?.antallDagerPerUke ?? null,
        };
    });
};

/** Inkluderer perioder som kan innvilges som reversert opphør. */
export const harInnvilgbarePerioder = (behandling: Rammebehandling): boolean =>
    behandling.innvilgbarePerioder.length > 0 ||
    hentPerioderForReversertOpphør(behandling).length > 0;

export const kanInnvilgeForFlereTiltak = (behandling: Rammebehandling): boolean =>
    new Set(behandling.innvilgbarePerioder.map((it) => it.internDeltakelseId)).size > 1;

export const hentInnvilgbarePerioderSomOverlapper = (
    behandling: Rammebehandling,
    periode: Periode,
): InnvilgbarTiltaksperiode[] =>
    hentInnvilgbarePerioder(behandling).filter((it) => perioderOverlapper(periode, it.periode));

/** Inkluderer perioder som kan innvilges som reversert opphør. */
export const hentTotalInnvilgbarPeriode = (behandling: Rammebehandling): Periode | null => {
    const perioder = [
        ...behandling.innvilgbarePerioder,
        ...hentPerioderForReversertOpphør(behandling),
    ].map((it) => it.periode);
    return perioder.length > 0 ? totalPeriode(perioder) : null;
};

export const finnForsteStartdatoForTiltaksdeltakelse = (
    behandling: Rammebehandling,
): Dato | null => {
    const sorterteDeltakelser = hentTiltaksdeltakelser(behandling)
        .filter((t) => t.periode.fraOgMed != null)
        .sort((a, b) => (nonNullish(b.periode.fraOgMed) > nonNullish(a.periode.fraOgMed) ? -1 : 1));
    return sorterteDeltakelser[0]?.periode.fraOgMed;
};

export const finnSisteSluttdatoForTiltaksdeltakelse = (
    behandling: Rammebehandling,
): Dato | null => {
    const sorterteDeltakelser = hentTiltaksdeltakelser(behandling)
        .filter((t) => t.periode.tilOgMed != null)
        .sort((a, b) => (nonNullish(a.periode.tilOgMed) > nonNullish(b.periode.tilOgMed) ? -1 : 1));
    return sorterteDeltakelser[0]?.periode.tilOgMed;
};

export const erRammebehandlingMedInnvilgelse = (
    behandling: Rammebehandling,
): behandling is RammebehandlingMedInnvilgelse => {
    const { resultat } = behandling;

    return erRammebehandlingInnvilgelseResultat(resultat);
};

export const rammebehandlingMedInnvilgelseEllerNull = (
    behandling: Rammebehandling,
): RammebehandlingMedInnvilgelse | null => {
    return erRammebehandlingMedInnvilgelse(behandling) ? behandling : null;
};

export const erRammebehandlingInnvilgelseResultat = (resultat: RammebehandlingResultat) => {
    return (
        resultat === SøknadsbehandlingResultat.INNVILGELSE ||
        resultat === RevurderingResultat.INNVILGELSE ||
        resultat === RevurderingResultat.FORLENGELSE ||
        resultat === RevurderingResultat.OMGJØRING
    );
};

export const erSøknadsbehandlingResultat = (
    resultat: RammebehandlingResultat,
): resultat is SøknadsbehandlingResultat => {
    return (
        resultat === SøknadsbehandlingResultat.INNVILGELSE ||
        resultat === SøknadsbehandlingResultat.AVSLAG ||
        resultat === SøknadsbehandlingResultat.IKKE_VALGT
    );
};

export const erOmgjøringResultat = (
    resultat: RammebehandlingResultat,
): resultat is OmgjøringResultat => {
    return (
        resultat === RevurderingResultat.OMGJØRING ||
        resultat === RevurderingResultat.OMGJØRING_OPPHØR ||
        resultat === RevurderingResultat.OMGJØRING_IKKE_VALGT
    );
};

/**
 * Med 'under aktiv omgjøring' så mener vi at rammebehandlingen er opprettet som en omgjøringsbehandling for en klage - og den ikke er fortsatt er i en tilstand saksbehandler kan fritt redigere på.
 *
 * @param rb - nullable fordi klage ikke alltid har en tilknyttet rammebehandling & fordi det blirr litt cleanere kode fra klage-sidene sin side :-)
 */
export const erRammebehandlingUnderAktivOmgjøring = (rb: Rammebehandling): boolean =>
    rb.status == Rammebehandlingsstatus.KLAR_TIL_BEHANDLING ||
    rb.status == Rammebehandlingsstatus.UNDER_BEHANDLING;

export const erAvsluttet = (behandling: Rammebehandling): boolean =>
    behandling.status === Rammebehandlingsstatus.AVBRUTT ||
    behandling.status === Rammebehandlingsstatus.VEDTATT;

export const fyller18ÅrISøknadsperioden = (behandling: Rammebehandling, sak: SakProps): boolean => {
    const { saksopplysninger } = behandling;
    const { fødselsdato } = saksopplysninger;

    if (erSladdet(fødselsdato)) {
        return false;
    }

    const attendeBursdag = finn18årsdag(fødselsdato.verdi);

    if (behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING) {
        const søknadsperiode = behandling.søknad.tiltaksdeltakelseperiodeDetErSøktOm;
        return søknadsperiode ? erDatoIPeriode(attendeBursdag, søknadsperiode) : false;
    }

    // For revurderinger: Sjekk mot alle vedtatte søknadsbehandlinger
    const perioderDetErSøktOm = hentVedtatteSøknadsbehandlinger(sak).map(
        (beh) => beh.søknad.tiltaksdeltakelseperiodeDetErSøktOm,
    );

    if (perioderDetErSøktOm.length === 0) {
        return false;
    }

    return erDatoIPeriode(attendeBursdag, totalPeriode(perioderDetErSøktOm));
};

export const journalførNotatEndringFraBeslutter = (
    behandling: Rammebehandling,
    felt: keyof SkalJournalføreNotat,
    skjemaValg: boolean,
    beslutterRedigerer: boolean,
): Nullable<EndringAvJournalførNotat> =>
    beslutterEndringAvJournalførNotat({
        lagretEndring: behandling.beslutterEndringer.skalJournalføreNotat?.[felt] ?? null,
        lagretValg: behandling.skalJournalføreNotat[felt],
        skjemaValg,
        beslutterRedigerer,
    });
