import { BodyShort, Button, HStack, Tag } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { classNames } from '~/utils/classNames';
import { formatterBeløp } from '~/lib/_felles/utbetaling/beløp/beløpUtils';
import { beløpStyle } from '~/lib/_felles/utbetaling/beløp/beløpStyle';
import { formaterPeriode, ukenummerFraDatotekst } from '~/utils/date';
import { Periode } from '~/types/Periode';
import { Simuleringsflagg } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';

import style from './SimuleringDetaljerMeldeperiodeHeader.module.css';

type Props = {
    periode: Periode;
    beregnetDiff: number;
    simulertDiff?: number;
    flagg: Simuleringsflagg;
    erÅpen: boolean;
    setErÅpen: (erÅpen: boolean) => void;
};

export const SimuleringDetaljerMeldeperiodeHeader = ({
    periode,
    beregnetDiff,
    simulertDiff,
    flagg,
    erÅpen,
    setErÅpen,
}: Props) => {
    const beregningOgSimuleringAvviker =
        simulertDiff !== undefined && beregnetDiff !== simulertDiff;

    const periodeString = formaterPeriode(periode);
    const ukerString = `${ukenummerFraDatotekst(periode.fraOgMed)} og ${ukenummerFraDatotekst(periode.tilOgMed)}`;

    return (
        <div className={style.header}>
            <Button
                data-color="neutral"
                onClick={() => setErÅpen(!erÅpen)}
                variant={'tertiary'}
                size={'medium'}
                type={'button'}
                icon={
                    <ChevronDownIcon
                        className={classNames(style.knappIkon, erÅpen && style.ikonÅpen)}
                    />
                }
                className={style.knapp}
            >{`Meldeperiode uke ${ukerString} (${periodeString})`}</Button>
            <div className={style.headerHøyre}>
                <SimuleringsflaggTags flagg={flagg} />
                <div className={style.headerBeregning}>
                    {beregningOgSimuleringAvviker ? (
                        <Infokort variant={flagg.harJustering ? 'info' : 'advarsel'} size={'small'}>
                            {'Simulert utbetaling '}
                            <strong>{formatterBeløp(simulertDiff)}</strong>
                            {' avviker fra vår beregning '}
                            <strong>{formatterBeløp(beregnetDiff)}</strong>
                            {flagg.harJustering &&
                                ' fordi oppdragssystemet har justert mot andre meldeperioder'}
                        </Infokort>
                    ) : (
                        <>
                            <BodyShort>{`Beregnet endring: `}</BodyShort>
                            <strong className={beløpStyle(beregnetDiff)}>
                                {formatterBeløp(beregnetDiff)}
                            </strong>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Kompakt status for meldeperioden, synlig uten å åpne detaljene.
 * En justering som går opp i null har sum null og er ellers usynlig i beløpene.
 */
const SimuleringsflaggTags = ({ flagg }: { flagg: Simuleringsflagg }) => {
    return (
        <HStack gap={'space-4'} align={'center'}>
            {flagg.harJustering && (
                <Tag
                    size={'small'}
                    variant={flagg.justeringPåTversAvMeldeperiodeEllerMåned ? 'warning' : 'info'}
                >
                    {'Justering'}
                </Tag>
            )}
            {flagg.harFeilutbetaling && (
                <Tag size={'small'} variant={'warning'}>
                    {'Feilutbetaling'}
                </Tag>
            )}
            {flagg.harTrekk && (
                <Tag size={'small'} variant={'neutral'}>
                    {'Trekk'}
                </Tag>
            )}
        </HStack>
    );
};
