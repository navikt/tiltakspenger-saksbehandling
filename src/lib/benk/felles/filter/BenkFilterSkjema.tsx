import { ReactNode, useState } from 'react';
import { Button, HelpText, HStack, VStack } from '@navikt/ds-react';
import { BenkTab } from '../../typer/tabs';
import { BenkFaneFilter } from '../../typer/benkside';
import { BenkFellesFilter } from '../../typer/felles';
import { BenkFilterCheckbox } from './BenkFilterCheckbox';
import { BenkSaksbehandlerSelect } from './BenkSaksbehandlerSelect';
import { BenkFilterSkjemaTilstand } from './useBenkFilterSkjema';

/** Propsene hver fanes filterskjema tar imot */
export type BenkFaneFilterSkjemaProps<T extends BenkTab> = {
    aktivtFilter: BenkFaneFilter<T>;
    saksbehandlere: string[];
    besluttere: string[];
};

type Props = {
    skjema: BenkFilterSkjemaTilstand<BenkFellesFilter>;
    saksbehandlere: string[];
    besluttere: string[];
    /** Fanens egne filtre, som vises foran saksbehandlerfilteret */
    children: ReactNode;
    /** Fanens egne filtre som vises etter saksbehandlerfilteret */
    etterSaksbehandler?: ReactNode;
};

/** Skjemaet alle fanene deler, med fellesfiltrene (saksbehandler og avkrysningene) og knappene */
export const BenkFilterSkjema = ({
    skjema,
    saksbehandlere,
    besluttere,
    children,
    etterSaksbehandler,
}: Props) => {
    const { valgtFilter, endreFilter, oppdaterFilter, nullstillFilter } = skjema;
    const [isLoading, setIsLoading] = useState(false);

    const kjør = (action: () => Promise<unknown>) => {
        setIsLoading(true);
        action().finally(() => setIsLoading(false));
    };

    return (
        <VStack gap={'space-16'}>
            <HStack gap={'space-16'} wrap={true}>
                {children}

                <BenkSaksbehandlerSelect
                    saksbehandlere={saksbehandlere}
                    besluttere={besluttere}
                    valgtSaksbehandler={valgtFilter.saksbehandler}
                    onChange={(saksbehandler) => endreFilter({ saksbehandler })}
                />

                {etterSaksbehandler}
            </HStack>

            <VStack gap={'space-4'}>
                <HStack align={'center'} gap={'space-4'}>
                    <BenkFilterCheckbox
                        checked={valgtFilter.skjulEgneTilBeslutning}
                        onChange={(skjulEgneTilBeslutning) =>
                            endreFilter({ skjulEgneTilBeslutning })
                        }
                    >
                        {'Skjul behandlinger jeg har sendt videre'}
                    </BenkFilterCheckbox>
                    <HelpText>
                        {
                            'Skjuler behandlinger som du har sendt til beslutning, eller som du har underkjent.'
                        }
                    </HelpText>
                </HStack>

                <BenkFilterCheckbox
                    checked={valgtFilter.skjulPåVent}
                    onChange={(skjulPåVent) => endreFilter({ skjulPåVent })}
                >
                    {'Skjul behandlinger satt på vent'}
                </BenkFilterCheckbox>
            </VStack>

            <HStack gap={'space-16'}>
                <Button
                    type={'button'}
                    size={'small'}
                    loading={isLoading}
                    onClick={() => kjør(oppdaterFilter)}
                >
                    {'Oppdater filtre'}
                </Button>
                <Button
                    type={'button'}
                    size={'small'}
                    variant={'secondary'}
                    onClick={() => kjør(nullstillFilter)}
                >
                    {'Nullstill filtre'}
                </Button>
            </HStack>
        </VStack>
    );
};
