import { BodyShort, Heading, Tag, VStack } from '@navikt/ds-react';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { RichTooltip } from '~/lib/_felles/tooltip/RichTooltip';
import { Prioritering } from '~/lib/rammebehandling/typer/Rammebehandling';
import { sladdbarTekst } from '~/utils/sladdetVerdi';

type Props = {
    prioritering: Prioritering;
};

export const PrioritertBehandlingTag = ({ prioritering }: Props) => {
    return (
        <RichTooltip
            content={
                <VStack gap={'space-4'}>
                    <Heading size={'xsmall'} level={'3'}>
                        {'Prioritert behandling'}
                    </Heading>
                    <BodyShort size={'small'}>{sladdbarTekst(prioritering.begrunnelse)}</BodyShort>
                </VStack>
            }
        >
            <Tag
                data-color={'warning'}
                size={'small'}
                icon={<ExclamationmarkTriangleIcon aria-hidden />}
                tabIndex={0}
            >
                {'Prioritert'}
            </Tag>
        </RichTooltip>
    );
};
