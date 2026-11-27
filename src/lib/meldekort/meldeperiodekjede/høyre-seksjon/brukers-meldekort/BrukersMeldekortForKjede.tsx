import { BrukersMeldekortProps } from '~/lib/meldekort/typer/BrukersMeldekort';
import { HStack, VStack } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';
import { BrukersMeldekortAutomatiskBehandlingStatus } from '~/lib/meldekort/felles/brukers-meldekort/automatisk-behandling-status/BrukersMeldekortAutomatiskBehandlingStatus';
import { BrukersMeldekortUker } from '~/lib/meldekort/felles/brukers-meldekort/BrukersMeldekortUker';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { BrukersMeldekortBehandlingStatus } from '~/lib/meldekort/felles/brukers-meldekort/BrukersMeldekortBehandlingStatus';

type Props = {
    meldekort: BrukersMeldekortProps;
    className?: string;
};

export const BrukersMeldekortForKjede = ({ meldekort, className }: Props) => {
    const { mottatt } = meldekort;

    return (
        <VStack gap={'space-16'} className={className}>
            <HStack gap={'space-4'} align={'start'} justify={'space-between'}>
                <VStack gap={'space-8'}>
                    <DetaljHorisontal navn={'Mottatt:'}>
                        {formaterTidspunkt(mottatt)}
                    </DetaljHorisontal>
                    <BrukersMeldekortBehandlingStatus meldekort={meldekort} />
                </VStack>
                <BrukersMeldekortAutomatiskBehandlingStatus meldekort={meldekort} />
            </HStack>

            <BrukersMeldekortUker brukersMeldekort={meldekort} kompakt={false} />
        </VStack>
    );
};
