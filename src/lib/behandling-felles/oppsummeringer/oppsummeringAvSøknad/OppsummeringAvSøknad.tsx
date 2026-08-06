import { Periode } from '~/types/Periode';
import { useConfig } from '~/lib/_felles/context/ConfigContext';
import { BehandlingSaksopplysning } from '~/lib/rammebehandling/saksopplysninger/BehandlingSaksopplysning';
import { formaterDatotekst, formaterPeriode } from '~/utils/date';
import { SøknadOpplysningerSvar } from '~/lib/rammebehandling/saksopplysninger/søknad/SøknadOpplysningerSvar';
import { SøknadOpplysningerBarn } from '~/lib/rammebehandling/saksopplysninger/søknad/SøknadOpplysningerBarn';
import { InlineMessage, Link, VStack } from '@navikt/ds-react';
import { Søknad } from '~/lib/søknad/søknadTyper';
import { Nullable } from '~/types/UtilTypes';
import { SøknadsopplysningerTiltak } from '~/lib/behandling-felles/oppsummeringer/oppsummeringAvSøknad/SøknadsopplysningerTiltak';
import { BehandlingSaksopplysningMedPeriodeSpm } from '~/lib/rammebehandling/saksopplysninger/søknad/SøknadOpplysningPeriodeSpm';
import { søknadBehandlingsårsakTekst, søknadstypeTekst } from '~/lib/søknad/søknadTekster';

type Props = {
    /** Behandlingens tiltaksperiode, eller det som er på søknad hvis behandling er enda ikke opprettet (null ved papirsøknad dersom saksbehandler ikke har fyllt inn)*/
    tiltaksperiode: Nullable<Periode>;
    søknad: Søknad;
    visBarnetilleggPeriodiseringKnapp?: boolean;
};

export const OppsummeringAvSøknad = ({
    søknad,
    tiltaksperiode,
    visBarnetilleggPeriodiseringKnapp,
}: Props) => {
    const { gosysUrl } = useConfig();

    const {
        opprettet,
        søknadstype,
        behandlingsarsak,
        tiltaksdeltakelseperiodeDetErSøktOm,
        antallVedlegg,
        svar,
    } = søknad;

    const { kvp, intro, institusjon, etterlønn, sykepenger } = svar;

    return (
        <VStack>
            <BehandlingSaksopplysning
                navn={'Opprettet'}
                verdi={formaterDatotekst(opprettet)}
                spacing={true}
            />

            <BehandlingSaksopplysning navn={'Søknadstype'} verdi={søknadstypeTekst[søknadstype]} />

            {behandlingsarsak && (
                <BehandlingSaksopplysning
                    navn={'Behandlingsårsak'}
                    verdi={søknadBehandlingsårsakTekst[behandlingsarsak]}
                />
            )}

            <BehandlingSaksopplysning
                navn={'Periode det er søkt om'}
                verdi={
                    !tiltaksdeltakelseperiodeDetErSøktOm
                        ? 'Periode mangler'
                        : formaterPeriode({
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
                <InlineMessage status={'warning'} size={'small'}>
                    {'Sjekk vedlegg i '}
                    <Link href={gosysUrl}>{'gosys'}</Link>
                </InlineMessage>
            )}
        </VStack>
    );
};
