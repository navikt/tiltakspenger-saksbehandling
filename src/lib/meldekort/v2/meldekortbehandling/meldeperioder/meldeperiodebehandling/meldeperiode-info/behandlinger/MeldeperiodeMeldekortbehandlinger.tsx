import { Heading, HStack, InlineMessage, Select, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { formaterTidspunkt } from '~/utils/date';
import { MeldekortbehandlingOppsummering } from '~/lib/meldekort/v2/felles/behandling-oppsummering/MeldekortbehandlingOppsummering';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

export const MeldeperiodeMeldekortbehandlinger = ({ meldeperiodeKjede }: Props) => {
    const { id: kjedeId, meldekortbehandlingIder } = meldeperiodeKjede;

    const { sak } = useSak();

    const sisteBehandlingId = meldekortbehandlingIder.at(-1);

    const [valgtBehandlingId, setValgtBehandlingId] = useState<MeldekortbehandlingId | undefined>(
        sisteBehandlingId,
    );

    if (!sisteBehandlingId) {
        return (
            <InlineMessage status={'info'} size={'small'}>
                {'Ingen meldekortbehandlinger for denne perioden'}
            </InlineMessage>
        );
    }

    const valgtBehandling =
        meldekortbehandlingIder.find((id) => id === valgtBehandlingId) ?? sisteBehandlingId;

    return (
        <VStack gap={'space-16'}>
            <HStack justify={'space-between'} align={'center'}>
                <Heading size={'xsmall'} level={'4'} spacing={true}>
                    {'Meldekortbehandlinger'}
                </Heading>

                <Select
                    label={'Velg meldekortbehandling'}
                    hideLabel={true}
                    size={'small'}
                    value={valgtBehandling}
                    onChange={(e) => setValgtBehandlingId(e.target.value as MeldekortbehandlingId)}
                >
                    {meldekortbehandlingIder.toReversed().map((behandlingId, index) => {
                        const behandling = sak.meldekortbehandlinger[behandlingId];

                        return (
                            <option key={behandlingId} value={behandlingId}>
                                {`Opprettet ${behandling ? formaterTidspunkt(behandling.opprettet) : behandlingId}${
                                    index === 0 ? ' (siste)' : ''
                                }`}
                            </option>
                        );
                    })}
                </Select>
            </HStack>

            <MeldekortbehandlingOppsummering
                meldekortbehandlingId={valgtBehandling}
                kjedeId={kjedeId}
            />
        </VStack>
    );
};
