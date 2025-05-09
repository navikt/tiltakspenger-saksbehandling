import { Tabs } from '@navikt/ds-react';
import { MeldekortTidligereBehandlinger } from './tidligere-behandlinger/MeldekortTidligereBehandlinger';
import { BrukersMeldekortVisning } from './brukers-meldekort/BrukersMeldekort';
import { useMeldeperiodeKjede } from '../MeldeperiodeKjedeContext';
import { classNames } from '../../../utils/classNames';
import { CircleSlashIcon, DocPencilIcon, PersonPencilIcon } from '@navikt/aksel-icons';

import style from './MeldekortHøyreSeksjon.module.css';
import { MeldekortAvsluttedeBehandlinger } from './avsluttede-meldekort/MeldekortAvsluttedeBehandlinger';

export const MeldekortHøyreSeksjon = () => {
    const {
        alleMeldekortBehandlinger,
        tidligereMeldekortBehandlinger,
        meldeperiodeKjede,
        sisteMeldeperiode,
        avbrutteMeldekortBehandlinger,
    } = useMeldeperiodeKjede();

    const { brukersMeldekort, korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    const antallTidligereBehandlinger = korrigeringFraTidligerePeriode
        ? alleMeldekortBehandlinger.length
        : tidligereMeldekortBehandlinger.length;

    const antallBrukersMeldekort = brukersMeldekort ? 1 : 0;

    const antallAvbrutteMeldekortBehandlinger = avbrutteMeldekortBehandlinger.length;

    const defaultTab =
        antallBrukersMeldekort > 0 && antallTidligereBehandlinger === 0
            ? 'brukersMeldekort'
            : 'tidligereBehandlinger';

    return (
        <Tabs defaultValue={defaultTab} fill={true} className={style.wrapper}>
            <Tabs.List className={style.tabs}>
                <Tabs.Tab
                    value={'tidligereBehandlinger'}
                    label={`Tidligere behandlinger (${antallTidligereBehandlinger})`}
                    icon={<DocPencilIcon />}
                    className={classNames(antallTidligereBehandlinger === 0 && style.tabDisabled)}
                />
                <Tabs.Tab
                    value={'brukersMeldekort'}
                    label={`Innmeldinger fra bruker (${antallBrukersMeldekort})`}
                    icon={<PersonPencilIcon />}
                    className={classNames(antallBrukersMeldekort === 0 && style.tabDisabled)}
                />
                <Tabs.Tab
                    value={'avsluttedeMeldekort'}
                    label={'Avsluttede behandlinger'}
                    icon={<CircleSlashIcon />}
                    className={classNames(
                        antallAvbrutteMeldekortBehandlinger === 0 && style.tabDisabled,
                    )}
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

            <Tabs.Panel value={'avsluttedeMeldekort'} lazy={false} className={style.panel}>
                {antallAvbrutteMeldekortBehandlinger > 0 && <MeldekortAvsluttedeBehandlinger />}
            </Tabs.Panel>
        </Tabs>
    );
};
