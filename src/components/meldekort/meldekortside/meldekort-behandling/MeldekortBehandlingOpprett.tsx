import { Button, Loader } from '@navikt/ds-react';
import { MeldeperiodeProps } from '../../../../types/meldekort/Meldeperiode';
import { useOpprettMeldekortBehandling } from '../../../../hooks/meldekort/useOpprettMeldekortBehandling';
import { useSak } from '../../../layout/SakLayout';
import Varsel from '../../../varsel/Varsel';
import { useHentMeldeperiodeKjede } from '../../../../hooks/meldekort/useHentMeldeperiodeKjede';

import styles from './MeldekortBehandlingOpprett.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
};

export const MeldekortBehandlingOpprett = ({ meldeperiode }: Props) => {
    const { sakId } = useSak();
    const { revalider } = useHentMeldeperiodeKjede(meldeperiode.kjedeId, sakId);
    const { opprett, laster, feil } = useOpprettMeldekortBehandling({
        hendelseId: meldeperiode.hendelseId,
        sakId,
        onSuccess: revalider,
    });

    return (
        <div>
            <Button
                onClick={() => {
                    console.log('Oppretter behandling');
                    opprett();
                }}
                disabled={laster}
                icon={laster && <Loader />}
                className={styles.knapp}
            >
                {'Opprett behandling'}
            </Button>
            {feil && <Varsel variant={'error'} melding={feil} className={styles.varsel} />}
        </div>
    );
};
