import { useSøknadsbehandlingSkjema } from '../context/SøknadsbehandlingVedtakContext';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { søknadsbehandlingValidering } from '~/components/behandling/søknadsbehandling/søknadsbehandlingValidering';
import { SøknadsbehandlingBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';

export const SøknadsbehandlingBrev = () => {
    const { behandling, rolleForBehandling } = useSøknadsbehandling();
    const vedtak = useSøknadsbehandlingSkjema();

    const { brevtekstRef, resultat, avslagsgrunner } = vedtak;

    if (resultat === SøknadsbehandlingResultat.AVSLAG && avslagsgrunner !== null) {
        return null;
    }

    // Backend vil ignorere perioden dersom vedtaket er avslag, og hvis tilstanden er tilBeslutter (senere enn under behandling)
    const forhåndsvisningDto: SøknadsbehandlingBrevForhåndsvisningDTO = {
        fritekst: vedtak.getBrevtekst(),
        virkningsperiode: vedtak.behandlingsperiode,
        barnetillegg: vedtak.harBarnetillegg ? vedtak.barnetilleggPerioder : [],
        // vi rendrer ikke komponenten hvis resultatet ikke eksiterer i parenten
        resultat: vedtak.resultat!,
        avslagsgrunner:
            vedtak.resultat === SøknadsbehandlingResultat.AVSLAG && vedtak.avslagsgrunner !== null
                ? vedtak.avslagsgrunner
                : null,
    };

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for tiltakspenger og barnetillegg'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekstRef}
            validering={søknadsbehandlingValidering(behandling, vedtak)}
            forhåndsvisningDto={forhåndsvisningDto}
            hjelpetekst={<Hjelpetekst />}
        />
    );
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
