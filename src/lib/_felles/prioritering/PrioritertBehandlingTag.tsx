import { BodyShort, Heading, Tag, TagProps, VStack } from '@navikt/ds-react';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { RichTooltip } from '~/lib/_felles/tooltip/RichTooltip';
import { Prioritering } from '~/lib/_felles/prioritering/prioriteringTyper';
import { sladdbarTekst } from '~/utils/sladdetVerdi';

type Props = {
    prioritering: Prioritering;
    size?: TagProps['size'];
};

export const PrioritertBehandlingTag = ({ prioritering, size }: Props) => {
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
                size={size}
                icon={<ExclamationmarkTriangleIcon aria-hidden />}
                tabIndex={0}
            >
                {'Prioritert'}
            </Tag>
        </RichTooltip>
    );
};
