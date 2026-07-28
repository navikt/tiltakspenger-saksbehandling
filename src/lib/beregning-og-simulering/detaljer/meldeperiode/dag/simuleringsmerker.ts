import { TagProps } from '@navikt/ds-react';
import {
    Posteringstype,
    Simuleringsmerke,
    Simuleringspostering,
} from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { formatterBeløp } from '~/utils/beløp';
import { formaterPeriodeKort } from '~/utils/date';

export type KompaktMerke = {
    etikett: string;
    variant: TagProps['variant'];
    antall: number;
};

export type VisbarPostering = {
    etikett: string;
    variant: TagProps['variant'];
    beløp: string;
    periode: string;
};

// Posteringstypene som kommer med begge fortegn og skilles i egne tags.
const FORTEGNSETIKETTER = ['Trekk', 'Justering'];

/**
 * Kompakte merker for én dag, viktigst først.
 * Dagen skal bare si hvilke posteringstyper som dekker den — beløp og perioder står i posteringslista per meldeperiode.
 * Like merker slås sammen med antall, slik at to trekk blir «Trekk − ×2» i stedet for to like tags.
 *
 * Trekk og justering merkes med fortegn: et negativt trekk trekkes fra utbetalingen mens et positivt er reversering av et tidligere trekk, og en negativ justering dekker en økning mens en positiv dekker en reduksjon.
 * En dag kan ha begge fortegn, og da vises de som hver sin tag.
 */
export const tilKompakteMerker = (merker: Simuleringsmerke[]): KompaktMerke[] => {
    const perEtikett = new Map<string, KompaktMerke & { prioritet: number }>();

    merker.forEach((merke) => {
        const klasse = klassifiser(merke);
        if (klasse === null) {
            return;
        }
        // Hardt mellomrom slik at taggen aldri brekker mellom ordet og fortegnet når det er trangt.
        const medFortegn = FORTEGNSETIKETTER.includes(klasse.etikett)
            ? merke.erNegativt
                ? { ...klasse, etikett: `${klasse.etikett}\u00A0−` }
                : {
                      ...klasse,
                      etikett: `${klasse.etikett}\u00A0+`,
                      prioritet: klasse.prioritet + 0.5,
                  }
            : klasse;
        const eksisterende = perEtikett.get(medFortegn.etikett);
        if (eksisterende) {
            eksisterende.antall += 1;
        } else {
            perEtikett.set(medFortegn.etikett, { ...medFortegn, antall: 1 });
        }
    });

    return [...perEtikett.values()]
        .sort((a, b) => a.prioritet - b.prioritet)
        .map(({ etikett, variant, antall }) => ({ etikett, variant, antall }));
};

/**
 * Posteringene som er verdt en rad i lista per meldeperiode, med kildens egne beløp og perioder.
 * Ytelse og motpostering er normalflyten og vises ikke — beløpene deres ligger i summene per meldeperiode.
 */
export const tilVisbarePosteringer = (posteringer: Simuleringspostering[]): VisbarPostering[] =>
    posteringer
        .map((postering) => {
            const klasse = klassifiser(postering);
            return klasse === null ? null : { postering, klasse };
        })
        .filter((rad) => rad !== null)
        .sort(
            (a, b) =>
                a.postering.periodeFraOgMed.localeCompare(b.postering.periodeFraOgMed) ||
                a.klasse.prioritet - b.klasse.prioritet,
        )
        .map(({ postering, klasse }) => ({
            etikett: klasse.etikett,
            variant: klasse.variant,
            beløp: formatterBeløp(postering.beløp, { signDisplay: 'always' }),
            periode: formaterPeriodeKort({
                fraOgMed: postering.periodeFraOgMed,
                tilOgMed: postering.periodeTilOgMed,
            }),
        }));

type Klassifisering = {
    etikett: string;
    variant: TagProps['variant'];
    prioritet: number;
};

const klassifiser = ({
    type,
    erJustering,
}: Pick<Simuleringsmerke, 'type' | 'erJustering'>): Klassifisering | null => {
    // Justering gjenkjennes på klassekoden i backend, ikke på posteringstypen, og må derfor sjekkes før typen.
    if (erJustering || type === Posteringstype.JUSTERING) {
        return { etikett: 'Justering', variant: 'info', prioritet: 2 };
    }

    switch (type) {
        case Posteringstype.FEILUTBETALING:
            return { etikett: 'Feilutbetaling', variant: 'warning', prioritet: 1 };
        case Posteringstype.TREKK:
            return { etikett: 'Trekk', variant: 'neutral', prioritet: 3 };
        case Posteringstype.FORSKUDSSKATT:
            return { etikett: 'Forskuddsskatt', variant: 'neutral', prioritet: 4 };
        case Posteringstype.YTELSE:
        case Posteringstype.MOTPOSTERING:
            return null;
    }
};
