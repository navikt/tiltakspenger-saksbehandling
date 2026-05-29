import { HStack } from '@navikt/ds-react';
import { MeldekortbehandlingLagre } from '~/lib/meldekort/v2/meldekortbehandling/handlinger/lagre/MeldekortbehandlingLagre';

import style from './MeldekortbehandlingHandlinger.module.css';

export const MeldekortbehandlingHandlinger = () => {
    return (
        <HStack justify={'end'} className={style.outer}>
            <MeldekortbehandlingLagre />
        </HStack>
    );
};
