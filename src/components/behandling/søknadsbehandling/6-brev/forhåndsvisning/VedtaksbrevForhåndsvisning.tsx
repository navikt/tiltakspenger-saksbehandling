import { Alert, Button } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { useHentVedtaksbrevForhåndsvisning } from './useHentVedtaksbrevForhåndsvisning';
import { useSøknadsbehandlingSkjema } from '../../context/SøknadsbehandlingVedtakContext';
import { useSøknadsbehandling } from '../../../BehandlingContext';
import { søknadsbehandlingValidering } from '../../søknadsbehandlingValidering';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';

import style from './VedtaksbrevForhåndsvisning.module.css';

export const VedtaksbrevForhåndsvisning = () => {
    const { behandling } = useSøknadsbehandling();
    const vedtak = useSøknadsbehandlingSkjema();

    const { hentForhåndsvisning, forhåndsvisningLaster, forhåndsvisningError } =
        useHentVedtaksbrevForhåndsvisning(behandling);

    const valideringResultat = søknadsbehandlingValidering(behandling, vedtak);
    const harValideringsfeil = valideringResultat.errors.length > 0;

    return (
        <>
            <Button
                size="small"
                type="button"
                variant="secondary"
                icon={<EnvelopeOpenIcon />}
                className={style.knapp}
                disabled={harValideringsfeil}
                loading={forhåndsvisningLaster}
                onClick={async () => {
                    //Backend vil ignorere perioden dersom vedtaket er avslag, og hvis tilstanden er tilBeslutter (senere enn under behandling)
                    return hentForhåndsvisning({
                        fritekst: vedtak.getBrevtekst(),
                        virkningsperiode: vedtak.behandlingsperiode,
                        barnetillegg: vedtak.harBarnetillegg ? vedtak.barnetilleggPerioder : [],
                        // vi rendrer ikke komponenten hvis resultatet ikke eksiterer i parenten
                        resultat: vedtak.resultat!,
                        avslagsgrunner:
                            vedtak.resultat === SøknadsbehandlingResultat.AVSLAG &&
                            vedtak.avslagsgrunner !== null
                                ? vedtak.avslagsgrunner
                                : null,
                    }).then((blob) => {
                        if (blob) {
                            window.open(URL.createObjectURL(blob));
                        }
                    });
                }}
            >
                Forhåndsvis brev
            </Button>
            {forhåndsvisningError && (
                <Alert
                    variant={'error'}
                    size={'small'}
                    inline={true}
                >{`Feil ved forhåndsvisning av brev: [${forhåndsvisningError.status}] ${forhåndsvisningError.message}`}</Alert>
            )}
        </>
    );
};
