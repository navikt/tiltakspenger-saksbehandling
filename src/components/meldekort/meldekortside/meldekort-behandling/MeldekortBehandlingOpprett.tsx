import { Button, Loader } from '@navikt/ds-react';
import { MeldeperiodeProps } from '../../../../types/meldekort/Meldeperiode';
import { useOpprettMeldekortBehandling } from '../../../../hooks/meldekort/useOpprettMeldekortBehandling';
import { useSak } from '../../../layout/SakLayout';
import Varsel from '../../../varsel/Varsel';
import { useRouter } from 'next/router';

import styles from './MeldekortBehandlingOpprett.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
};

export const MeldekortBehandlingOpprett = ({ meldeperiode }: Props) => {
    const router = useRouter();
    const { sakId } = useSak();
    const { opprett, laster, feil } = useOpprettMeldekortBehandling({
        hendelseId: meldeperiode.hendelseId,
        sakId,
        onSuccess: router.reload,
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
