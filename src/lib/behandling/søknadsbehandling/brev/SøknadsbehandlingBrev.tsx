import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { Vedtaksbrev } from '~/lib/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { søknadsbehandlingValidering } from '~/lib/behandling/søknadsbehandling/send-og-godkjenn/søknadsbehandlingValidering';
import { BodyLong, Checkbox, Heading, HStack } from '@navikt/ds-react';
import { TekstListe } from '~/lib/_felles/liste/TekstListe';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import {
    SøknadsbehandlingSkjemaContext,
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '~/lib/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import {
    SøknadsbehandlingAvslagBrevForhåndsvisningDTO,
    SøknadsbehandlingBrevForhåndsvisningDTO,
    SøknadsbehandlingInnvilgelseBrevForhåndsvisningDTO,
} from '~/lib/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { useSak } from '~/context/sak/SakContext';

export const SøknadsbehandlingBrev = () => {
    const { sak } = useSak();
    const { behandling } = useSøknadsbehandling();
    const skjema = useSøknadsbehandlingSkjema();

    const dispatch = useSøknadsbehandlingSkjemaDispatch();

    return (
        <Vedtaksbrev
            header={
                <HStack justify="space-between" align="center">
                    <Heading size={'xsmall'} level={'2'}>
                        Vedtaksbrev for tiltakspenger og barnetillegg
                    </Heading>

                    <Checkbox
                        readOnly={skjema.erReadonly}
                        onChange={(e) =>
                            dispatch({
                                type: 'setSkalSendeVedtaksbrev',
                                payload: { skalSendeVedtaksbrev: !e.target.checked },
                            })
                        }
                        checked={
                            (skjema.resultat === SøknadsbehandlingResultat.INNVILGELSE &&
                                skjema.innvilgelse.harValgtPeriode &&
                                !skjema.innvilgelse.skalSendeVedtaksbrev) ||
                            (skjema.resultat === SøknadsbehandlingResultat.AVSLAG &&
                                !skjema.skalSendeVedtaksbrev)
                        }
                    >
                        Ikke send vedtaksbrev
                    </Checkbox>
                </HStack>
            }
            validering={søknadsbehandlingValidering(sak, behandling, skjema)('tilBeslutning')}
            hentDto={() => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<Hjelpetekst />}
            readonly={
                skjema.erReadonly ||
                (skjema.resultat === SøknadsbehandlingResultat.INNVILGELSE &&
                    skjema.innvilgelse.harValgtPeriode &&
                    !skjema.innvilgelse.skalSendeVedtaksbrev) ||
                (skjema.resultat === SøknadsbehandlingResultat.AVSLAG &&
                    !skjema.skalSendeVedtaksbrev)
            }
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
            />
        </>
    );
};
