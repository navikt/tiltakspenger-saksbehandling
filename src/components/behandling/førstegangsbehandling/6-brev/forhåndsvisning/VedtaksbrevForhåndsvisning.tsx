import { Alert, Button } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { useHentVedtaksbrevForhåndsvisning } from './useHentVedtaksbrevForhåndsvisning';
import { useFørstegangsVedtakSkjema } from '../../context/FørstegangsVedtakContext';
import { useFørstegangsbehandling } from '../../../BehandlingContext';

import style from './VedtaksbrevForhåndsvisning.module.css';
import { Behandlingsutfall } from '../../../../../types/BehandlingTypes';

export const VedtaksbrevForhåndsvisning = () => {
    const { behandling } = useFørstegangsbehandling();
    const vedtak = useFørstegangsVedtakSkjema();

    const { hentForhåndsvisning, forhåndsvisningLaster, forhåndsvisningError } =
        useHentVedtaksbrevForhåndsvisning(behandling);

    return (
        <>
            <Button
                size="small"
                type="button"
                variant="secondary"
                icon={<EnvelopeOpenIcon />}
                className={style.knapp}
                loading={forhåndsvisningLaster}
                onClick={async () => {
                    //Backend vil ignorere perioden dersom vedtaket er avslag, og hvis tilstanden er tilBeslutter (senere enn under behandling)
                    return hentForhåndsvisning({
                        fritekst: vedtak.getBrevtekst(),
                        virkningsperiode: vedtak.behandlingsperiode,
                        barnetillegg: vedtak.harBarnetillegg ? vedtak.barnetilleggPerioder : [],
                        // vi rendrer ikke komponenten hvis utfallet ikke eksiterer i parenten
                        utfall: vedtak.utfall!,
                        avslagsgrunner:
                            vedtak.utfall === Behandlingsutfall.AVSLAG &&
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
