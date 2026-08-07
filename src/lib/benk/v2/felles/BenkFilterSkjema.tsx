import { ReactNode, useState } from 'react';
import { Button, HStack, VStack } from '@navikt/ds-react';

type Props = {
    onSubmit: () => Promise<unknown>;
    onNullstill: () => Promise<unknown>;
    children: ReactNode;
};

export const BenkFilterSkjema = ({ onSubmit, onNullstill, children }: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const kjør = (action: () => Promise<unknown>) => {
        setIsLoading(true);
        action().finally(() => setIsLoading(false));
    };

    return (
        <VStack gap={'space-16'}>
            <HStack gap={'space-16'} wrap={true}>
                {children}
            </HStack>
            <HStack gap={'space-16'}>
                <Button
                    type={'button'}
                    size={'small'}
                    loading={isLoading}
                    onClick={() => kjør(onSubmit)}
                >
                    {'Oppdater filtre'}
                </Button>
                <Button
                    type={'button'}
                    size={'small'}
                    variant={'secondary'}
                    onClick={() => kjør(onNullstill)}
                >
                    {'Nullstill filtre'}
                </Button>
            </HStack>
        </VStack>
    );
};
