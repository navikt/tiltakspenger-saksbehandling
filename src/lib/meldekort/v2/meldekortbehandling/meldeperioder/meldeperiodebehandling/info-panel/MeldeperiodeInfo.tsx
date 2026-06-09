import { BodyShort, Heading } from '@navikt/ds-react';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldeperiodeUrl } from '~/utils/urls';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodebehandlingProps, MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { meldeperiodebehandlingTypeTekst } from '~/lib/meldekort/v2/tekster';
import { MeldeperiodebehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import { meldeperiodebehandlingTypeIkoner } from '~/lib/meldekort/v2/ikoner';

import style from './MeldeperiodeInfo.module.css';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
    meldeperiodebehandling?: MeldeperiodebehandlingProps;
};

export const MeldeperiodeInfo = ({ meldeperiodeKjede, meldeperiodebehandling }: Props) => {
    const { saksnummer } = useSak().sak;
    const { tiltaksnavn, sisteMeldeperiode, periode, meldekortbehandlingIder } = meldeperiodeKjede;

    const type: MeldeperiodebehandlingType =
        meldeperiodebehandling?.type ??
        (meldekortbehandlingIder.length === 0
            ? MeldeperiodebehandlingType.FØRSTE_BEHANDLING
            : MeldeperiodebehandlingType.KORRIGERING);

    return (
        <>
            <Heading size={'small'} level={'3'} className={style.heading}>
                {meldeperiodebehandlingTypeIkoner[type]}
                {meldeperiodebehandlingTypeTekst[type]}
            </Heading>

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
