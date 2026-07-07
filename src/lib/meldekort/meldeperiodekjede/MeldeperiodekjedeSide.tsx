import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodekjedeVenstreSeksjon } from '~/lib/meldekort/meldeperiodekjede/venstre-seksjon/MeldeperiodekjedeVenstreSeksjon';
import { MeldeperiodekjedeHøyreSeksjon } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';
import { MeldeperiodekjedeProvider } from '~/lib/meldekort/meldeperiodekjede/context/MeldeperiodekjedeContext';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import style from './MeldeperiodekjedeSide.module.css';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
};

export const MeldeperiodekjedeSide = ({ kjedeId }: Props) => {
    const { sakId, saksnummer, meldeperiodeKjederV2 } = useSak().sak;

    const kjede = meldeperiodeKjederV2.find((it) => it.id === kjedeId);

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />
            {kjede ? (
                <MeldeperiodekjedeProvider meldeperiodeKjede={kjede}>
                    <div className={style.layout}>
                        <MeldeperiodekjedeVenstreSeksjon />
                        <MeldeperiodekjedeHøyreSeksjon />
                    </div>
                </MeldeperiodekjedeProvider>
            ) : (
                <Infokort
                    data-color={'danger'}
                >{`Fant ikke meldeperiodekjede ${kjedeId}`}</Infokort>
            )}
        </>
    );
};
