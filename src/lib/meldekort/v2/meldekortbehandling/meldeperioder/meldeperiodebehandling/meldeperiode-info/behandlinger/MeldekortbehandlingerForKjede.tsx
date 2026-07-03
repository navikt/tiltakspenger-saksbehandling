import { Heading, HStack, InlineMessage, Select, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { formaterTidspunkt } from '~/utils/date';
import { MeldekortbehandlingForKjedeKompakt } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/meldeperiode-info/behandlinger/MeldekortbehandlingForKjedeKompakt';
import { hentMeldekortbehandling } from '~/lib/sak/sakUtils';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { meldekortbehandlingStatusTekst } from '~/lib/meldekort/v2/tekster';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

export const MeldekortbehandlingerForKjede = ({ meldeperiodeKjede }: Props) => {
    const { id: kjedeId, meldekortbehandlingIder } = meldeperiodeKjede;

    const { sak } = useSak();
    const { id: meldekortbehandlingIdFraContext } = useMeldekortbehandling();

    const sisteBehandlingId = meldekortbehandlingIder
        .filter((it) => it !== meldekortbehandlingIdFraContext)
        .at(-1);

    const [valgtBehandlingId, setValgtBehandlingId] = useState<MeldekortbehandlingId | undefined>(
        sisteBehandlingId,
    );

    if (!valgtBehandlingId) {
        return (
            <InlineMessage status={'info'} size={'small'}>
                {'Ingen tidligere meldekortbehandlinger for denne perioden'}
            </InlineMessage>
        );
    }

    const alleBehandlinger = meldekortbehandlingIder
        .map((id) => hentMeldekortbehandling(sak, id))
        .toReversed();

    return (
        <VStack gap={'space-24'}>
            <HStack justify={'space-between'} align={'center'}>
                <Heading size={'xsmall'} level={'4'} spacing={true}>
                    {'Alle meldekortbehandlinger'}
                </Heading>

                <Select
                    label={'Velg meldekortbehandling'}
                    hideLabel={true}
                    size={'small'}
                    value={valgtBehandlingId}
                    onChange={(e) => setValgtBehandlingId(e.target.value as MeldekortbehandlingId)}
                >
                    {alleBehandlinger.map((behandling) => {
                        const { id, sistEndret, status } = behandling;

                        const erBehandlingenSomVises = id === meldekortbehandlingIdFraContext;

                        return (
                            <option key={id} value={id} disabled={erBehandlingenSomVises}>
                                {`${formaterTidspunkt(sistEndret)} (${meldekortbehandlingStatusTekst[status]})${erBehandlingenSomVises ? ' (denne)' : ''}`}
                            </option>
                        );
                    })}
                </Select>
            </HStack>

            <MeldekortbehandlingForKjedeKompakt
                meldekortbehandlingId={valgtBehandlingId}
                kjedeId={kjedeId}
            />
        </VStack>
    );
};
