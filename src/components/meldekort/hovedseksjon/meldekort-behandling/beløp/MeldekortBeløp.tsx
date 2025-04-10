import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { MeldekortBeløpProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { formatterBeløp } from '../../../../../utils/beløp';

import style from './MeldekortBeløp.module.css';
import { classNames } from '../../../../../utils/classNames';

type Props = {
    beløp: MeldekortBeløpProps;
    forrigeBeløp?: MeldekortBeløpProps;
    navkontorForUtbetaling?: string;
};

export const MeldekortBeløp = ({ beløp, forrigeBeløp, navkontorForUtbetaling }: Props) => {
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
            </VStack>
            {navkontorForUtbetaling && (
                <HStack gap={'5'} className={style.rad}>
                    <BodyShort>{'Nav-kontor det skal utbetales fra:'}</BodyShort>
                    <BodyShort>{navkontorForUtbetaling}</BodyShort>
                </HStack>
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
