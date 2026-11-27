import { BodyShort, HStack } from '@navikt/ds-react';
import { BrukersMeldekortProps } from '~/lib/meldekort/typer/BrukersMeldekort';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldekortbehandlingUrl } from '~/utils/urls';

type Props = {
    meldekort: BrukersMeldekortProps;
    /** Behandlingen som vises på siden, og som det derfor ikke lenkes til. */
    gjeldendeBehandlingId?: MeldekortbehandlingId;
};

export const BrukersMeldekortBehandling = ({ meldekort, gjeldendeBehandlingId }: Props) => {
    const { sak } = useSak();
    const { behandlingId } = meldekort;

    if (!behandlingId) {
        return null;
    }

    return (
        <HStack gap={'space-6'} align={'center'}>
            <BodyShort size={'small'} weight={'semibold'}>
                {'Første behandling:'}
            </BodyShort>
            {behandlingId === gjeldendeBehandlingId ? (
                <BodyShort size={'small'}>{'Denne behandlingen'}</BodyShort>
            ) : (
                <InternLenke href={meldekortbehandlingUrl(sak.saksnummer, behandlingId)}>
                    <BodyShort size={'small'}>{'Åpne behandlingen'}</BodyShort>
                </InternLenke>
            )}
        </HStack>
    );
};
