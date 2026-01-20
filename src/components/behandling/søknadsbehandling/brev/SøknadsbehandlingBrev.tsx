import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { søknadsbehandlingValidering } from '~/components/behandling/søknadsbehandling/send-og-godkjenn/søknadsbehandlingValidering';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import {
    SøknadsbehandlingSkjemaContext,
    useSøknadsbehandlingSkjema,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { SøknadsbehandlingBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import { useSak } from '~/context/sak/SakContext';

export const SøknadsbehandlingBrev = () => {
    const { sak } = useSak();
    const { behandling } = useSøknadsbehandling();
    const skjema = useSøknadsbehandlingSkjema();

    const { innvilgelseMedHullToggle } = useFeatureToggles();

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for tiltakspenger og barnetillegg'}
            validering={søknadsbehandlingValidering(
                sak,
                behandling,
                skjema,
                innvilgelseMedHullToggle,
            )('tilBeslutning')}
            hentDto={() => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<Hjelpetekst />}
        />
    );
};

const tilForhåndsvisningDTO = (
    skjema: SøknadsbehandlingSkjemaContext,
): SøknadsbehandlingBrevForhåndsvisningDTO => {
    const { resultat } = skjema;

    switch (resultat) {
        case SøknadsbehandlingResultat.AVSLAG: {
            return {
                resultat: SøknadsbehandlingResultat.AVSLAG,
                fritekst: skjema.textAreas.brevtekst.getValue(),
                avslagsgrunner: skjema.avslagsgrunner,
            };
        }

        case SøknadsbehandlingResultat.INNVILGELSE: {
            const { innvilgelse } = skjema;

            if (!innvilgelse.harValgtPeriode) {
                throw Error('Innvilgelsesperioden må være valgt');
            }

            return {
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
                fritekst: skjema.textAreas.brevtekst.getValue(),
                innvilgelsesperioder: innvilgelse.innvilgelsesperioder,
                barnetillegg: innvilgelse.barnetilleggPerioder,
            };
        }

        case SøknadsbehandlingResultat.IKKE_VALGT: {
            throw Error('Kan ikke forhåndsvise uten valgt resultat');
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
