import { Button, Loader } from '@navikt/ds-react';
import { MeldeperiodeProps } from '../../../../types/MeldekortTypes';
import { useOpprettMeldekortBehandling } from '../../../../hooks/meldekort/useOpprettMeldekortBehandling';
import { useSak } from '../../../layout/SakLayout';
import Varsel from '../../../varsel/Varsel';

import styles from './MeldekortBehandlingOpprett.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
};

export const MeldekortBehandlingOpprett = ({ meldeperiode }: Props) => {
    const { sakId } = useSak();
    const { opprett, laster, feil } = useOpprettMeldekortBehandling(meldeperiode.hendelseId, sakId);

    return (
        <div>
            <Button
                onClick={() => {
                    console.log('Oppretter behandling');
                    opprett();
                }}
                disabled={laster}
                icon={laster ? <Loader /> : undefined}
                className={styles.knapp}
            >
                {'Opprett behandling'}
            </Button>
            {feil && <Varsel variant={'error'} melding={feil} className={styles.varsel} />}
        </div>
    );
};
