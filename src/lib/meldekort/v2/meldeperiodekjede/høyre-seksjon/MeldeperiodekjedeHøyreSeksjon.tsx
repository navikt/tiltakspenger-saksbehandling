import { Heading, Tabs, VStack } from '@navikt/ds-react';
import { useMeldeperiodeKjedeV2 } from '~/lib/meldekort/v2/meldeperiodekjede/context/MeldeperiodeKjedeContextV2';
import { MeldeperiodekjedeGjeldendeBeregning } from '~/lib/meldekort/v2/meldeperiodekjede/høyre-seksjon/gjeldende-beregning/MeldeperiodekjedeGjeldendeBeregning';
import { CurrencyExchangeIcon, DocPencilIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { BrukersMeldekortVisning } from '~/lib/meldekort/3-høyre-seksjon/brukers-meldekort/BrukersMeldekort';
import { MeldekortBehandlingOppsummeringForKjede } from '~/lib/meldekort/v2/meldeperiodekjede/høyre-seksjon/meldekortbehandling-oppsummering/MeldekortBehandlingOppsummeringForKjede';
import { classNames } from '~/utils/classNames';
import { useSak } from '~/lib/sak/SakContext';
import { InfokortEnkel } from '~/lib/_felles/infokort/InfokortEnkel';

import style from './MeldeperiodekjedeHøyreSeksjon.module.css';

export const MeldeperiodekjedeHøyreSeksjon = () => {
    const { åpenMeldekortbehandlingId } = useSak().sak;

    const { meldeperiodeKjede } = useMeldeperiodeKjedeV2();
    const { id, gjeldendeBeregning, brukersMeldekort, meldekortbehandlingIder } = meldeperiodeKjede;

    const harÅpenBehandling = åpenMeldekortbehandlingId
        ? meldekortbehandlingIder.includes(åpenMeldekortbehandlingId)
        : false;

    return (
        <VStack gap={'space-24'} className={style.seksjon}>
            <Heading level={'2'} size={'medium'}>
                {'Oversikt over behandlinger, meldekort, etc'}
            </Heading>

            {harÅpenBehandling && (
                <InfokortEnkel icon={<DocPencilIcon />}>
                    {'Saken har en åpen meldekortbehandling som omfatter denne meldeperioden'}
                </InfokortEnkel>
            )}

            <Tabs defaultValue={harÅpenBehandling ? 'behandlinger' : 'beregning'} fill={false}>
                <Tabs.List>
                    <Tabs.Tab
                        value={'beregning'}
                        label={'Gjeldende beregning'}
                        icon={<CurrencyExchangeIcon />}
                    />
                    <Tabs.Tab
                        value={'behandlinger'}
                        label={`Meldekortbehandlinger (${meldekortbehandlingIder.length})`}
                        icon={<DocPencilIcon />}
                    />
                    <Tabs.Tab
                        value={'brukersMeldekort'}
                        label={`Meldekort fra bruker (${brukersMeldekort.length})`}
                        icon={<PersonPencilIcon />}
                    />
                </Tabs.List>

                <Tabs.Panel value={'beregning'} className={style.tabPanel}>
                    <MeldeperiodekjedeGjeldendeBeregning beregning={gjeldendeBeregning} />
                </Tabs.Panel>

                <Tabs.Panel
                    value={'behandlinger'}
                    className={classNames(style.tabPanel, style.meldekortbehandlinger)}
                >
                    {meldekortbehandlingIder.reverse().map((mkbId) => (
                        <MeldekortBehandlingOppsummeringForKjede
                            meldekortbehandlingId={mkbId}
                            kjedeId={id}
                            key={mkbId}
                        />
                    ))}
                </Tabs.Panel>

                <Tabs.Panel value={'brukersMeldekort'} className={style.tabPanel}>
                    {brukersMeldekort
                        .toSorted((a, b) => b.mottatt.localeCompare(a.mottatt))
                        .map((brukersMeldekort) => (
                            <BrukersMeldekortVisning
                                key={brukersMeldekort.id}
                                brukersMeldekort={brukersMeldekort}
                            />
                        ))}
                </Tabs.Panel>
            </Tabs>
        </VStack>
    );
};
