import { Alert, Button } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { useHentVedtaksbrevForhåndsvisning } from './useHentVedtaksbrevForhåndsvisning';

import style from './VedtaksbrevForhåndsvisning.module.css';
import { useRevurderingVedtak } from '../../../RevurderingVedtakContext';
import { useRevurderingBehandling } from '../../../../BehandlingContext';
import React from 'react';
import { revurderingStansValidering } from '../../../revurderingStansValidering';
import { BehandlingResultat } from '../../../../../../types/BehandlingTypes';

export const VedtaksbrevForhåndsvisning = () => {
    const { behandling } = useRevurderingBehandling();
    const revurderingVedtak = useRevurderingVedtak();

    const { hentForhåndsvisning, forhåndsvisningLaster, forhåndsvisningError } =
        useHentVedtaksbrevForhåndsvisning(behandling);

    const [showValidationError, setShowValidationError] = React.useState(false);
    const validering = revurderingStansValidering(revurderingVedtak);
    const harValideringsfeil = validering.errors.length > 0;

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
                    if (validering.errors.length === 0) {
                        return hentForhåndsvisning({
                            fritekst: revurderingVedtak.brevtekstRef.current?.value ?? '',
                            stansDato: revurderingVedtak.stansdato,
                            valgteHjemler: revurderingVedtak.valgtHjemmelHarIkkeRettighet,
                            resultat: behandling.resultat ?? BehandlingResultat.STANS,
                        }).then((blob) => {
                            if (blob) {
                                window.open(URL.createObjectURL(blob));
                            }
                        });
                    } else {
                        setShowValidationError(true);
                    }
                }}
            >
                Forhåndsvis brev
            </Button>
            {showValidationError &&
                validering.errors.map((error, index) => (
                    <Alert key={index} variant={'error'} size={'small'} inline={true}>
                        {error}
                    </Alert>
                ))}
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
