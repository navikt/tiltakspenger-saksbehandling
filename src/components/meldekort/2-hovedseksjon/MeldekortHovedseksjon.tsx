import { MeldekortBehandling } from './behandling/MeldekortBehandling';
import { MeldekortKorrigertFraTidligerePeriode } from '../0-felles-komponenter/korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';
import { useMeldeperiodeKjede } from '../MeldeperiodeKjedeContext';
import { MeldekortBehandlingStatus } from '../../../types/meldekort/MeldekortBehandling';

import styles from './MeldekortHovedseksjon.module.css';

export const MeldekortHovedseksjon = () => {
    const { meldeperiodeKjede, sisteMeldekortBehandling } = useMeldeperiodeKjede();
    const { korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    // Hvis den siste behandlingen er godkjent, og beregningen senere er overstyrt av korrigering på en
    // tidligere periode, så viser vi korrigeringen som gjeldende beregning
    const skalViseTidligereKorrigering =
        sisteMeldekortBehandling?.status === MeldekortBehandlingStatus.GODKJENT &&
        korrigeringFraTidligerePeriode;

    return (
        <div className={styles.wrapper}>
            {skalViseTidligereKorrigering ? (
                <MeldekortKorrigertFraTidligerePeriode
                    korrigering={korrigeringFraTidligerePeriode}
                />
            ) : (
                sisteMeldekortBehandling && (
                    <MeldekortBehandling meldekortBehandling={sisteMeldekortBehandling} />
                )
            )}
        </div>
    );
};
