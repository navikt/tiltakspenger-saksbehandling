import { BodyShort, VStack } from '@navikt/ds-react';
import { DetaljVertikal } from '~/lib/_felles/detaljer/DetaljVertikal';
import { formaterMeldeperiode, formaterTidspunkt } from '~/utils/date';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldeperiodeUrl } from '~/utils/urls';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

export const MeldeperiodeInfoPanel = ({ meldeperiodeKjede }: Props) => {
    const { saksnummer } = useSak().sak;
    const { brukersMeldekort, tiltaksnavn, sisteMeldeperiode, periode } = meldeperiodeKjede;

    const sisteBrukersMeldekort = brukersMeldekort.at(-1);

    return (
        <VStack gap={'space-16'}>
            <DetaljVertikal navn={'Periode'}>{formaterMeldeperiode(periode)}</DetaljVertikal>

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
                {'Til fullstendig oversikt'}
            </InternLenke>
        </VStack>
    );
};
