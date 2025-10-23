import { Rammevedtak } from '~/types/Vedtak';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

const MAX_RANGE_MONTHS = 6;
const MONTHS_PER_STEP = 4;

export const useTidslinjeDateRange = (tidslinje: Rammevedtak[]) => {
    const førsteDato = dayjs(tidslinje.at(0)?.periode.fraOgMed);
    const sisteDato = dayjs(tidslinje.at(-1)?.periode.tilOgMed);

    const numMånederMedVedtak = Math.ceil(sisteDato.diff(førsteDato, 'months', true));

    const rangeMonths = Math.min(numMånederMedVedtak, MAX_RANGE_MONTHS);
    const initialScroll = Math.max(0, numMånederMedVedtak - rangeMonths);

    const [månederScroll, setMånederScroll] = useState<number>(initialScroll);

    const scrollTidslinje = useCallback(
        (numSteps: number) => {
            setMånederScroll(
                Math.max(
                    0,
                    Math.min(
                        månederScroll + numSteps * MONTHS_PER_STEP,
                        numMånederMedVedtak - MONTHS_PER_STEP,
                    ),
                ),
            );
        },
        [månederScroll],
    );

    const start = dayjs(førsteDato).add(månederScroll, 'months');
    const end = start.add(rangeMonths, 'months');

    return {
        startDate: start.toDate(),
        endDate: end.toDate(),
        scrollTidslinje,
    };
};
