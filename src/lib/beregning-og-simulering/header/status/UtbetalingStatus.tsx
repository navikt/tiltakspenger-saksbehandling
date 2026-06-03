import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { utbetalingsstatusTekst } from '~/utils/tekstformateringUtils';
import { Utbetalingsstatus } from '~/types/Utbetaling';
import { Nullable } from '~/types/UtilTypes';

import style from '~/lib/_felles/utbetaling/UtbetalingFelles.module.css';

export type UtbetalingStatusProps = {
    navkontor: string;
    navkontorNavn?: Nullable<string>;
    utbetalingsstatus?: Utbetalingsstatus;
};

export const UtbetalingStatus = ({
    navkontor,
    navkontorNavn,
    utbetalingsstatus,
}: UtbetalingStatusProps) => {
    return (
        <VStack gap={'space-4'}>
            <HStack gap={'space-20'} className={style.rad}>
                <BodyShort>{'Nav-kontor for utbetaling:'}</BodyShort>
                <BodyShort weight={'semibold'}>
                    {navkontorNavn ? `${navkontorNavn} (${navkontor})` : navkontor}
                </BodyShort>
            </HStack>
            {utbetalingsstatus && (
                <HStack gap={'space-20'} className={style.rad}>
                    <BodyShort>{'Utbetalingsstatus: '}</BodyShort>
                    <BodyShort weight={'semibold'}>
                        {utbetalingsstatusTekst[utbetalingsstatus]}
                    </BodyShort>
                </HStack>
            )}
        </VStack>
    );
};
