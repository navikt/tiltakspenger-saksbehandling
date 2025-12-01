import { BodyShort, Button, HStack, Loader, VStack } from '@navikt/ds-react';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { alderFraDato, finn16årsdag, formaterDatotekst } from '~/utils/date';
import { erDatoIPeriode } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { Søknad, SøknadBarn } from '~/types/Søknad';
import { useHentPersonopplysningerBarn } from '~/components/papirsøknad/barnetillegg/useHentPersonopplysningerBarn';
import { useSak } from '~/context/sak/SakContext';
import { ChevronRightDoubleIcon } from '@navikt/aksel-icons';
import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { Personopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';
import { Nullable } from '~/types/UtilTypes';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import {
    useBehandlingInnvilgelseSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';
import { erRammebehandlingInnvilgelseResultat } from '~/utils/behandling';

import style from './SøknadOpplysningerBarn.module.css';
import { formaterSøknadsspørsmålSvar } from '~/utils/tekstformateringUtils';

type Props = {
    tiltaksperiode: Nullable<Periode>;
    søknad: Søknad;
    visBarnetilleggPeriodiseringKnapp?: boolean;
};

export const SøknadOpplysningerBarn = ({
    tiltaksperiode,
    søknad,
    visBarnetilleggPeriodiseringKnapp,
}: Props) => {
    const getBarnetilleggTekst = () => {
        if (!søknad.svar.harSøktOmBarnetillegg) {
            return 'Nei';
        }
        if (søknad.svar.harSøktOmBarnetillegg.svar === 'JA') {
            return (
                formaterSøknadsspørsmålSvar(søknad.svar.harSøktOmBarnetillegg.svar) +
                ' - barn ikke oppgitt'
            );
        } else {
            return formaterSøknadsspørsmålSvar(søknad.svar.harSøktOmBarnetillegg.svar);
        }
    };

    return (
        <div className={style.wrapper}>
            <BodyShort spacing={true}>{'Barn:'}</BodyShort>
            {søknad.barnetillegg.length > 0 ? (
                <MedBarn
                    tiltaksperiode={tiltaksperiode}
                    søknad={søknad}
                    visBarnetilleggPeriodiseringKnapp={visBarnetilleggPeriodiseringKnapp}
                />
            ) : (
                <BehandlingSaksopplysning
                    navn="Har søkt om barnetillegg"
                    verdi={getBarnetilleggTekst()}
                    visVarsel={
                        søknad.barnetillegg.length === 0 &&
                        søknad.svar.harSøktOmBarnetillegg?.svar !== 'NEI'
                    }
                />
            )}
        </div>
    );
};

const MedBarn = ({ tiltaksperiode, søknad, visBarnetilleggPeriodiseringKnapp }: Props) => {
    const { sak } = useSak();

    const { resultat } = useBehandlingSkjema();

    const personopplysningerBarn = useHentPersonopplysningerBarn(
        sak.sakId,
        søknad.barnetillegg.length > 0,
    );

    return (
        <VStack gap={'4'}>
            {personopplysningerBarn.isLoading && (
                <HStack gap="2" align="center">
                    <Loader size="small" title="Henter skjermingsinformasjon for barn..." />
                    <BodyShort size="small">Henter skjermingsinformasjon for barn...</BodyShort>
                </HStack>
            )}

            {søknad.barnetillegg
                .toSorted((a, b) => (a.fødselsdato > b.fødselsdato ? 1 : -1))
                .map((barn) => {
                    const { fnr, fødselsdato, fornavn } = barn;

                    const personopplysninger = fnr
                        ? personopplysningerBarn.data?.find((p) => p.fnr === fnr)
                        : undefined;

                    return (
                        <Barn
                            barn={barn}
                            tiltaksperiode={tiltaksperiode}
                            personopplysninger={personopplysninger}
                            key={fnr ?? `${fødselsdato}-${fornavn}`}
                        />
                    );
                })}

            {visBarnetilleggPeriodiseringKnapp &&
                erRammebehandlingInnvilgelseResultat(resultat) && (
                    <PeriodiserBarnetilleggKnapp søknad={søknad} />
                )}
        </VStack>
    );
};

type BarnProps = {
    barn: SøknadBarn;
    tiltaksperiode: Nullable<Periode>;
    personopplysninger?: Personopplysninger;
};

const Barn = ({ barn, tiltaksperiode, personopplysninger }: BarnProps) => {
    const { fornavn, mellomnavn, etternavn, fødselsdato, oppholderSegIEØSSpm, kilde } = barn;

    const navn = [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ');
    const fødselsdatoFormattert = formaterDatotekst(fødselsdato);

    const bleFødtITiltaksperioden = tiltaksperiode
        ? erDatoIPeriode(fødselsdato, tiltaksperiode)
        : false;

    const fyller16dato = finn16årsdag(fødselsdato);
    const fyller16ITiltaksperioden = tiltaksperiode
        ? erDatoIPeriode(fyller16dato, tiltaksperiode)
        : false;

    const { fortrolig, strengtFortrolig, dødsdato } = personopplysninger || {};

    const dødeITiltaksperioden =
        dødsdato && tiltaksperiode ? erDatoIPeriode(dødsdato, tiltaksperiode) : false;

    return (
        <div>
            <BehandlingSaksopplysning navn={'Navn'} verdi={navn} />
            <BehandlingSaksopplysning navn={'Alder'} verdi={`${alderFraDato(fødselsdato)} år`} />
            {fyller16ITiltaksperioden && (
                <BehandlingSaksopplysning
                    navn={'Barnet fyller 16 år i tiltaksperioden'}
                    verdi={formaterDatotekst(fyller16dato)}
                    visVarsel
                />
            )}
            {bleFødtITiltaksperioden ? (
                <BehandlingSaksopplysning
                    navn={'Barnet ble født i tiltaksperioden'}
                    verdi={fødselsdatoFormattert}
                    visVarsel
                />
            ) : (
                <BehandlingSaksopplysning navn={'Fødselsdato'} verdi={fødselsdatoFormattert} />
            )}
            {dødeITiltaksperioden && (
                <BehandlingSaksopplysning
                    navn={'Barnet døde  i tiltaksperioden'}
                    verdi={formaterDatotekst(dødsdato!)}
                    visVarsel
                />
            )}
            <BehandlingSaksopplysning
                navn={'Oppholder seg i Norge/EØS?'}
                verdi={oppholderSegIEØSSpm.svar}
                visVarsel={oppholderSegIEØSSpm.svar !== 'JA'}
            />
            <BehandlingSaksopplysning navn={'Kilde'} verdi={kilde} />

            {(fortrolig || strengtFortrolig) && (
                <BehandlingSaksopplysning
                    navn={'Adressebeskyttelse'}
                    verdi={`Barnet har ${strengtFortrolig ? 'strengt ' : ''}fortrolig adresse`}
                    visVarsel
                />
            )}
        </div>
    );
};

const PeriodiserBarnetilleggKnapp = ({ søknad }: { søknad: Søknad }) => {
    const { rolleForBehandling } = useBehandling();

    const { innvilgelsesperiode, harValgtPeriode } = useBehandlingInnvilgelseSkjema().innvilgelse;
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    if (rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER) {
        return null;
    }

    return (
        <Button
            variant={'tertiary'}
            size={'small'}
            icon={<ChevronRightDoubleIcon />}
            iconPosition={'right'}
            onClick={() => {
                if (!harValgtPeriode) {
                    return;
                }

                dispatch({
                    type: 'settBarnetilleggPerioder',
                    payload: {
                        barnetilleggPerioder: periodiserBarnetilleggFraSøknad(
                            søknad.barnetillegg,
                            innvilgelsesperiode,
                        ),
                    },
                });
            }}
            disabled={!harValgtPeriode}
        >
            {'Periodiser barnetillegg for disse barna'}
        </Button>
    );
};
