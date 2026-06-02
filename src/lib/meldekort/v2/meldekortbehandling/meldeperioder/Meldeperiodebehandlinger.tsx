import { Heading, Tabs, VStack } from '@navikt/ds-react';
import { useMeldekortbehandlingSkjema } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Meldeperiodebehandling } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/Meldeperiodebehandling';
import { MeldeperiodebehandlingLeggTil } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/legg-til/MeldeperiodebehandlingLeggTil';
import { useSak } from '~/lib/sak/SakContext';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { useState } from 'react';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';

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
            <Heading size={'small'} level={'3'}>
                {'Behandlede meldeperioder'}
            </Heading>

            {!erReadonly && <MeldeperiodebehandlingLeggTil onLeggTil={setValgtKjede} />}

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
                                    return (
                                        <Tabs.Tab
                                            key={meldeperiode.kjedeId}
                                            value={meldeperiode.kjedeId}
                                            label={periodeTilFormatertDatotekst(periode)}
                                        />
                                    );
                                })}
                            </Tabs.List>
                        </MeldekortbehandlingSeksjon.FullBredde>
                    </MeldekortbehandlingSeksjon>

                    {meldeperioder.map((meldeperiode, index) => (
                        <Tabs.Panel
                            key={meldeperiode.kjedeId}
                            value={meldeperiode.kjedeId}
                            className={style.meldeperiode}
                        >
                            <Meldeperiodebehandling
                                meldeperiodeSkjema={meldeperiode}
                                index={index}
                            />
                        </Tabs.Panel>
                    ))}
                </Tabs>
            )}
        </VStack>
    );
};
