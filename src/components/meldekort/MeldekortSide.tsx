import { VStack } from '@navikt/ds-react';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { MeldekortVenstreSeksjon } from './1-venstre-seksjon/MeldekortVenstreSeksjon';
import { MeldekortHovedseksjon } from './2-hovedseksjon/MeldekortHovedseksjon';
import { useSak } from '../../context/sak/SakContext';
import { MeldekortHøyreSeksjon } from './3-høyre-seksjon/MeldekortHøyreSeksjon';

import style from './MeldekortSide.module.css';

export const MeldekortSide = () => {
    const { sakId, saksnummer } = useSak().sak;

    return (
        <VStack>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />
            <div className={style.behandlingLayout}>
                <MeldekortVenstreSeksjon />
                <MeldekortHovedseksjon />
                <MeldekortHøyreSeksjon />
            </div>
        </VStack>
    );
};
