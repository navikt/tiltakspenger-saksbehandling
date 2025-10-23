import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { utbetalingsstatusTekst } from '~/utils/tekstformateringUtils';

import style from '../UtbetalingFelles.module.css';
import { Utbetalingsstatus } from '~/types/Utbetaling';

export type UtbetalingStatusProps = {
    navkontor: string;
    navkontorNavn?: string;
    utbetalingsstatus?: Utbetalingsstatus;
};

export const UtbetalingStatus = ({
    navkontor,
    navkontorNavn,
    utbetalingsstatus,
}: UtbetalingStatusProps) => {
    return (
        <VStack gap={'1'}>
            <HStack gap={'5'} className={style.rad}>
                <BodyShort>{'Nav-kontor for utbetaling:'}</BodyShort>
                <BodyShort weight={'semibold'}>
                    {navkontorNavn ? `${navkontorNavn} (${navkontor})` : navkontor}
                </BodyShort>
            </HStack>
            {utbetalingsstatus && (
                <HStack gap={'5'} className={style.rad}>
                    <BodyShort>{'Utbetalingsstatus: '}</BodyShort>
                    <BodyShort weight={'semibold'}>
                        {utbetalingsstatusTekst[utbetalingsstatus]}
                    </BodyShort>
                </HStack>
            )}
        </VStack>
    );
};
