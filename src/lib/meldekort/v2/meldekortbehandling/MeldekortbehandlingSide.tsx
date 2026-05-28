import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/typer/Meldekortbehandling';
import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { VStack } from '@navikt/ds-react';
import { MeldekortbehandlingV2Provider } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Meldeperiodebehandlinger } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/Meldeperiodebehandlinger';
import { MeldekortbehandlingHeader } from '~/lib/meldekort/v2/meldekortbehandling/header/MeldekortbehandlingHeader';

import style from './MeldekortbehandlingSide.module.css';

type Props = {
    meldekortbehandling: MeldekortbehandlingPropsV2;
};

export const MeldekortbehandlingSide = ({ meldekortbehandling }: Props) => {
    const { sakId, saksnummer } = useSak().sak;

    return (
        <MeldekortbehandlingV2Provider meldekortbehandling={meldekortbehandling}>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />

            <VStack gap={'space-32'} className={style.meldekortbehandling}>
                <MeldekortbehandlingHeader />
                <Meldeperiodebehandlinger />
            </VStack>
        </MeldekortbehandlingV2Provider>
    );
};
