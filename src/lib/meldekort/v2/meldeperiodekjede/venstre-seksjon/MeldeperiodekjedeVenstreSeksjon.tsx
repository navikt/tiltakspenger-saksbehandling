import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import {
    formaterDatotekst,
    formaterTidspunkt,
    periodeTilFormatertDatotekst,
    ukenummerFraDatotekst,
} from '~/utils/date';
import React, { PropsWithChildren } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { Separator } from '~/lib/_felles/separator/Separator';
import { useMeldeperiodeKjedeV2 } from '~/lib/meldekort/v2/meldeperiodekjede/context/MeldeperiodeKjedeContextV2';

import style from './MeldeperiodekjedeVenstreSeksjon.module.css';

export const MeldeperiodekjedeVenstreSeksjon = () => {
    const { sak } = useSak();
    const { førsteDagSomGirRett, sisteDagSomGirRett, kanSendeInnHelgForMeldekort } = sak;

    const { meldeperiodeKjede, sisteMeldeperiode } = useMeldeperiodeKjedeV2();
    const { periode, brukersMeldekort, tiltaksnavn } = meldeperiodeKjede;

    const sisteBrukersMeldekort = brukersMeldekort.at(-1);

    return (
        <VStack gap={'space-16'} className={style.seksjon}>
            <div>
                <Heading level={'2'} size={'medium'}>
                    {'Meldeperiode'}
                </Heading>
                {`${periodeTilFormatertDatotekst(periode)} (uke ${ukenummerFraDatotekst(periode.fraOgMed)} og ${ukenummerFraDatotekst(periode.tilOgMed)})`}
            </div>

            <MeldekortDetalj header={'Tiltak'}>
                {tiltaksnavn.length > 0
                    ? tiltaksnavn.map((it) => <BodyShort key={it}>{it}</BodyShort>)
                    : 'Ukjent'}
            </MeldekortDetalj>

            <MeldekortDetalj header={'Antall tiltaksdager'}>
                {sisteMeldeperiode.antallDager.toString()}
            </MeldekortDetalj>
            <MeldekortDetalj header={'Meldekort sist mottatt'}>
                {sisteBrukersMeldekort
                    ? formaterTidspunkt(sisteBrukersMeldekort.mottatt)
                    : 'Ikke mottatt'}
            </MeldekortDetalj>

            <Separator />

            <MeldekortDetalj header={'Første dag med rett'}>
                {førsteDagSomGirRett ? formaterDatotekst(førsteDagSomGirRett) : 'Ukjent'}
            </MeldekortDetalj>
            <MeldekortDetalj header={'Siste dag med rett'}>
                {sisteDagSomGirRett ? formaterDatotekst(sisteDagSomGirRett) : 'Ukjent'}
            </MeldekortDetalj>
            <MeldekortDetalj header={'Bruker kan melde helg?'}>
                {kanSendeInnHelgForMeldekort ? 'Ja' : 'Nei'}
            </MeldekortDetalj>
        </VStack>
    );
};

type FaktaProps = PropsWithChildren<{
    header: string;
}>;

const MeldekortDetalj = ({ header, children }: FaktaProps) => {
    return (
        <div>
            <BodyShort weight={'semibold'}>{header}</BodyShort>
            {children}
        </div>
    );
};
