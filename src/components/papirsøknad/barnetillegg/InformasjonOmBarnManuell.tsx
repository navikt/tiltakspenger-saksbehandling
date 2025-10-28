import React from 'react';
import { Heading, VStack } from '@navikt/ds-react';
import { getNavnMedFødselsdato } from '~/components/papirsøknad/barnetillegg/barnetilleggUtils';
import { Barn } from '~/components/papirsøknad/papirsøknadTypes';

type Props = {
    barn: Barn;
};

export const InformasjonOmBarnManuell = ({ barn }: Props) => {
    const getTekstForJaNeiSpørsmål = (value: boolean | undefined) => {
        if (value === null || value === undefined) return 'Ikke besvart';
        return value ? 'Ja' : 'Nei';
    };

    return (
        <VStack>
            <Heading size="small" level="4">
                {getNavnMedFødselsdato(barn, false)}
            </Heading>
            <div>
                Oppholder seg i EØS-land i tiltaksperioden:{' '}
                {getTekstForJaNeiSpørsmål(barn.oppholdInnenforEøs?.svar)}
                <br />
                Det er vedlagt dokumentasjon for barnet:{' '}
                {getTekstForJaNeiSpørsmål(barn.manueltRegistrertBarnHarVedlegg?.svar)}
            </div>
        </VStack>
    );
};
