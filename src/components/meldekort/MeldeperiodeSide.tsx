import { useSak } from '../../context/sak/useSak';
import { Button, HStack, Tag, VStack } from '@navikt/ds-react';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import Link from 'next/link';
import { finnMeldeperiodeStatusTekst } from '../../utils/tekstformateringUtils';
import { MeldekortDetaljer } from './meldekortdetaljer/MeldekortDetaljer';
import { Meldekortside } from './meldekortside/Meldekortside';
import { useMeldeperioder } from '../../hooks/meldekort/useMeldeperioder';

import style from './MeldeperiodeSide.module.css';

export const MeldeperiodeSide = () => {
    const { sak } = useSak();
    const { sakId, saksnummer } = sak;

    const { valgtMeldeperiode } = useMeldeperioder();

    return (
        <VStack>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer}>
                <Button as={Link} href={`/sak/${saksnummer}`} type="submit" size="small">
                    Tilbake til saksoversikt
                </Button>
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
