import { BodyShort, Button, HelpText, HStack, Tabs, VStack } from '@navikt/ds-react';
import { DetaljVertikal } from '~/lib/_felles/detaljer/DetaljVertikal';
import React from 'react';
import { formaterTidspunkt, formaterMeldeperiode } from '~/utils/date';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldeperiodeUrl } from '~/utils/urls';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import { ChevronRightDoubleIcon, DocPencilIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { BrukersMeldekortUker } from '~/lib/meldekort/v2/brukers-meldekort/BrukersMeldekortUker';
import { classNames } from '~/utils/classNames';
import { hentMeldekortForhåndsutfyllingFraBrukersMeldekort } from '~/lib/meldekort/0-felles-komponenter/meldekortForhåndsutfyllingUtils';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { BrukersMeldekortAutomatiskBehandlingStatus } from '~/lib/meldekort/3-høyre-seksjon/brukers-meldekort/automatisk-behandling-status/BrukersMeldekortAutomatiskBehandlingStatus';

import style from './MeldeperiodeInfo.module.css';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

export const MeldeperiodeInfo = ({ meldeperiodeKjede }: Props) => {
    const { saksnummer } = useSak().sak;
    const { brukersMeldekort, tiltaksnavn, sisteMeldeperiode, periode, id } = meldeperiodeKjede;

    const sisteBrukersMeldekort = brukersMeldekort.at(-1);

    const { erReadonly } = useMeldekortbehandlingSkjema();
    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    return (
        <Tabs defaultValue={TabVerdi.Info}>
            <Tabs.List>
                <Tabs.Tab value={TabVerdi.Info} label={'Info'} icon={<DocPencilIcon />} />
                <Tabs.Tab
                    value={TabVerdi.BrukersMeldekort}
                    label={`Meldekort (${brukersMeldekort.length})`}
                    icon={<PersonPencilIcon />}
                />
            </Tabs.List>

            <Tabs.Panel value={TabVerdi.Info} className={classNames(style.tabPanel, style.info)}>
                <VStack gap={'space-16'}>
                    <DetaljVertikal navn={'Periode'}>
                        {formaterMeldeperiode(periode)}
                    </DetaljVertikal>

                    <DetaljVertikal navn={'Tiltak'}>
                        {tiltaksnavn.length > 0
                            ? tiltaksnavn.map((it) => <BodyShort key={it}>{it}</BodyShort>)
                            : 'Ukjent'}
                    </DetaljVertikal>

                    <DetaljVertikal navn={'Antall tiltaksdager'}>
                        {sisteMeldeperiode.antallDager.toString()}
                    </DetaljVertikal>

                    <DetaljVertikal navn={'Meldekort sist mottatt'}>
                        {sisteBrukersMeldekort
                            ? formaterTidspunkt(sisteBrukersMeldekort.mottatt)
                            : 'Ikke mottatt'}
                    </DetaljVertikal>

                    <InternLenke href={meldeperiodeUrl(saksnummer, periode)}>
                        {'Til meldeperioden'}
                    </InternLenke>
                </VStack>
            </Tabs.Panel>

            <Tabs.Panel value={TabVerdi.BrukersMeldekort} className={style.tabPanel}>
                {sisteBrukersMeldekort ? (
                    <VStack gap={'space-8'}>
                        <HStack justify={'space-between'} align={'center'}>
                            <HelpText>
                                <BodyShort size={'small'}>
                                    {'Mottatt: '}
                                    <strong>
                                        {formaterTidspunkt(sisteBrukersMeldekort.mottatt)}
                                    </strong>
                                </BodyShort>
                                <BrukersMeldekortAutomatiskBehandlingStatus
                                    meldekort={sisteBrukersMeldekort}
                                />
                            </HelpText>
                            {!erReadonly && (
                                <Button
                                    variant={'tertiary'}
                                    size={'xsmall'}
                                    icon={<ChevronRightDoubleIcon />}
                                    iconPosition={'right'}
                                    onClick={() => {
                                        const dager =
                                            hentMeldekortForhåndsutfyllingFraBrukersMeldekort(
                                                sisteBrukersMeldekort,
                                                sisteMeldeperiode,
                                            );

                                        dispatch({
                                            type: 'setDager',
                                            payload: {
                                                dager,
                                                kjedeId: id,
                                            },
                                        });
                                    }}
                                >
                                    {'Fyll inn disse dagene'}
                                </Button>
                            )}
                        </HStack>

                        <BrukersMeldekortUker
                            brukersMeldekort={sisteBrukersMeldekort}
                            kompakt={true}
                        />
                    </VStack>
                ) : (
                    <BodyShort>{'Ikke mottatt'}</BodyShort>
                )}
            </Tabs.Panel>
        </Tabs>
    );
};

enum TabVerdi {
    Info = 'Info',
    BrukersMeldekort = 'BrukersMeldekort',
}
