import { BodyShort, VStack } from '@navikt/ds-react';
import { BrukersMeldekortProps } from '~/lib/meldekort/typer/BrukersMeldekort';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { hentMeldekortbehandling } from '~/lib/sak/sakUtils';
import { formaterTidspunkt } from '~/utils/date';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';

type Props = {
    meldekort: BrukersMeldekortProps;
    /** Behandlingen som vises på siden, og som det derfor ikke lenkes til. */
    gjeldendeBehandlingId?: MeldekortbehandlingId;
};

export const BrukersMeldekortBehandlingStatus = ({ meldekort, gjeldendeBehandlingId }: Props) => {
    const { sak } = useSak();
    const { behandlingId } = meldekort;

    if (!behandlingId) {
        return <BodyShort size={'small'}>{'Ikke behandlet'}</BodyShort>;
    }

    const { godkjentTidspunkt, avbrutt, sistEndret } = hentMeldekortbehandling(sak, behandlingId);
    // Meldekortet markeres også som behandlet når behandlingen avbrytes
    const behandletTidspunkt = godkjentTidspunkt ?? avbrutt?.avbruttTidspunkt ?? sistEndret;

    return (
        <VStack gap={'space-4'}>
            <DetaljHorisontal navn={'Først behandlet:'} size={'small'}>
                {formaterTidspunkt(behandletTidspunkt)}
            </DetaljHorisontal>
            {behandlingId === gjeldendeBehandlingId ? (
                <BodyShort size={'small'}>{'(Denne behandlingen)'}</BodyShort>
            ) : (
                <InternLenke href={meldekortbehandlingUrl(sak.saksnummer, behandlingId)}>
                    <BodyShort size={'small'}>{'Åpne behandlingen'}</BodyShort>
                </InternLenke>
            )}
        </VStack>
    );
};
