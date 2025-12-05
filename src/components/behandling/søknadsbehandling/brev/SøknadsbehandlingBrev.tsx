import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { søknadsbehandlingValidering } from '~/components/behandling/søknadsbehandling/send-og-godkjenn/søknadsbehandlingValidering';
import { SøknadsbehandlingBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import {
    SøknadsbehandlingSkjemaContext,
    useSøknadsbehandlingSkjema,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';

export const SøknadsbehandlingBrev = () => {
    const { behandling } = useSøknadsbehandling();
    const skjema = useSøknadsbehandlingSkjema();

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for tiltakspenger og barnetillegg'}
            validering={søknadsbehandlingValidering(behandling, skjema)('tilBeslutning')}
            hentDto={(): SøknadsbehandlingBrevForhåndsvisningDTO =>
                søknadsbehandlingSkjemaTilBrevForhåndsvisningDTO(skjema)
            }
            hjelpetekst={<Hjelpetekst />}
        />
    );
};

const søknadsbehandlingSkjemaTilBrevForhåndsvisningDTO = (
    skjema: SøknadsbehandlingSkjemaContext,
): SøknadsbehandlingBrevForhåndsvisningDTO => {
    const { resultat } = skjema;

    const baseDTO = {
        fritekst: skjema.textAreas.brevtekst.getValue(),
        resultat: skjema.resultat,
    };

    switch (resultat) {
        case SøknadsbehandlingResultat.AVSLAG: {
            return { ...baseDTO, avslagsgrunner: skjema.avslagsgrunner };
        }

        case SøknadsbehandlingResultat.INNVILGELSE: {
            const { innvilgelse } = skjema;

            if (!innvilgelse.harValgtPeriode) {
                throw Error('Innvilgelsesperioden må være valgt');
            }

            return {
                ...baseDTO,
                virkningsperiode: innvilgelse.innvilgelsesperiode,
                barnetillegg: innvilgelse.barnetilleggPerioder,
                antallDagerPerMeldeperiodeForPerioder: innvilgelse.antallDagerPerMeldeperiode,
            };
        }

        case SøknadsbehandlingResultat.IKKE_VALGT: {
            throw Error('Kan ikke forhåndsvise uten valgt resuøtat');
        }
    }
};

const Hjelpetekst = () => {
    return (
        <>
            <BodyLong size={'small'}>{'Informer bruker om:'}</BodyLong>
            <TekstListe
                tekster={[
                    'Tiltaket de har fått godkjent tiltakspenger for og perioden det gjelder',
                    'Om det er noe som reduserer retten i deler av perioden de har søkt på',
                    'Eventuelt andre relevante opplysninger som ikke kommer frem i standardtekstene i brevet',
                ]}
            />
        </>
    );
};
