import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { meldekortUtbetalingstatusTekst } from '../../../../utils/tekstformateringUtils';
import { formatterBeløp } from '../../../../utils/beløp';
import { classNames } from '../../../../utils/classNames';
import {
    MeldekortBeløpProps,
    Utbetalingsstatus,
} from '../../../../types/meldekort/MeldekortBehandling';

import style from './MeldekortBeløp.module.css';
import { Simulering } from '../../../../types/Simulering';
import { Nullable } from '~/types/UtilTypes';
import OppsummeringAvSimulering from '../../../oppsummeringer/simulering/OppsummeringAvSimulering';
import { useState } from 'react';
import { erSimuleringEndring } from '../../../../utils/simuleringUtils';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

type Props = {
    beløp: MeldekortBeløpProps;
    forrigeBeløp?: MeldekortBeløpProps;
    totalBeløp?: MeldekortBeløpProps;
    utbetalingsstatus?: Utbetalingsstatus;
    navkontorForUtbetaling?: string;
    simulering: Nullable<Simulering>;
};

export const MeldekortBeløp = ({
    beløp,
    forrigeBeløp,
    totalBeløp,
    utbetalingsstatus,
    navkontorForUtbetaling,
    simulering,
}: Props) => {
    const [vilSeSimulering, setVilSeSimulering] = useState(false);
    const harDiffPåTotalBeløp = totalBeløp && totalBeløp.totalt != beløp.totalt;

    const erFeilutbetalingStørreEnn0 =
        simulering && erSimuleringEndring(simulering) && simulering.totalFeilutbetaling > 0;

    return (
        <>
            <VStack gap={'1'}>
                <BeløpRad
                    tekst={'Ordinært beløp for perioden:'}
                    beløp={beløp.ordinært}
                    beløpForrige={forrigeBeløp?.ordinært}
                />
                <BeløpRad
                    tekst={'Barnetillegg beløp for perioden:'}
                    beløp={beløp.barnetillegg}
                    beløpForrige={forrigeBeløp?.barnetillegg}
                />
                <BeløpRad
                    tekst={'Totalt beløp for perioden:'}
                    beløp={beløp.totalt}
                    beløpForrige={forrigeBeløp?.totalt}
                />
                {harDiffPåTotalBeløp && (
                    <BeløpRad
                        tekst={'Totalt beløp beregnet for meldekortet:'}
                        beløp={totalBeløp.totalt}
                    />
                )}
            </VStack>
            {simulering && (
                <Button
                    onClick={() => setVilSeSimulering(!vilSeSimulering)}
                    variant="secondary"
                    size="small"
                    type="button"
                    className={style.seSimuleringKnapp}
                >
                    {vilSeSimulering ? (
                        'Skjul simulering'
                    ) : (
                        <>
                            Vis simulering{' '}
                            {erFeilutbetalingStørreEnn0 && (
                                <ExclamationmarkTriangleFillIcon
                                    className={style.advarselIkon}
                                    title="Advarsel ikon"
                                    fontSize="1rem"
                                />
                            )}
                        </>
                    )}
                </Button>
            )}
            {vilSeSimulering && <OppsummeringAvSimulering simulering={simulering!} />}
            {(navkontorForUtbetaling || utbetalingsstatus) && (
                <VStack gap={'1'}>
                    {navkontorForUtbetaling && (
                        <HStack gap={'5'} className={style.rad}>
                            <BodyShort>{'Nav-kontor det skal utbetales fra:'}</BodyShort>
                            <BodyShort weight={'semibold'}>{navkontorForUtbetaling}</BodyShort>
                        </HStack>
                    )}
                    {utbetalingsstatus && (
                        <HStack gap={'5'} className={style.rad}>
                            <BodyShort>{'Utbetalingsstatus: '}</BodyShort>
                            <BodyShort weight={'semibold'}>
                                {meldekortUtbetalingstatusTekst[utbetalingsstatus]}
                            </BodyShort>
                        </HStack>
                    )}
                </VStack>
            )}
        </>
    );
};

const BeløpRad = ({
    tekst,
    beløp,
    beløpForrige,
}: {
    tekst: string;
    beløp: number;
    beløpForrige?: number;
}) => {
    const diff = beløpForrige && beløp - beløpForrige;

    return (
        <HStack gap={'5'} className={style.rad}>
            <BodyShort>{tekst}</BodyShort>
            <div className={style.beløp}>
                <BodyShort weight={'semibold'}>{formatterBeløp(beløp)}</BodyShort>
                {!!diff && (
                    <BodyShort
                        className={classNames(diff < 0 && style.negativ)}
                    >{`(${formatterBeløp(diff, { signDisplay: 'always' })})`}</BodyShort>
                )}
            </div>
        </HStack>
    );
};
