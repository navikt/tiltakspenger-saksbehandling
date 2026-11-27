import { BodyShort, HStack, Tag } from '@navikt/ds-react';
import { BrukersMeldekortProps } from '~/lib/meldekort/typer/BrukersMeldekort';
import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiodekjede';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { finnBehandlingAvBrukersMeldekort } from '~/lib/sak/sakUtils';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldekortbehandlingUrl } from '~/utils/urls';
import {
    behandlingsstatusFarge,
    behandlingsstatusTekst,
} from '~/lib/behandling-felles/status/behandlingsstatus';

type Props = {
    meldekort: BrukersMeldekortProps;
    kjede: MeldeperiodekjedeProps;
    /** Behandlingen som vises på siden, og som det derfor ikke lenkes til. */
    gjeldendeBehandlingId?: MeldekortbehandlingId;
};

export const BrukersMeldekortBehandling = ({ meldekort, kjede, gjeldendeBehandlingId }: Props) => {
    const { sak } = useSak();

    const behandling = finnBehandlingAvBrukersMeldekort(sak, kjede, meldekort.id);

    if (!behandling) {
        return null;
    }

    const { id, status } = behandling;

    return (
        <HStack gap={'space-6'} align={'center'}>
            <BodyShort size={'small'} weight={'semibold'}>
                {'Første behandling:'}
            </BodyShort>
            {id === gjeldendeBehandlingId ? (
                <BodyShort size={'small'}>{'Denne behandlingen'}</BodyShort>
            ) : (
                <InternLenke href={meldekortbehandlingUrl(sak.saksnummer, id)}>
                    <BodyShort size={'small'}>{'Åpne behandlingen'}</BodyShort>
                </InternLenke>
            )}
            <Tag data-color={behandlingsstatusFarge(status)} variant={'outline'} size={'xsmall'}>
                {behandlingsstatusTekst(status)}
            </Tag>
        </HStack>
    );
};
