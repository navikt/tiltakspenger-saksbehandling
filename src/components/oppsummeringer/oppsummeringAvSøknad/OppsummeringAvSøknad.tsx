import React from 'react';
import { Periode } from '~/types/Periode';
import { useConfig } from '~/context/ConfigContext';
import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedPeriodeSpm,
} from '../../behandling/saksopplysninger/BehandlingSaksopplysning';
import { formaterDatotekst, periodeTilFormatertDatotekst } from '~/utils/date';
import { SøknadOpplysningerSvar } from '../../behandling/saksopplysninger/søknad/SøknadOpplysningerSvar';
import { SøknadOpplysningerBarn } from '../../behandling/saksopplysninger/søknad/SøknadOpplysningerBarn';
import { Alert, Link, VStack } from '@navikt/ds-react';
import { Søknad } from '~/types/Søknad';
import { Nullable } from '~/types/UtilTypes';
import { SøknadsopplysningerTiltak } from '~/components/oppsummeringer/oppsummeringAvSøknad/SøknadsopplysningerTiltak';
import { formaterSøknadstype } from '~/utils/tekstformateringUtils';

interface Props {
    /** Behandlingens tiltaksperiode, eller det som er på søknad hvis behandling er enda ikke opprettet (null ved papirsøknad dersom saksbehandler ikke har fyllt inn)*/
    tiltaksperiode: Nullable<Periode>;
    søknad: Søknad;
    visBarnetilleggPeriodiseringKnapp?: boolean;
}

export const OppsummeringAvSøknad = ({
    søknad,
    tiltaksperiode,
    visBarnetilleggPeriodiseringKnapp,
}: Props) => {
    const { gosysUrl } = useConfig();

    const { opprettet, søknadstype, tiltaksdeltakelseperiodeDetErSøktOm, antallVedlegg, svar } =
        søknad;
    console.log(søknadstype);

    const { kvp, intro, institusjon, etterlønn, sykepenger } = svar;

    return (
        <VStack>
            <BehandlingSaksopplysning
                navn={'Opprettet'}
                verdi={formaterDatotekst(opprettet)}
                spacing={true}
            />

            <BehandlingSaksopplysning
                navn={'Søknadstype'}
                verdi={formaterSøknadstype(søknadstype)}
            />

            <BehandlingSaksopplysning
                navn={'Periode det er søkt om'}
                verdi={
                    !tiltaksdeltakelseperiodeDetErSøktOm
                        ? 'Periode mangler'
                        : periodeTilFormatertDatotekst({
                              fraOgMed: tiltaksdeltakelseperiodeDetErSøktOm.fraOgMed,
                              tilOgMed: tiltaksdeltakelseperiodeDetErSøktOm.tilOgMed,
                          })
                }
                visVarsel={!tiltaksdeltakelseperiodeDetErSøktOm}
            />

            <SøknadsopplysningerTiltak søknad={søknad} />

            <BehandlingSaksopplysningMedPeriodeSpm
                navn={'KVP'}
                periodeSpm={kvp}
                visVarsel={kvp.svar !== 'NEI'}
            />
            <BehandlingSaksopplysningMedPeriodeSpm
                navn={'Intro'}
                periodeSpm={intro}
                visVarsel={intro.svar !== 'NEI'}
            />
            <BehandlingSaksopplysningMedPeriodeSpm
                navn={'Institusjonsopphold'}
                periodeSpm={institusjon}
                visVarsel={institusjon.svar !== 'NEI'}
            />
            <BehandlingSaksopplysning
                navn={'Etterlønn'}
                verdi={etterlønn.svar}
                visVarsel={etterlønn.svar !== 'NEI'}
            />
            <BehandlingSaksopplysningMedPeriodeSpm
                navn={'Mottar sykepenger og fortsatt sykmeldt'}
                periodeSpm={sykepenger}
                spacing={true}
                visVarsel={sykepenger.svar !== 'NEI'}
            />

            <SøknadOpplysningerSvar pengestøtter={søknad.svar} />

            <SøknadOpplysningerBarn
                tiltaksperiode={tiltaksperiode}
                søknad={søknad}
                visBarnetilleggPeriodiseringKnapp={visBarnetilleggPeriodiseringKnapp}
            />

            <BehandlingSaksopplysning navn={'Vedlegg'} verdi={antallVedlegg > 0 ? 'Ja' : 'Nei'} />
            {antallVedlegg > 0 && (
                <Alert variant={'warning'} inline={true} size={'small'}>
                    {'Sjekk vedlegg i '}
                    <Link href={gosysUrl}>{'gosys'}</Link>
                </Alert>
            )}
        </VStack>
    );
};
