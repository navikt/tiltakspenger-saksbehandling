import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { inneholderHelePerioden, totalPeriode } from '~/utils/periode';
import { formaterDatotekst, formaterPeriode } from '~/utils/date';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';
import {
    BarnetilleggBarnSkjema,
    effektivePerioderForBarn,
    formaterBarnNavn,
    harRettIInnvilgelsesperiodene,
    rettTilBarnetilleggPeriode,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { BarnFraSøknad } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import { erSladdet, hentVerdi } from '~/utils/sladdetVerdi';

const FNR_REGEX = /^\d{11}$/;

/**
 * Speiler valideringen backend gjør av barnetillegget, i tillegg til advarsler om avvik fra søknaden(e).
 * `barnFraSøknader` er barna fra søknadene for tiltaksdeltakelsene det innvilges for.
 */
export const validerBarnetillegg = (
    harBarnetillegg: boolean,
    valgteBarn: BarnetilleggBarnSkjema[],
    innvilgelsesperioder: Innvilgelsesperiode[],
    barnFraSøknader: BarnFraSøknad[],
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const perioder = innvilgelsesperioder.map((it) => it.periode);

    const barnFraSøknadMedRett = barnFraSøknader.filter(
        (it) =>
            it.opplysninger.oppholderSegIEØSSpm.svar === 'JA' &&
            harRettIInnvilgelsesperiodene(it.barn, perioder),
    );

    if (!harBarnetillegg) {
        if (barnFraSøknadMedRett.length > 0) {
            validering.warnings.push(
                `Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Barn fra søknaden med rett i innvilgelsesperioden: ${barnFraSøknadMedRett.map((it) => beskrivBarn(it.barn)).join(', ')}`,
            );
        }
        return validering;
    }

    if (valgteBarn.length === 0) {
        validering.errors.push(
            'Velg minst ett barn eller svar nei på om det skal innvilges barnetillegg',
        );
        return validering;
    }

    const totalInnvilgelsesperiode = totalPeriode(perioder);

    valgteBarn.forEach((barn) => {
        const beskrivelse = beskrivBarn(barn);
        const feil = (melding: string) => validering.errors.push(`${beskrivelse}: ${melding}`);

        if (erSladdet(barn.fødselsdato)) {
            feil('Barnet har sladdede opplysninger, og kan ikke velges');
            return;
        }

        const fnr = hentVerdi(barn.fnr)?.trim();

        if (fnr && !FNR_REGEX.test(fnr)) {
            feil('Fødselsnummer må være 11 siffer');
        }

        if (barn.kilde === BarnetilleggBarnKilde.SAKSBEHANDLER) {
            if (!hentVerdi(barn.fornavn)?.trim() || !hentVerdi(barn.etternavn)?.trim()) {
                feil('Fornavn og etternavn må fylles ut');
            }
        } else if (!barn.søknadId) {
            feil('Barnet mangler søknaden det er hentet fra');
        }

        const rett = rettTilBarnetilleggPeriode(barn.fødselsdato.verdi);

        if (barn.periode === null) {
            if (!harRettIInnvilgelsesperiodene(barn, perioder)) {
                feil(
                    `Barnet har ikke rett til barnetillegg i innvilgelsesperioden (rett fra fødsel til fylte 16 år: ${formaterPeriode(rett)})`,
                );
            }
            return;
        }

        const { periode } = barn;

        if (periode.fraOgMed > periode.tilOgMed) {
            feil('Til og med-dato må være etter fra og med-dato');
            return;
        }

        if (!inneholderHelePerioden(totalInnvilgelsesperiode, periode)) {
            feil(
                `Perioden ${formaterPeriode(periode)} må være innenfor innvilgelsesperioden ${formaterPeriode(totalInnvilgelsesperiode)}`,
            );
        }

        if (!inneholderHelePerioden(rett, periode)) {
            feil(
                `Perioden ${formaterPeriode(periode)} må være innenfor perioden barnet har rett til barnetillegg (${formaterPeriode(rett)})`,
            );
        }

        if (
            effektivePerioderForBarn({ fødselsdato: barn.fødselsdato.verdi, periode }, perioder)
                .length === 0
        ) {
            feil(
                `Perioden ${formaterPeriode(periode)} overlapper ingen innvilgelsesperioder, og gir ikke barnetillegg`,
            );
        }
    });

    const fnrListe = valgteBarn
        .map((barn) => hentVerdi(barn.fnr)?.trim())
        .filter((fnr): fnr is string => !!fnr);

    if (new Set(fnrListe).size !== fnrListe.length) {
        validering.errors.push('Samme fødselsnummer kan ikke være valgt for flere barn');
    }

    const ikkeValgteBarnFraSøknad = barnFraSøknadMedRett.filter(
        (it) => !valgteBarn.some((barn) => barn.key === it.barn.key),
    );

    if (ikkeValgteBarnFraSøknad.length > 0) {
        validering.warnings.push(
            `Barn fra søknaden med rett i innvilgelsesperioden er ikke valgt: ${ikkeValgteBarnFraSøknad.map((it) => beskrivBarn(it.barn)).join(', ')}`,
        );
    }

    const valgteBarnUtenforEØS = barnFraSøknader.filter(
        (it) =>
            it.opplysninger.oppholderSegIEØSSpm.svar !== 'JA' &&
            valgteBarn.some((barn) => barn.key === it.barn.key),
    );

    if (valgteBarnUtenforEØS.length > 0) {
        validering.warnings.push(
            `Valgte barn oppholder seg ikke i Norge eller et annet EØS-land ifølge søknaden: ${valgteBarnUtenforEØS.map((it) => beskrivBarn(it.barn)).join(', ')}`,
        );
    }

    return validering;
};

const beskrivBarn = (barn: BarnetilleggBarnSkjema): string => {
    const navn = formaterBarnNavn(barn);
    const fødselsdato = hentVerdi(barn.fødselsdato);

    if (!fødselsdato) {
        return navn || 'Barn';
    }

    return `${navn || 'Barn'} (født ${formaterDatotekst(fødselsdato)})`;
};
