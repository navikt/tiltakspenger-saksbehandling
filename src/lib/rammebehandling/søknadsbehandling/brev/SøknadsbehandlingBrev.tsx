import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { RammebehandlingVedtaksbrev } from '~/lib/rammebehandling/felles/vedtaksbrev/RammebehandlingVedtaksbrev';
import { søknadsbehandlingValidering } from '~/lib/rammebehandling/søknadsbehandling/handlinger/søknadsbehandlingValidering';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/lib/_felles/liste/TekstListe';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import {
    SøknadsbehandlingSkjemaContext,
    useSøknadsbehandlingSkjema,
} from '~/lib/rammebehandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import {
    SøknadsbehandlingAvslagBrevForhåndsvisningDTO,
    SøknadsbehandlingBrevForhåndsvisningDTO,
    SøknadsbehandlingInnvilgelseBrevForhåndsvisningDTO,
} from '~/lib/rammebehandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { useSak } from '~/lib/sak/SakContext';

export const SøknadsbehandlingBrev = () => {
    const { sak } = useSak();
    const { behandling } = useSøknadsbehandling();
    const skjema = useSøknadsbehandlingSkjema();

    return (
        <RammebehandlingVedtaksbrev
            tittel={'Vedtaksbrev for tiltakspenger og barnetillegg'}
            validering={søknadsbehandlingValidering(sak, behandling, skjema)('tilBeslutning')}
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
            } satisfies SøknadsbehandlingAvslagBrevForhåndsvisningDTO;
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
                barnetillegg: innvilgelse.harBarnetillegg ? innvilgelse.barnetilleggPerioder : null,
            } satisfies SøknadsbehandlingInnvilgelseBrevForhåndsvisningDTO;
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
                size={'small'}
            />
        </>
    );
};
