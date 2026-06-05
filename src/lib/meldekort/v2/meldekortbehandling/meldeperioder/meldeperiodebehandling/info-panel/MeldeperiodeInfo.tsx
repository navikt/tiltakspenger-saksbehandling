import { BodyShort } from '@navikt/ds-react';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldeperiodeUrl } from '~/utils/urls';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

export const MeldeperiodeInfo = ({ meldeperiodeKjede }: Props) => {
    const { saksnummer } = useSak().sak;
    const { tiltaksnavn, sisteMeldeperiode, periode } = meldeperiodeKjede;

    return (
        <>
            <DetaljHorisontal navn={'Tiltak:'}>
                {tiltaksnavn.length > 0
                    ? tiltaksnavn.map((it) => <BodyShort key={it}>{it}</BodyShort>)
                    : 'Ukjent'}
            </DetaljHorisontal>

            <DetaljHorisontal navn={'Antall tiltaksdager:'}>
                {sisteMeldeperiode.antallDager.toString()}
            </DetaljHorisontal>

            <InternLenke href={meldeperiodeUrl(saksnummer, periode)}>
                {'Til oversikt for meldeperioden'}
            </InternLenke>
        </>
    );
};
