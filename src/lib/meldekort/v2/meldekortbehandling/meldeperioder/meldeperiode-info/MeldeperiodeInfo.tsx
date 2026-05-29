import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/typer/Meldeperiode';
import { BodyShort, VStack } from '@navikt/ds-react';
import { DetaljVertikal } from '~/lib/_felles/detaljer/DetaljVertikal';
import React from 'react';
import { formaterTidspunkt } from '~/utils/date';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldeperiodeUrl } from '~/utils/urls';
import { useSak } from '~/lib/sak/SakContext';
import { classNames } from '~/utils/classNames';

import style from './MeldeperiodeInfo.module.css';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
    className?: string;
};

export const MeldeperiodeInfo = ({ meldeperiodeKjede, className }: Props) => {
    const { saksnummer } = useSak().sak;

    const { brukersMeldekort, tiltaksnavn, meldeperioder, periode } = meldeperiodeKjede;

    const sisteMeldeperiode = meldeperioder.at(-1)!;
    const sisteBrukersMeldekort = brukersMeldekort.at(-1);

    return (
        <VStack gap={'space-16'} className={classNames(style.outer, className)}>
            <InternLenke href={meldeperiodeUrl(saksnummer, periode)}>
                {'Til meldeperioden'}
            </InternLenke>

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
        </VStack>
    );
};
