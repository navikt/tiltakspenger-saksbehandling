import { Tabs } from '@navikt/ds-react';
import { MeldekortTidligereBehandlinger } from './tidligere-behandlinger/MeldekortTidligereBehandlinger';
import { BrukersMeldekortVisning } from './brukers-meldekort/BrukersMeldekort';
import { useMeldeperiodeKjede } from '../MeldeperiodeKjedeContext';
import { classNames } from '../../../utils/classNames';
import { MeldekortBehandlingStatus } from '../../../types/meldekort/MeldekortBehandling';

import style from './MeldekortHøyreSeksjon.module.css';

export const MeldekortHøyreSeksjon = () => {
    const {
        alleMeldekortBehandlinger,
        tidligereMeldekortBehandlinger,
        sisteMeldekortBehandling,
        meldeperiodeKjede,
        sisteMeldeperiode,
    } = useMeldeperiodeKjede();

    const { brukersMeldekort, korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    const tidligereBehandlinger =
        korrigeringFraTidligerePeriode &&
        sisteMeldekortBehandling?.status === MeldekortBehandlingStatus.GODKJENT
            ? alleMeldekortBehandlinger
            : tidligereMeldekortBehandlinger;

    const antallTidligereBehandlinger = tidligereBehandlinger.length;
    const antallBrukersMeldekort = brukersMeldekort ? 1 : 0;

    if (antallTidligereBehandlinger === 0 && antallBrukersMeldekort === 0) {
        return null;
    }

    const defaultTab =
        antallBrukersMeldekort > 0 && antallTidligereBehandlinger === 0
            ? 'brukersMeldekort'
            : 'tidligereBehandlinger';

    return (
        <Tabs defaultValue={defaultTab} fill={true} className={style.wrapper}>
            <Tabs.List>
                <Tabs.Tab
                    value={'tidligereBehandlinger'}
                    label={`Tidligere behandlinger (${antallTidligereBehandlinger})`}
                    className={classNames(antallTidligereBehandlinger === 0 && style.tabDisabled)}
                />
                <Tabs.Tab
                    value={'brukersMeldekort'}
                    label={`Innmeldinger fra bruker (${antallBrukersMeldekort})`}
                    className={classNames(antallBrukersMeldekort === 0 && style.tabDisabled)}
                />
            </Tabs.List>

            <Tabs.Panel value={'tidligereBehandlinger'} lazy={false} className={style.panel}>
                <MeldekortTidligereBehandlinger />
            </Tabs.Panel>

            <Tabs.Panel value={'brukersMeldekort'} lazy={false} className={style.panel}>
                {brukersMeldekort && (
                    <BrukersMeldekortVisning
                        meldeperiode={sisteMeldeperiode}
                        brukersMeldekort={brukersMeldekort}
                    />
                )}
            </Tabs.Panel>
        </Tabs>
    );
};
