import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { Utbetalingsstatus } from '~/lib/_felles/utbetaling/utbetalingTyper';
import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { sladdbarTekst } from '~/utils/sladdetVerdi';
import { utbetalingsstatusTekst } from '~/lib/beregning-og-simulering/utils/utbetalingTekster';

import style from '~/lib/_felles/utbetaling/UtbetalingFelles.module.css';

export type UtbetalingStatusProps = {
    navkontor: SladdbarVerdi<string>;
    navkontorNavn: SladdbarVerdi<Nullable<string>>;
    utbetalingsstatus?: Utbetalingsstatus;
};

export const UtbetalingStatus = ({
    navkontor,
    navkontorNavn,
    utbetalingsstatus,
}: UtbetalingStatusProps) => {
    const navkontorNummerTekst = sladdbarTekst(navkontor);
    const navkontorNavnTekst = sladdbarTekst(navkontorNavn);
    const navkontorTekst = navkontorNavnTekst
        ? `${navkontorNavnTekst} (${navkontorNummerTekst})`
        : navkontorNummerTekst;

    return (
        <VStack gap={'space-4'}>
            <HStack gap={'space-20'} className={style.rad}>
                <BodyShort>{'Nav-kontor for utbetaling:'}</BodyShort>
                <BodyShort weight={'semibold'}>{navkontorTekst}</BodyShort>
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
