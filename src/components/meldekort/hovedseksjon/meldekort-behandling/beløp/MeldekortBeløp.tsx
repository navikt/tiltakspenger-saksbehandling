import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { MeldekortBeløpProps } from '../../../../../types/meldekort/MeldekortBehandling';

import style from './MeldekortBeløp.module.css';

type Props = {
    beløp: MeldekortBeløpProps;
    navkontorForUtbetaling?: string;
};

export const MeldekortBeløp = ({ beløp, navkontorForUtbetaling }: Props) => {
    return (
        <>
            <VStack gap={'1'}>
                <HStack gap={'5'} className={style.rad}>
                    <BodyShort weight={'semibold'}>{'Ordinært beløp for perioden:'}</BodyShort>
                    <BodyShort weight={'semibold'} className={style.meldekortBeløp}>
                        {beløp.ordinært},-
                    </BodyShort>
                </HStack>
                <HStack gap={'5'} className={style.rad}>
                    <BodyShort weight={'semibold'}>{'Barnetillegg beløp for perioden:'}</BodyShort>
                    <BodyShort weight={'semibold'} className={style.meldekortBeløp}>
                        {`${beløp.barnetillegg},-`}
                    </BodyShort>
                </HStack>
                <HStack gap={'5'} className={style.rad}>
                    <BodyShort weight={'semibold'}>{'Totalt beløp for perioden:'}</BodyShort>
                    <BodyShort weight={'semibold'} className={style.meldekortBeløp}>
                        {`${beløp.totalt},-`}
                    </BodyShort>
                </HStack>
            </VStack>
            {navkontorForUtbetaling && (
                <HStack gap={'5'} className={style.rad}>
                    <BodyShort weight={'semibold'}>
                        {'Nav - kontor det skal utbetales fra:'}
                    </BodyShort>
                    <BodyShort weight={'semibold'}>{navkontorForUtbetaling}</BodyShort>
                </HStack>
            )}
        </>
    );
};
