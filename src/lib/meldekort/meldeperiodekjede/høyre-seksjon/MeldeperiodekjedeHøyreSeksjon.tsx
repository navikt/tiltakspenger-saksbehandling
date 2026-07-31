import { Tabs, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMeldeperiodekjede } from '~/lib/meldekort/meldeperiodekjede/context/MeldeperiodekjedeContext';
import { MeldeperiodekjedeGjeldendeBeregning } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/gjeldende-beregning/MeldeperiodekjedeGjeldendeBeregning';
import { CurrencyExchangeIcon, DocPencilIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { MeldekortbehandlingOppsummering } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/behandling-oppsummering/MeldekortbehandlingOppsummering';
import { BrukersMeldekortForKjede } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/brukers-meldekort/BrukersMeldekortForKjede';

import style from './MeldeperiodekjedeHøyreSeksjon.module.css';

export const MeldeperiodekjedeHøyreSeksjon = () => {
    const router = useRouter();

    const { meldeperiodeKjede } = useMeldeperiodekjede();
    const { id, gjeldendeBeregning, brukersMeldekort, meldekortbehandlingIder } = meldeperiodeKjede;

    const harBehandlinger = meldekortbehandlingIder.length > 0;

    const [aktivTab, setAktivTab] = useState<MeldeperiodekjedeTab>(
        harBehandlinger ? MeldeperiodekjedeTab.Behandlinger : MeldeperiodekjedeTab.Beregning,
    );

    useEffect(() => {
        const tabFraHash = hentTabFraHash(window.location.hash);
        if (tabFraHash) {
            /* eslint-disable-next-line react-hooks/set-state-in-effect */
            setAktivTab(tabFraHash);
        }
    }, []);

    return (
        <VStack gap={'space-24'} className={style.seksjon}>
            <Tabs
                value={aktivTab}
                onChange={(value) => {
                    setAktivTab(value as MeldeperiodekjedeTab);
                    router.replace(`${router.asPath.split('#').at(0)}#${value}`, undefined, {
                        shallow: true,
                    });
                }}
                fill={false}
            >
                <Tabs.List>
                    <Tabs.Tab
                        value={MeldeperiodekjedeTab.Beregning}
                        label={'Gjeldende beregning'}
                        icon={<CurrencyExchangeIcon />}
                    />
                    <Tabs.Tab
                        value={MeldeperiodekjedeTab.Behandlinger}
                        label={`Meldekortbehandlinger (${meldekortbehandlingIder.length})`}
                        icon={<DocPencilIcon />}
                    />
                    <Tabs.Tab
                        value={MeldeperiodekjedeTab.BrukersMeldekort}
                        label={`Meldekort fra bruker (${brukersMeldekort.length})`}
                        icon={<PersonPencilIcon />}
                    />
                </Tabs.List>

                <Tabs.Panel value={MeldeperiodekjedeTab.Beregning} className={style.tabPanel}>
                    <MeldeperiodekjedeGjeldendeBeregning
                        beregning={gjeldendeBeregning}
                        className={style.panelElement}
                    />
                </Tabs.Panel>

                <Tabs.Panel value={MeldeperiodekjedeTab.Behandlinger} className={style.tabPanel}>
                    {meldekortbehandlingIder.toReversed().map((mkbId) => (
                        <MeldekortbehandlingOppsummering
                            meldekortbehandlingId={mkbId}
                            kjedeId={id}
                            className={style.panelElement}
                            key={mkbId}
                        />
                    ))}
                </Tabs.Panel>

                <Tabs.Panel
                    value={MeldeperiodekjedeTab.BrukersMeldekort}
                    className={style.tabPanel}
                >
                    {brukersMeldekort
                        .toSorted((a, b) => b.mottatt.localeCompare(a.mottatt))
                        .map((meldekort) => (
                            <BrukersMeldekortForKjede
                                meldekort={meldekort}
                                className={style.panelElement}
                                key={meldekort.id}
                            />
                        ))}
                </Tabs.Panel>
            </Tabs>
        </VStack>
    );
};

export enum MeldeperiodekjedeTab {
    Beregning = 'Beregning',
    Behandlinger = 'Behandlinger',
    BrukersMeldekort = 'BrukersMeldekort',
}

const hentTabFraHash = (hash: string): MeldeperiodekjedeTab | null => {
    const tab = hash.replace(/^#/, '');
    return Object.values(MeldeperiodekjedeTab).includes(tab as MeldeperiodekjedeTab)
        ? (tab as MeldeperiodekjedeTab)
        : null;
};
