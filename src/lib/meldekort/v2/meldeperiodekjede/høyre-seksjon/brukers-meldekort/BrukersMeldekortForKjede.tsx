import { BrukersMeldekortProps } from '~/lib/meldekort/typer/BrukersMeldekort';
import { HStack, VStack } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';
import { BrukersMeldekortAutomatiskBehandlingStatus } from '~/lib/meldekort/3-høyre-seksjon/brukers-meldekort/automatisk-behandling-status/BrukersMeldekortAutomatiskBehandlingStatus';
import { BrukersMeldekortUker } from '~/lib/meldekort/v2/brukers-meldekort/BrukersMeldekortUker';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';

type Props = {
    meldekort: BrukersMeldekortProps;
    className?: string;
};

export const BrukersMeldekortForKjede = ({ meldekort, className }: Props) => {
    const { mottatt } = meldekort;

    return (
        <VStack gap={'space-16'} className={className}>
            <HStack gap={'space-4'} align={'start'} justify={'space-between'}>
                <DetaljHorisontal navn={'Mottatt:'}>{formaterTidspunkt(mottatt)}</DetaljHorisontal>
                <BrukersMeldekortAutomatiskBehandlingStatus meldekort={meldekort} />
            </HStack>

            <BrukersMeldekortUker brukersMeldekort={meldekort} kompakt={false} />
        </VStack>
    );
};
