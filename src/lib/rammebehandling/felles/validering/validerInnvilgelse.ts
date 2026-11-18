import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { validerBarnetillegg } from '~/lib/rammebehandling/felles/validering/validerBarnetillegg';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { BehandlingMedInnvilgelseState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import {
    hentBarnFraSøknader,
    hentLagretV1SomIkkeKanEndres,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import {
    erFullstendigPeriode,
    finnPeriodiseringHull,
    inneholderHelePerioden,
    perioderOverlapper,
    validerPeriodisering,
} from '~/utils/periode';
import {
    hentInnvilgedePerioder,
    InnvilgelseForTiltak,
    Innvilgelsesperioder,
} from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import {
    erSammeTiltak,
    hentTiltakSomKanVelges,
    MAKS_ANTALL_DAGER_PER_MELDEPERIODE,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/innvilgelseForTiltakUtils';
import {
    erInnenforPeriodeForReversertOpphør,
    hentPerioderForReversertOpphørForDeltakelse,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/reversertOpphør/reversertOpphørUtils';
import { formaterPeriode } from '~/utils/date';
import {
    finnUgyldigTiltaksdeltakelse,
    ugyldigTiltaksdeltakelseTekst,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/ugyldigTiltaksdeltakelse';
import { SakProps } from '~/lib/sak/SakTyper';
import { finnGjeldendeInnvilgelserIPeriode } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

export const validerInnvilgelse = (
    sak: SakProps,
    behandling: Rammebehandling,
    skjema: BehandlingMedInnvilgelseState & { erReadonly?: boolean },
    {
        validerBarnetillegg: skalValidereBarnetillegg = true,
    }: { validerBarnetillegg?: boolean } = {},
): ValideringResultat => {
    const { innvilgelse, resultat } = skjema;

    if (!innvilgelse.harValgtPeriode) {
        return {
            errors: ['Minst ett tiltak med en innvilgelsesperiode må være valgt'],
            warnings: [],
        };
    }

    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const { innvilgelsesperioder, valgteBarn, harBarnetillegg } = innvilgelse;

    validering.errors.push(...validerTiltak(behandling, skjema, innvilgelsesperioder.tiltak));
    validering.errors.push(...validerAntallDager(innvilgelsesperioder));

    // Hull og opphør vurderes for periodene det innvilges for samlet, uavhengig av tiltak
    const innvilgedePerioder = hentInnvilgedePerioder(innvilgelsesperioder);

    const hullPerioder = finnPeriodiseringHull(innvilgedePerioder);

    const gjeldendeInnvilgelserSomOpphøres = hullPerioder.flatMap((hullPeriode) =>
        finnGjeldendeInnvilgelserIPeriode(sak, hullPeriode).filter((ip) =>
            perioderOverlapper(hullPeriode, ip),
        ),
    );

    if (gjeldendeInnvilgelserSomOpphøres.length > 0) {
        const msgPrefix = 'Valgte innvilgelsesperioder fører til et delvis opphør';

        if (resultat === RevurderingResultat.OMGJØRING) {
            validering.warnings.push(msgPrefix);
        } else {
            validering.errors.push(
                `${msgPrefix} - Vi støtter kun opphør ved omgjøring eller stans`,
            );
        }
    }

    // Barnetillegg lagret som antall barn per periode (V1) vises og forhåndsvises som det er lagret når behandlingen ikke kan endres
    if (
        !skalValidereBarnetillegg ||
        hentLagretV1SomIkkeKanEndres(behandling, skjema.erReadonly ?? false)
    ) {
        return validering;
    }

    const barnetilleggValidering = validerBarnetillegg(
        harBarnetillegg,
        valgteBarn,
        innvilgedePerioder,
        hentBarnFraSøknader(behandling, innvilgelsesperioder),
    );
    validering.warnings.push(...barnetilleggValidering.warnings);
    validering.errors.push(...barnetilleggValidering.errors);

    return validering;
};

const validerTiltak = (
    behandling: Rammebehandling,
    skjema: BehandlingMedInnvilgelseState,
    innvilgelser: InnvilgelseForTiltak[],
): string[] => {
    const errors: string[] = [];

    const tiltakSomKanVelges = hentTiltakSomKanVelges(behandling, innvilgelser);

    innvilgelser.forEach((tiltak) => {
        const { internDeltakelseId, erReversertOpphør, perioder } = tiltak;

        const typeNavn =
            tiltakSomKanVelges.find((it) => erSammeTiltak(it, tiltak))?.typeNavn ??
            internDeltakelseId;

        const navn = erReversertOpphør ? `reversert opphør av ${typeNavn}` : typeNavn;

        const kanInnvilges = erReversertOpphør
            ? hentPerioderForReversertOpphørForDeltakelse(behandling, internDeltakelseId).length > 0
            : behandling.innvilgbarePerioder.some(
                  (it) => it.internDeltakelseId === internDeltakelseId,
              );

        if (!kanInnvilges) {
            errors.push(`Kan ikke innvilge for ${navn}`);
        }

        if (perioder.length === 0) {
            errors.push(`Minst en periode må være valgt for ${navn}`);
        }

        if (!validerPeriodisering(perioder, true)) {
            errors.push(`Periodene for ${navn} kan ikke overlappe hverandre`);
        }

        perioder.forEach(({ periode }) => {
            if (periode.fraOgMed > periode.tilOgMed) {
                errors.push(
                    `Til og med-dato må være etter fra og med-dato for ${navn} (${formaterPeriode(periode)})`,
                );
            }

            if (
                erReversertOpphør &&
                kanInnvilges &&
                !erInnenforPeriodeForReversertOpphør(behandling, internDeltakelseId, periode)
            ) {
                errors.push(
                    `Et reversert opphør må være innenfor en periode som tidligere har vært innvilget (${formaterPeriode(periode)})`,
                );
            }

            if (
                skjema.resultat === RevurderingResultat.OMGJØRING &&
                erFullstendigPeriode(skjema.vedtaksperiode) &&
                !inneholderHelePerioden(skjema.vedtaksperiode, periode)
            ) {
                errors.push(
                    `Innvilgelsesperioden ${formaterPeriode(periode)} for ${navn} må være innenfor valgt vedtaksperiode`,
                );
            }

            const ugyldigTiltaksdeltakelse = finnUgyldigTiltaksdeltakelse(
                behandling,
                tiltak,
                periode,
            );

            if (ugyldigTiltaksdeltakelse) {
                errors.push(ugyldigTiltaksdeltakelseTekst(ugyldigTiltaksdeltakelse));
            }
        });
    });

    const reversertePerioder = innvilgelser
        .filter((it) => it.erReversertOpphør)
        .flatMap((it) => it.perioder);

    const vanligePerioder = innvilgelser
        .filter((it) => !it.erReversertOpphør)
        .flatMap((it) => it.perioder);

    if (
        reversertePerioder.some((reversert) =>
            vanligePerioder.some((vanlig) => perioderOverlapper(reversert.periode, vanlig.periode)),
        )
    ) {
        errors.push('Reversert opphør kan ikke overlappe perioder med en gyldig tiltaksdeltakelse');
    }

    return errors;
};

const validerAntallDager = ({ antallDagerPerMeldeperiode }: Innvilgelsesperioder): string[] =>
    antallDagerPerMeldeperiode
        .filter(
            (it) =>
                it.antallDagerPerMeldeperiode < 1 ||
                it.antallDagerPerMeldeperiode > MAKS_ANTALL_DAGER_PER_MELDEPERIODE,
        )
        .map(
            ({ periode }) =>
                `Antall dager per meldeperiode må være mellom 1 og ${MAKS_ANTALL_DAGER_PER_MELDEPERIODE} (${formaterPeriode(periode)})`,
        );
