import { MeldekortbehandlingSkjemaValideringsfeil } from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { BodyShort, InlineMessage, VStack } from '@navikt/ds-react';
import { MeldeperiodebehandlingValideringsfeil } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/validering/MeldeperiodebehandlingValideringsfeil';

type Props = {
    feil: MeldekortbehandlingSkjemaValideringsfeil;
};

export const MeldekortbehandlingValideringsfeil = ({ feil }: Props) => {
    const { meldeperioderFeil, overordnedeFeil } = feil;

    return (
        <Infokort variant={'feil'} header={'Feil eller mangler i behandlingen'}>
            <VStack gap={'space-16'}>
                <BodyShort>{'Må rettes før behandlingen kan sendes til beslutning.'}</BodyShort>

                {overordnedeFeil.map((feil) => (
                    <InlineMessage status={'error'} key={feil}>
                        {feil}
                    </InlineMessage>
                ))}

                {meldeperioderFeil.map((feil) => (
                    <MeldeperiodebehandlingValideringsfeil
                        valideringsfeil={feil}
                        key={feil.kjedeId}
                    />
                ))}
            </VStack>
        </Infokort>
    );
};
