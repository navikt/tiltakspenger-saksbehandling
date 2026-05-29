import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import {
    formaterDatotekst,
    formaterTidspunkt,
    periodeTilFormatertDatotekst,
    ukenummerFraDatotekst,
} from '~/utils/date';
import React from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { Separator } from '~/lib/_felles/separator/Separator';
import { useMeldeperiodeKjedeV2 } from '~/lib/meldekort/v2/meldeperiodekjede/context/MeldeperiodeKjedeContextV2';
import { MeldekortbehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingOpprettV2 } from '~/lib/meldekort/v2/meldeperiodekjede/venstre-seksjon/opprett-behandling/MeldekortbehandlingOpprettV2';
import { DetaljVertikal } from '~/lib/_felles/detaljer/DetaljVertikal';

import style from './MeldeperiodekjedeVenstreSeksjon.module.css';

export const MeldeperiodekjedeVenstreSeksjon = () => {
    const { sak } = useSak();
    const { førsteDagSomGirRett, sisteDagSomGirRett, kanSendeInnHelgForMeldekort } = sak;

    const { meldeperiodeKjede, sisteMeldeperiode } = useMeldeperiodeKjedeV2();
    const { periode, brukersMeldekort, tiltaksnavn, meldekortbehandlingIder } = meldeperiodeKjede;

    const sisteBrukersMeldekort = brukersMeldekort.at(-1);

    return (
        <VStack gap={'space-12'} className={style.seksjon}>
            <div>
                <Heading level={'2'} size={'medium'}>
                    {'Meldeperiode'}
                </Heading>
                {`${periodeTilFormatertDatotekst(periode)} (uke ${ukenummerFraDatotekst(periode.fraOgMed)} og ${ukenummerFraDatotekst(periode.tilOgMed)})`}
            </div>

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

            <Separator />

            <DetaljVertikal navn={'Første dag med rett'}>
                {førsteDagSomGirRett ? formaterDatotekst(førsteDagSomGirRett) : 'Ukjent'}
            </DetaljVertikal>
            <DetaljVertikal navn={'Siste dag med rett'}>
                {sisteDagSomGirRett ? formaterDatotekst(sisteDagSomGirRett) : 'Ukjent'}
            </DetaljVertikal>
            <DetaljVertikal navn={'Bruker kan melde helg?'}>
                {kanSendeInnHelgForMeldekort ? 'Ja' : 'Nei'}
            </DetaljVertikal>

            <Separator />

            <MeldekortbehandlingOpprettV2
                type={
                    meldekortbehandlingIder.length === 0
                        ? MeldekortbehandlingType.FØRSTE_BEHANDLING
                        : MeldekortbehandlingType.KORRIGERING
                }
            />
        </VStack>
    );
};
