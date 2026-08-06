import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodekjedeVenstreSeksjon } from '~/lib/meldekort/meldeperiodekjede/venstre-seksjon/MeldeperiodekjedeVenstreSeksjon';
import { MeldeperiodekjedeHøyreSeksjon } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';
import { MeldeperiodekjedeProvider } from '~/lib/meldekort/meldeperiodekjede/context/MeldeperiodekjedeContext';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

import style from './MeldeperiodekjedeSide.module.css';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
};

export const MeldeperiodekjedeSide = ({ kjedeId }: Props) => {
    const { sak } = useSak();
    const { sakId, saksnummer } = sak;

    const kjede = hentMeldeperiodekjede(sak, kjedeId);

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />
            <MeldeperiodekjedeProvider meldeperiodeKjede={kjede}>
                <div className={style.layout}>
                    <MeldeperiodekjedeVenstreSeksjon />
                    <MeldeperiodekjedeHøyreSeksjon />
                </div>
            </MeldeperiodekjedeProvider>
        </>
    );
};
