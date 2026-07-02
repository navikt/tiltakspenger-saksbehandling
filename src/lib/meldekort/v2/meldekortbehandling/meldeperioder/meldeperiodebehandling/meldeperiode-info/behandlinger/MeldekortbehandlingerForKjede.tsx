import { Heading, HStack, InlineMessage, Select, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { formaterTidspunktKort } from '~/utils/date';
import { MeldekortbehandlingOppsummeringKompakt } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/meldeperiode-info/behandlinger/MeldekortbehandlingOppsummeringKompakt';
import { hentMeldekortbehandling } from '~/lib/sak/sakUtils';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

export const MeldekortbehandlingerForKjede = ({ meldeperiodeKjede }: Props) => {
    const { id: kjedeId, meldekortbehandlingIder } = meldeperiodeKjede;

    const { sak } = useSak();
    const { id: meldekortbehandlingIdFraContext } = useMeldekortbehandling();

    const sisteBehandlingId = meldekortbehandlingIder.at(-1);

    const [valgtBehandlingId, setValgtBehandlingId] = useState<MeldekortbehandlingId | undefined>(
        sisteBehandlingId,
    );

    if (!valgtBehandlingId) {
        return (
            <InlineMessage status={'info'} size={'small'}>
                {'Ingen meldekortbehandlinger for denne perioden'}
            </InlineMessage>
        );
    }

    const godkjenteBehandlinger = meldekortbehandlingIder
        .map((id) => hentMeldekortbehandling(sak, id))
        .filter(
            (beh) =>
                (beh.id !== meldekortbehandlingIdFraContext &&
                    beh.status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET) ||
                beh.status === MeldekortbehandlingStatus.GODKJENT,
        )
        .toReversed();

    return (
        <VStack gap={'space-24'}>
            <HStack justify={'space-between'} align={'center'}>
                <Heading size={'xsmall'} level={'4'} spacing={true}>
                    {'Andre meldekortbehandlinger'}
                </Heading>

                <Select
                    label={'Velg meldekortbehandling'}
                    hideLabel={true}
                    size={'small'}
                    value={valgtBehandlingId}
                    onChange={(e) => setValgtBehandlingId(e.target.value as MeldekortbehandlingId)}
                >
                    {godkjenteBehandlinger.map((behandling, index) => {
                        const { id, godkjentTidspunkt } = behandling;

                        return (
                            <option key={id} value={id}>
                                {`Godkjent ${formaterTidspunktKort(godkjentTidspunkt!)}${
                                    index === 0 ? ' (gjeldende)' : ''
                                }`}
                            </option>
                        );
                    })}
                </Select>
            </HStack>

            <MeldekortbehandlingOppsummeringKompakt
                meldekortbehandlingId={valgtBehandlingId}
                kjedeId={kjedeId}
            />
        </VStack>
    );
};
