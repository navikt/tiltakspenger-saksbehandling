import { useSøknadsbehandling } from '../../context/BehandlingContext';

import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { søknadsbehandlingValidering } from '~/components/behandling/søknadsbehandling/9-send-og-godkjenn/søknadsbehandlingValidering';
import { SøknadsbehandlingBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';
import {
    BehandlingSkjemaContext,
    useBehandlingSkjema,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { Periode } from '~/types/Periode';
import { BehandlingResultat } from '~/types/Behandling';
import { barnetilleggPeriodeFormDataTilBarnetilleggPeriode } from '../../revurdering/innvilgelse/6-brev/RevurderingInnvilgelseBrev';

export const SøknadsbehandlingBrev = () => {
    const { behandling, rolleForBehandling } = useSøknadsbehandling();
    const skjema = useBehandlingSkjema();

    const { brevtekst } = skjema.textAreas;

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for tiltakspenger og barnetillegg'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekst.ref}
            validering={søknadsbehandlingValidering(behandling, skjema)('tilBeslutning')}
            hentDto={(): SøknadsbehandlingBrevForhåndsvisningDTO =>
                søknadsbehandlingSkjemaTilBrevForhåndsvisningDTO(skjema)
            }
            hjelpetekst={<Hjelpetekst />}
        />
    );
};

const søknadsbehandlingSkjemaTilBrevForhåndsvisningDTO = (
    skjema: BehandlingSkjemaContext,
): SøknadsbehandlingBrevForhåndsvisningDTO => {
    return {
        fritekst: skjema.textAreas.brevtekst.getValue(),
        // Backend vil ignorere perioden dersom vedtaket er avslag, og hvis tilstanden er tilBeslutter (senere enn under behandling)
        virkningsperiode: skjema.behandlingsperiode as Periode,
        barnetillegg:
            skjema.resultat === BehandlingResultat.INNVILGELSE && skjema.harBarnetillegg
                ? barnetilleggPeriodeFormDataTilBarnetilleggPeriode(skjema.barnetilleggPerioder)
                : null,
        // vi rendrer ikke komponenten hvis resultatet ikke eksiterer i parenten
        resultat: skjema.resultat! as BehandlingResultat,
        avslagsgrunner:
            skjema.resultat === BehandlingResultat.AVSLAG && skjema.avslagsgrunner !== null
                ? skjema.avslagsgrunner
                : null,
    };
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
