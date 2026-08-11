import { ReactNode, useState } from 'react';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { BenkSkjulPåVentCheckbox } from '~/lib/benk/felles/BenkSkjulPåVentCheckbox';

type Props = {
    onSubmit: () => Promise<unknown>;
    onNullstill: () => Promise<unknown>;
    /** «Skjul på vent» er likt for alle faner, og ligger derfor i det delte skjemaet */
    skjulPåVent: boolean;
    onSkjulPåVentChange: (skjulPåVent: boolean) => void;
    children: ReactNode;
};

export const BenkFilterSkjema = ({
    onSubmit,
    onNullstill,
    skjulPåVent,
    onSkjulPåVentChange,
    children,
}: Props) => {
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

            <BenkSkjulPåVentCheckbox checked={skjulPåVent} onChange={onSkjulPåVentChange} />

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
