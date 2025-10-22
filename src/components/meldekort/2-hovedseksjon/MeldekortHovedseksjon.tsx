import { MeldekortBehandling } from './behandling/MeldekortBehandling';
import { MeldekortKorrigertFraTidligerePeriode } from '../0-felles-komponenter/korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';
import { useMeldeperiodeKjede } from '../MeldeperiodeKjedeContext';

import styles from './MeldekortHovedseksjon.module.css';

export const MeldekortHovedseksjon = (props: { kanMeldeInnForHelg: boolean }) => {
    const { meldeperiodeKjede, sisteMeldekortBehandling } = useMeldeperiodeKjede();
    const { korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    // Hvis den siste behandlingen er godkjent, og beregningen senere er overstyrt av korrigering på en
    // tidligere periode, så viser vi korrigeringen som gjeldende beregning
    const skalViseTidligereKorrigering =
        sisteMeldekortBehandling?.erAvsluttet && korrigeringFraTidligerePeriode;

    if (!sisteMeldekortBehandling && !skalViseTidligereKorrigering) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            {skalViseTidligereKorrigering ? (
                <MeldekortKorrigertFraTidligerePeriode
                    korrigering={korrigeringFraTidligerePeriode}
                    headerTekst={'Gjeldende beregning'}
                />
            ) : (
                sisteMeldekortBehandling && (
                    <MeldekortBehandling
                        meldekortBehandling={sisteMeldekortBehandling}
                        kanMeldeInnForHelg={props.kanMeldeInnForHelg}
                    />
                )
            )}
        </div>
    );
};
