import { Meldekortbehandling } from './behandling/Meldekortbehandling';
import { MeldekortKorrigertFraTidligerePeriode } from '../0-felles-komponenter/korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';

import styles from './MeldekortHovedseksjon.module.css';
import { useSak } from '~/lib/sak/SakContext';

export const MeldekortHovedseksjon = () => {
    const { sak } = useSak();
    const { meldeperiodeKjede, sisteMeldekortbehandling } = useMeldeperiodeKjede();
    const { korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    const meldekortbehandlingensKlagebehandling =
        sak.klageBehandlinger.find(
            (klage) => klage.id === sisteMeldekortbehandling?.klagebehandlingId,
        ) ?? null;

    // Hvis den siste behandlingen er godkjent, og beregningen senere er overstyrt av korrigering på en
    // tidligere periode, så viser vi korrigeringen som gjeldende beregning
    const skalViseTidligereKorrigering =
        sisteMeldekortbehandling?.erAvsluttet && korrigeringFraTidligerePeriode;

    if (!sisteMeldekortbehandling && !skalViseTidligereKorrigering) {
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
                sisteMeldekortbehandling && (
                    <Meldekortbehandling
                        meldekortbehandling={sisteMeldekortbehandling}
                        klagebehandling={meldekortbehandlingensKlagebehandling}
                    />
                )
            )}
        </div>
    );
};
