import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodekjedeVenstreSeksjon } from '~/lib/meldekort/v2/venstre-seksjon/MeldeperiodekjedeVenstreSeksjon';
import { MeldeperiodekjedeHøyreSeksjon } from '~/lib/meldekort/v2/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';
import { MeldeperiodeKjedeV2Provider } from '~/lib/meldekort/v2/context/MeldeperiodeKjedeContextV2';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { Alert } from '@navikt/ds-react';

import style from './MeldeperiodekjedeSideV2.module.css';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
};

export const MeldeperiodekjedeSideV2 = ({ kjedeId }: Props) => {
    const { sakId, saksnummer, meldeperiodeKjederV2 } = useSak().sak;

    const kjede = meldeperiodeKjederV2.find((it) => it.id === kjedeId);

    if (!kjede) {
        return <Alert variant={'error'}>{`Fant ikke meldeperiodekjede ${kjedeId}`}</Alert>;
    }

    return (
        <MeldeperiodeKjedeV2Provider meldeperiodeKjede={kjede}>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />
            <div className={style.layout}>
                <MeldeperiodekjedeVenstreSeksjon />
                <MeldeperiodekjedeHøyreSeksjon />
            </div>
        </MeldeperiodeKjedeV2Provider>
    );
};
