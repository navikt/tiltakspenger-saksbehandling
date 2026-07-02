import { BodyShort, Heading, Tabs, VStack } from '@navikt/ds-react';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldeperiodeUrl } from '~/utils/urls';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodebehandlingProps, MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { meldeperiodebehandlingTypeTekst } from '~/lib/meldekort/v2/tekster';
import { MeldeperiodebehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import { meldeperiodebehandlingTypeIkoner } from '~/lib/meldekort/v2/ikoner';
import { MeldeperiodeBrukersMeldekort } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/meldeperiode-info/brukers-meldekort/MeldeperiodeBrukersMeldekort';
import { MeldekortbehandlingerForKjede } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/meldeperiode-info/behandlinger/MeldekortbehandlingerForKjede';

import style from './MeldeperiodeInfo.module.css';
import { formaterMeldeperiode } from '~/utils/date';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
    meldeperiodebehandling?: MeldeperiodebehandlingProps;
};

export const MeldeperiodeInfo = ({ meldeperiodeKjede, meldeperiodebehandling }: Props) => {
    const { saksnummer } = useSak().sak;
    const { tiltaksnavn, sisteMeldeperiode, periode, meldekortbehandlingIder, brukersMeldekort } =
        meldeperiodeKjede;

    const type: MeldeperiodebehandlingType =
        meldeperiodebehandling?.type ??
        (meldekortbehandlingIder.length === 0
            ? MeldeperiodebehandlingType.FØRSTE_BEHANDLING
            : MeldeperiodebehandlingType.KORRIGERING);

    return (
        <>
            <VStack gap={'space-16'} className={style.seksjon}>
                <Heading size={'small'} level={'3'} className={style.heading}>
                    {meldeperiodebehandlingTypeIkoner[type]}
                    {meldeperiodebehandlingTypeTekst[type]}
                </Heading>

                <DetaljHorisontal navn={'Periode'}>
                    {formaterMeldeperiode(periode)}
                </DetaljHorisontal>

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
            </VStack>

            <Tabs
                defaultValue={TabVerdi.BrukersMeldekort}
                fill={true}
                size={'medium'}
                className={style.seksjon}
            >
                <Tabs.List>
                    <Tabs.Tab
                        value={TabVerdi.BrukersMeldekort}
                        label={`Meldekort (${brukersMeldekort.length})`}
                    />
                    <Tabs.Tab
                        value={TabVerdi.Meldekortbehandlinger}
                        label={`Behandlinger (${meldekortbehandlingIder.length})`}
                    />
                </Tabs.List>

                <Tabs.Panel value={TabVerdi.BrukersMeldekort} className={style.tabsPanel}>
                    <MeldeperiodeBrukersMeldekort meldeperiodeKjede={meldeperiodeKjede} />
                </Tabs.Panel>

                <Tabs.Panel value={TabVerdi.Meldekortbehandlinger} className={style.tabsPanel}>
                    <MeldekortbehandlingerForKjede meldeperiodeKjede={meldeperiodeKjede} />
                </Tabs.Panel>
            </Tabs>
        </>
    );
};

enum TabVerdi {
    BrukersMeldekort = 'BrukersMeldekort',
    Meldekortbehandlinger = 'Meldekortbehandlinger',
}
