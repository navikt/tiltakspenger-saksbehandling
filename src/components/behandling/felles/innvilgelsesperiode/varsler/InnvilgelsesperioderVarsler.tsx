import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { Alert, VStack } from '@navikt/ds-react';
import { removeDuplicatesFilter } from '~/utils/array';
import { Rammebehandling } from '~/types/Rammebehandling';
import { deltarPaFlereTiltakMedStartOgSluttdato } from '~/utils/behandling';

type Props = {
    innvilgelsesperioder: Innvilgelsesperiode[];
    behandling: Rammebehandling;
};

export const InnvilgelsesperioderVarsler = ({ innvilgelsesperioder, behandling }: Props) => {
    const antallDagerPerMeldeperiode = innvilgelsesperioder
        .map((it) => it.antallDagerPerMeldeperiode)
        .filter(removeDuplicatesFilter());

    const antallDagerSettesIkkeAutomatiskIBrev =
        antallDagerPerMeldeperiode.length > 1 ||
        antallDagerPerMeldeperiode[0] > 10 ||
        erOddetall(antallDagerPerMeldeperiode[0]);

    const harFlereTiltak = deltarPaFlereTiltakMedStartOgSluttdato(behandling);

    if (!antallDagerSettesIkkeAutomatiskIBrev && !harFlereTiltak) {
        return null;
    }

    return (
        <VStack gap={'space-4'}>
            {antallDagerSettesIkkeAutomatiskIBrev && (
                <Alert variant={'info'} size={'small'}>
                    {
                        'Husk å oppgi antall dager per uke det innvilges tiltakspenger for i vedtaksbrevet.'
                    }
                </Alert>
            )}
            {harFlereTiltak && (
                <Alert variant={'info'} size={'small'}>
                    {`Flere tiltak registrert på bruker. Det du velger brukes
                     for regnskapsføring og statistikk, og påvirker ikke vedtaket.`}
                </Alert>
            )}
        </VStack>
    );
};

const erOddetall = (tall: number) => tall % 2 === 1;
