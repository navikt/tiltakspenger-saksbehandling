import { Button } from '@navikt/ds-react';
import { useLagreOgBeregnMeldekort } from './useLagreOgBeregnMeldekort';
import {
    MeldekortBehandlingDTO,
    MeldekortBehandlingId,
} from '../../../../../../types/meldekort/MeldekortBehandling';
import { SakId } from '../../../../../../types/SakTypes';
import { useMeldeperiodeKjede } from '../../../../MeldeperiodeKjedeContext';
import { useFormContext } from 'react-hook-form';
import { MeldekortBehandlingForm } from '../meldekortUtfyllingUtils';

type Props = {
    meldekortId: MeldekortBehandlingId;
    sakId: SakId;
    hentMeldekortUtfylling: () => MeldekortBehandlingDTO;
    customValidering: () => boolean;
};

export const MeldekortUtfyllingLagre = ({
    meldekortId,
    sakId,
    hentMeldekortUtfylling,
    customValidering,
}: Props) => {
    const { setMeldeperiodeKjede } = useMeldeperiodeKjede();
    const { sendLagreMeldekort, sendLagreMeldekortLaster } = useLagreOgBeregnMeldekort({
        meldekortId,
        sakId,
    });

    const formContext = useFormContext<MeldekortBehandlingForm>();

    return (
        <Button
            size={'small'}
            variant={'secondary'}
            type={'button'}
            loading={sendLagreMeldekortLaster}
            onClick={() => {
                formContext.trigger().then((isValid) => {
                    if (isValid && customValidering()) {
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
