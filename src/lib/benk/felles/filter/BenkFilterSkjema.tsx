import { ReactNode, useState } from 'react';
import { Box, Button, Chips, HelpText, HStack, VStack } from '@navikt/ds-react';
import { BenkGlobaltFilter } from '../../typer/felles';
import { BenkFilterSkjemaTilstand } from './useBenkFilterSkjema';

type Props = {
    skjema: BenkFilterSkjemaTilstand<BenkGlobaltFilter>;
    /** Fanens lokale filtre */
    children: ReactNode;
    visKunTildeltMeg?: boolean;
};

/** Filterskjemaet alle fanene deler: fanens lokale filtre, og under dem de globale */
const BenkFilterSkjema = ({ skjema, children, visKunTildeltMeg = false }: Props) => (
    <VStack gap={'space-16'}>
        <BenkLokaleFiltre skjema={skjema}>{children}</BenkLokaleFiltre>
        <BenkGlobaleFiltre skjema={skjema} visKunTildeltMeg={visKunTildeltMeg} />
    </VStack>
);

export default BenkFilterSkjema;

type LokaleFiltreProps = {
    skjema: BenkFilterSkjemaTilstand<BenkGlobaltFilter>;
    children: ReactNode;
};

/** Fanens egne filtre. De tas først i bruk når de oppdateres, og nullstilles ved bytte av fane. */
const BenkLokaleFiltre = ({ skjema, children }: LokaleFiltreProps) => {
    const { oppdaterFilter, nullstillFilter } = skjema;
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
                    variant={'secondary'}
                    onClick={() => kjør(nullstillFilter)}
                >
                    {'Nullstill filtre'}
                </Button>
                <Button
                    type={'button'}
                    size={'small'}
                    loading={isLoading}
                    onClick={() => kjør(oppdaterFilter)}
                >
                    {'Oppdater filtre'}
                </Button>
            </HStack>
        </VStack>
    );
};

type GlobaleFiltreProps = {
    skjema: BenkFilterSkjemaTilstand<BenkGlobaltFilter>;
    /** Mine-fanen viser bare behandlinger tildelt den innloggede, så der gir valget ingen mening */
    visKunTildeltMeg: boolean;
};

/** Filtrene som beholdes på tvers av fanene. De tas i bruk med en gang de velges. */
const BenkGlobaleFiltre = ({ skjema, visKunTildeltMeg }: GlobaleFiltreProps) => {
    const { aktivtFilter, endreGlobaltFilter } = skjema;

    return (
        <Box
            borderWidth={'1 0 0 0'}
            borderColor={'neutral-subtle'}
            paddingBlock={'space-12 space-0'}
        >
            <HStack align={'center'} gap={'space-4'}>
                <Chips>
                    {visKunTildeltMeg && (
                        <Chips.Toggle
                            selected={aktivtFilter.kunTildeltMeg}
                            onClick={() =>
                                endreGlobaltFilter({ kunTildeltMeg: !aktivtFilter.kunTildeltMeg })
                            }
                        >
                            {'Vis kun saker tildelt meg'}
                        </Chips.Toggle>
                    )}
                    <Chips.Toggle
                        selected={aktivtFilter.skjulEgneTilBeslutning}
                        onClick={() =>
                            endreGlobaltFilter({
                                skjulEgneTilBeslutning: !aktivtFilter.skjulEgneTilBeslutning,
                            })
                        }
                    >
                        {'Skjul behandlinger jeg har sendt videre'}
                    </Chips.Toggle>
                    <Chips.Toggle
                        selected={aktivtFilter.skjulPåVent}
                        onClick={() =>
                            endreGlobaltFilter({ skjulPåVent: !aktivtFilter.skjulPåVent })
                        }
                    >
                        {'Skjul behandlinger satt på vent'}
                    </Chips.Toggle>
                </Chips>
                <HelpText>
                    {
                        '«Skjul behandlinger jeg har sendt videre» skjuler behandlinger som du har sendt til beslutning, eller som du har underkjent.'
                    }
                </HelpText>
            </HStack>
        </Box>
    );
};
