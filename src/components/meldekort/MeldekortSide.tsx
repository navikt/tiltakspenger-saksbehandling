import { HStack, VStack } from '@navikt/ds-react';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { MeldekortVenstreSeksjon } from './venstre-seksjon/MeldekortVenstreSeksjon';
import { MeldekortHovedseksjon } from './hovedseksjon/MeldekortHovedseksjon';
import { useSak } from '../../context/sak/SakContext';

import style from './MeldekortSide.module.css';

export const MeldekortSide = () => {
    const { sakId, saksnummer } = useSak().sak;

    return (
        <VStack>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />
            <HStack wrap={false} className={style.behandlingLayout}>
                <MeldekortVenstreSeksjon />
                <MeldekortHovedseksjon />
            </HStack>
        </VStack>
    );
};
