import { HStack, Tag, VStack } from '@navikt/ds-react';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { finnMeldeperiodeKjedeStatusTekst } from '../../utils/tekstformateringUtils';
import { MeldekortVenstreSeksjon } from './venstre-seksjon/MeldekortVenstreSeksjon';
import { MeldekortHovedseksjon } from './hovedseksjon/MeldekortHovedseksjon';
import { useSak } from '../../context/sak/SakContext';
import { useMeldeperiodeKjede } from './context/MeldeperiodeKjedeContext';

import style from './MeldekortSide.module.css';

export const MeldekortSide = () => {
    const { sakId, saksnummer } = useSak().sak;
    const { meldeperiodeKjede } = useMeldeperiodeKjede();

    return (
        <VStack>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true}>
                <Tag variant="alt3-filled" className={style.behandlingTag}>
                    {finnMeldeperiodeKjedeStatusTekst[meldeperiodeKjede.status]}
                </Tag>
            </PersonaliaHeader>
            <HStack wrap={false} className={style.behandlingLayout}>
                <MeldekortVenstreSeksjon />
                <MeldekortHovedseksjon />
            </HStack>
        </VStack>
    );
};
