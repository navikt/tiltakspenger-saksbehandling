import { Heading, HStack, Tabs, VStack } from '@navikt/ds-react';
import { useMeldekortbehandlingSkjema } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Meldeperiodebehandling } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/Meldeperiodebehandling';
import { MeldeperiodebehandlingLeggTil } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/legg-til/MeldeperiodebehandlingLeggTil';
import { MeldeperiodebehandlingFjern } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/fjern/MeldeperiodebehandlingFjern';
import { useSak } from '~/lib/sak/SakContext';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { formaterPeriodeKort, ukenummerFraPeriode } from '~/utils/date';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { useState } from 'react';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { Periode } from '~/types/Periode';
import { validerMeldeperiodeSkjema } from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import style from './Meldeperiodebehandlinger.module.css';

export const Meldeperiodebehandlinger = () => {
    const { meldeperioder, erReadonly } = useMeldekortbehandlingSkjema();

    const [valgtKjede, setValgtKjede] = useState<MeldeperiodeKjedeId | undefined>(
        meldeperioder.at(0)?.kjedeId,
    );

    const { sak } = useSak();

    const harKjede = valgtKjede && meldeperioder.some((mp) => mp.kjedeId === valgtKjede);

    if (!harKjede) {
        setValgtKjede(meldeperioder.at(0)?.kjedeId);
    }

    return (
        <VStack gap={'space-16'}>
            <MeldekortbehandlingSeksjon>
                <MeldekortbehandlingSeksjon.FullBredde>
                    <HStack gap={'space-16'} align={'center'}>
                        <Heading size={'medium'} level={'2'}>
                            {'Behandlede meldeperioder'}
                        </Heading>

                        {!erReadonly && <MeldeperiodebehandlingLeggTil onLeggTil={setValgtKjede} />}

                        {!erReadonly && meldeperioder.length > 1 && valgtKjede && (
                            <MeldeperiodebehandlingFjern kjedeId={valgtKjede} />
                        )}
                    </HStack>
                </MeldekortbehandlingSeksjon.FullBredde>
            </MeldekortbehandlingSeksjon>

            {meldeperioder.length > 0 && (
                <Tabs
                    value={valgtKjede}
                    onChange={(nyValgtKjede) => {
                        setValgtKjede(nyValgtKjede as MeldeperiodeKjedeId);
                    }}
                >
                    <MeldekortbehandlingSeksjon>
                        <MeldekortbehandlingSeksjon.FullBredde>
                            <Tabs.List>
                                {meldeperioder.map((meldeperiode) => {
                                    const { periode } = hentMeldeperiodekjede(
                                        sak,
                                        meldeperiode.kjedeId,
                                    );

                                    const harValideringsfeil = !!validerMeldeperiodeSkjema(
                                        meldeperiode,
                                        sak,
                                    );

                                    return (
                                        <Tabs.Tab
                                            key={meldeperiode.kjedeId}
                                            value={meldeperiode.kjedeId}
                                            label={<TabLabel periode={periode} />}
                                            icon={
                                                harValideringsfeil && (
                                                    <ExclamationmarkTriangleFillIcon
                                                        className={style.feilIcon}
                                                    />
                                                )
                                            }
                                        />
                                    );
                                })}
                            </Tabs.List>
                        </MeldekortbehandlingSeksjon.FullBredde>
                    </MeldekortbehandlingSeksjon>

                    {meldeperioder.map((meldeperiode) => (
                        <Tabs.Panel
                            key={meldeperiode.kjedeId}
                            value={meldeperiode.kjedeId}
                            className={style.meldeperiode}
                        >
                            <Meldeperiodebehandling meldeperiodeSkjema={meldeperiode} />
                        </Tabs.Panel>
                    ))}
                </Tabs>
            )}
        </VStack>
    );
};

const TabLabel = ({ periode }: { periode: Periode }) => (
    <HStack gap={'space-4'}>
        <span className={style.nobreak}>{`${formaterPeriodeKort(periode)}`}</span>
        <span className={style.nobreak}>{`(uke ${ukenummerFraPeriode(periode)})`}</span>
    </HStack>
);
