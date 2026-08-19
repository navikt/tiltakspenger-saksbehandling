import { Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { getNavnMedFødselsdato } from '~/lib/søknad/manuell-søknad/barnetillegg/barnetilleggUtils';
import { Barn } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { Periode } from '~/types/Periode';
import { erDatoIPeriode } from '~/utils/periode';
import { finn16årsdag } from '~/utils/date';
import { formaterSøknadsspørsmålSvar } from '~/lib/søknad/søknadTekster';

type Props = {
    barn: Barn;
    søknadsperiode: Periode | undefined;
};

export const InformasjonOmBarnManuell = ({ barn, søknadsperiode }: Props) => {
    const bleFødtITiltaksperioden = søknadsperiode
        ? erDatoIPeriode(barn.fødselsdato, søknadsperiode)
        : false;
    const fyller16ITiltaksperioden = søknadsperiode
        ? erDatoIPeriode(finn16årsdag(barn.fødselsdato), søknadsperiode)
        : false;
    return (
        <VStack gap="space-8">
            <HStack gap="space-16">
                <Heading size="small" level="4">
                    {getNavnMedFødselsdato(barn, false)}
                </Heading>
                {bleFødtITiltaksperioden && (
                    <Tag data-color="warning" variant="outline">
                        Født i søknadsperioden
                    </Tag>
                )}
                {fyller16ITiltaksperioden && (
                    <Tag data-color="warning" variant="outline">
                        Fyller 16 år i søknadsperioden
                    </Tag>
                )}
            </HStack>
            <div>
                Oppholder seg i EØS-land i tiltaksperioden:{' '}
                {formaterSøknadsspørsmålSvar(barn.oppholdInnenforEøs?.svar)}
                <br />
                Antall vedlegg (dokumentasjon) for barnet:{' '}
                {barn.manueltRegistrertBarnAntallVedlegg ?? 0}
            </div>
        </VStack>
    );
};
