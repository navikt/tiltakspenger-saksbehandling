import { BodyShort, HStack, Tabs, VStack } from '@navikt/ds-react';
import { useMeldeperiodeKjedeV2 } from '~/lib/meldekort/v2/meldeperiodekjede/context/MeldeperiodeKjedeContextV2';
import { MeldeperiodekjedeGjeldendeBeregning } from '~/lib/meldekort/v2/meldeperiodekjede/høyre-seksjon/gjeldende-beregning/MeldeperiodekjedeGjeldendeBeregning';
import { CurrencyExchangeIcon, DocPencilIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { MeldekortBehandlingOppsummeringForKjede } from '~/lib/meldekort/v2/meldeperiodekjede/høyre-seksjon/meldekortbehandling-oppsummering/MeldekortBehandlingOppsummeringForKjede';
import { classNames } from '~/utils/classNames';
import { useSak } from '~/lib/sak/SakContext';
import { InfokortEnkel } from '~/lib/_felles/infokort/InfokortEnkel';
import { BrukersMeldekortUker } from '~/lib/meldekort/v2/brukers-meldekort/BrukersMeldekortUker';
import { formaterTidspunkt } from '~/utils/date';
import { BrukersMeldekortAutomatiskBehandlingStatus } from '~/lib/meldekort/3-høyre-seksjon/brukers-meldekort/automatisk-behandling-status/BrukersMeldekortAutomatiskBehandlingStatus';

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
            {harÅpenBehandling && (
                <InfokortEnkel icon={<DocPencilIcon />}>
                    {'Saken har en åpen meldekortbehandling som omfatter denne meldeperioden'}
                </InfokortEnkel>
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
                    <MeldeperiodekjedeGjeldendeBeregning beregning={gjeldendeBeregning} />
                </Tabs.Panel>

                <Tabs.Panel
                    value={TabVerdi.Behandlinger}
                    className={classNames(style.tabPanel, style.meldekortbehandlinger)}
                >
                    {meldekortbehandlingIder.toReversed().map((mkbId) => (
                        <MeldekortBehandlingOppsummeringForKjede
                            meldekortbehandlingId={mkbId}
                            kjedeId={id}
                            key={mkbId}
                        />
                    ))}
                </Tabs.Panel>

                <Tabs.Panel value={TabVerdi.BrukersMeldekort} className={style.tabPanel}>
                    {brukersMeldekort
                        .toSorted((a, b) => b.mottatt.localeCompare(a.mottatt))
                        .map((brukersMeldekort) => (
                            <VStack gap={'space-8'} key={brukersMeldekort.id}>
                                <HStack gap={'space-4'} align={'center'} justify={'space-between'}>
                                    <BodyShort size={'small'}>
                                        {'Mottatt: '}
                                        <strong>
                                            {formaterTidspunkt(brukersMeldekort.mottatt)}
                                        </strong>
                                    </BodyShort>
                                    <BrukersMeldekortAutomatiskBehandlingStatus
                                        meldekort={brukersMeldekort}
                                    />
                                </HStack>

                                <BrukersMeldekortUker
                                    key={brukersMeldekort.id}
                                    brukersMeldekort={brukersMeldekort}
                                    kompakt={true}
                                />
                            </VStack>
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
