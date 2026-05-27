import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/typer/Meldekortbehandling';
import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { Heading } from '@navikt/ds-react';
import { MeldekortbehandlingV2Provider } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';

import style from './MeldekortbehandlingSide.module.css';

type Props = {
    meldekortbehandling: MeldekortbehandlingPropsV2;
};

export const MeldekortbehandlingSide = ({ meldekortbehandling }: Props) => {
    const { sakId, saksnummer } = useSak().sak;

    return (
        <MeldekortbehandlingV2Provider meldekortbehandling={meldekortbehandling}>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />
            <div className={style.meldekortbehandling}>
                <Heading
                    size={'large'}
                    level={'1'}
                >{`Meldekortbehandling ${meldekortbehandling.id}`}</Heading>
            </div>
        </MeldekortbehandlingV2Provider>
    );
};
