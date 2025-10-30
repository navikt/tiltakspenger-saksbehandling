import React from 'react';
import { Heading, VStack } from '@navikt/ds-react';
import { getNavnMedFødselsdato } from '~/components/papirsøknad/barnetillegg/barnetilleggUtils';
import { Barn, JaNeiSvar } from '~/components/papirsøknad/papirsøknadTypes';

type Props = {
    barn: Barn;
};

export const InformasjonOmBarnManuell = ({ barn }: Props) => {
    const getTekstForJaNeiSpørsmål = (value: JaNeiSvar | undefined) => {
        switch (value) {
            case 'JA':
                return 'Ja';
            case 'NEI':
                return 'Nei';
            case 'IKKE_BESVART':
                return 'Ikke besvart';
        }
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
