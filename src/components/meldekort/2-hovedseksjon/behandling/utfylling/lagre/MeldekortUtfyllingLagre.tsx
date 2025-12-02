import { Button } from '@navikt/ds-react';
import { useLagreOgBeregnMeldekort } from './useLagreOgBeregnMeldekort';
import {
    MeldekortBehandlingDTO,
    MeldekortBehandlingId,
} from '../../../../../../types/meldekort/MeldekortBehandling';
import { SakId } from '../../../../../../types/Sak';
import { useMeldeperiodeKjede } from '../../../../MeldeperiodeKjedeContext';
import { useFormContext } from 'react-hook-form';
import { MeldekortBehandlingForm } from '../meldekortUtfyllingUtils';

type Props = {
    meldekortId: MeldekortBehandlingId;
    sakId: SakId;
    hentMeldekortUtfylling: () => MeldekortBehandlingDTO;
};

export const MeldekortUtfyllingLagre = ({ meldekortId, sakId, hentMeldekortUtfylling }: Props) => {
    const { setMeldeperiodeKjede } = useMeldeperiodeKjede();
    const { sendLagreMeldekort, sendLagreMeldekortLaster } = useLagreOgBeregnMeldekort({
        meldekortId,
        sakId,
    });

    const formContext = useFormContext<MeldekortBehandlingForm>();

    return (
        <Button
            variant={'secondary'}
            type={'button'}
            size="small"
            loading={sendLagreMeldekortLaster}
            onClick={() => {
                formContext.trigger().then((isValid) => {
                    if (isValid) {
                        sendLagreMeldekort(hentMeldekortUtfylling()).then((oppdatertKjede) => {
                            if (oppdatertKjede) {
                                setMeldeperiodeKjede(oppdatertKjede);
                            }
                        });
                    }
                });
            }}
        >
            {'Lagre og beregn'}
        </Button>
    );
};
