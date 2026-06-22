import { Tabs, VStack } from '@navikt/ds-react';
import { useMeldeperiodeKjedeV2 } from '~/lib/meldekort/v2/meldeperiodekjede/context/MeldeperiodeKjedeContextV2';
import { MeldeperiodekjedeGjeldendeBeregning } from '~/lib/meldekort/v2/meldeperiodekjede/høyre-seksjon/gjeldende-beregning/MeldeperiodekjedeGjeldendeBeregning';
import { CurrencyExchangeIcon, DocPencilIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { MeldekortBehandlingOppsummeringForKjede } from '~/lib/meldekort/v2/meldeperiodekjede/høyre-seksjon/meldekortbehandling-oppsummering/MeldekortBehandlingOppsummeringForKjede';
import { useSak } from '~/lib/sak/SakContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { BrukersMeldekortForKjede } from '~/lib/meldekort/v2/meldeperiodekjede/høyre-seksjon/brukers-meldekort/BrukersMeldekortForKjede';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldekortbehandlingUrl } from '~/utils/urls';

import style from './MeldeperiodekjedeHøyreSeksjon.module.css';

export const MeldeperiodekjedeHøyreSeksjon = () => {
    const { åpenMeldekortbehandlingId, saksnummer } = useSak().sak;

    const { meldeperiodeKjede } = useMeldeperiodeKjedeV2();
    const { id, gjeldendeBeregning, brukersMeldekort, meldekortbehandlingIder } = meldeperiodeKjede;

    const harÅpenBehandling = åpenMeldekortbehandlingId
        ? meldekortbehandlingIder.includes(åpenMeldekortbehandlingId)
        : false;

    return (
        <VStack gap={'space-24'} className={style.seksjon}>
            {harÅpenBehandling && (
                <Infokort icon={<DocPencilIcon />}>
                    {'Saken har en åpen meldekortbehandling som omfatter denne meldeperioden. '}
                    <InternLenke
                        href={meldekortbehandlingUrl(saksnummer, åpenMeldekortbehandlingId!)}
                    >
                        {'Til behandlingen'}
                    </InternLenke>
                </Infokort>
            )}

            <Tabs
                defaultValue={harÅpenBehandling ? TabVerdi.Behandlinger : TabVerdi.Beregning}
                fill={false}
            >
                <Tabs.List>
                    <Tabs.Tab
                        value={TabVerdi.Beregning}
                        label={'Gjeldende beregning'}
                        icon={<CurrencyExchangeIcon />}
                    />
                    <Tabs.Tab
                        value={TabVerdi.Behandlinger}
                        label={`Meldekortbehandlinger (${meldekortbehandlingIder.length})`}
                        icon={<DocPencilIcon />}
                    />
                    <Tabs.Tab
                        value={TabVerdi.BrukersMeldekort}
                        label={`Meldekort fra bruker (${brukersMeldekort.length})`}
                        icon={<PersonPencilIcon />}
                    />
                </Tabs.List>

                <Tabs.Panel value={TabVerdi.Beregning} className={style.tabPanel}>
                    <MeldeperiodekjedeGjeldendeBeregning
                        beregning={gjeldendeBeregning}
                        className={style.panelElement}
                    />
                </Tabs.Panel>

                <Tabs.Panel value={TabVerdi.Behandlinger} className={style.tabPanel}>
                    {meldekortbehandlingIder.toReversed().map((mkbId) => (
                        <MeldekortBehandlingOppsummeringForKjede
                            meldekortbehandlingId={mkbId}
                            kjedeId={id}
                            className={style.panelElement}
                            key={mkbId}
                        />
                    ))}
                </Tabs.Panel>

                <Tabs.Panel value={TabVerdi.BrukersMeldekort} className={style.tabPanel}>
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

enum TabVerdi {
    Beregning = 'Beregning',
    Behandlinger = 'Behandlinger',
    BrukersMeldekort = 'BrukersMeldekort',
}
