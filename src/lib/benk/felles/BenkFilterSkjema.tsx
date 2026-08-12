import { ReactNode, useState } from 'react';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { BenkFilterCheckbox } from '~/lib/benk/felles/BenkFilterCheckbox';

type Props = {
    onSubmit: () => Promise<unknown>;
    onNullstill: () => Promise<unknown>;
    /** Checkbox-filtrene er like for alle faner, og ligger derfor i det delte skjemaet */
    skjulEgneTilBeslutning: boolean;
    onSkjulEgneTilBeslutningChange: (skjulEgneTilBeslutning: boolean) => void;
    skjulPåVent: boolean;
    onSkjulPåVentChange: (skjulPåVent: boolean) => void;
    children: ReactNode;
};

export const BenkFilterSkjema = ({
    onSubmit,
    onNullstill,
    skjulEgneTilBeslutning,
    onSkjulEgneTilBeslutningChange,
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

            <VStack gap={'space-4'}>
                <BenkFilterCheckbox
                    checked={skjulEgneTilBeslutning}
                    onChange={onSkjulEgneTilBeslutningChange}
                >
                    {'Skjul behandlinger jeg har sendt til beslutning'}
                </BenkFilterCheckbox>
                <BenkFilterCheckbox checked={skjulPåVent} onChange={onSkjulPåVentChange}>
                    {'Skjul behandlinger satt på vent'}
                </BenkFilterCheckbox>
            </VStack>

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
