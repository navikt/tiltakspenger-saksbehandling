import { HStack, Tag, VStack } from '@navikt/ds-react';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { finnMeldeperiodeStatusTekst } from '../../utils/tekstformateringUtils';
import { MeldekortDetaljer } from './meldekortdetaljer/MeldekortDetaljer';
import { Meldekortside } from './meldekortside/Meldekortside';
import { useMeldeperiodeKjede } from './hooks/useMeldeperiodeKjede';
import { useSak } from '../../context/sak/SakContext';

import style from './MeldeperiodeSide.module.css';

export const MeldeperiodeSide = () => {
    const { sak } = useSak();
    const { sakId, saksnummer } = sak;

    const { valgtMeldeperiode } = useMeldeperiodeKjede();

    return (
        <VStack>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true}>
                {valgtMeldeperiode && (
                    <Tag variant="alt3-filled" className={style.behandlingTag}>
                        {finnMeldeperiodeStatusTekst[valgtMeldeperiode.status]}
                    </Tag>
                )}
            </PersonaliaHeader>
            <HStack wrap={false} className={style.behandlingLayout}>
                <MeldekortDetaljer />
                <Meldekortside />
            </HStack>
        </VStack>
    );
};
