import { Alert, Button } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import {
    BrevForhåndsvisningDTO,
    useHentVedtaksbrevForhåndsvisning,
} from './useHentVedtaksbrevForhåndsvisning';
import { BehandlingData } from '~/types/BehandlingTypes';
import { ValideringResultat } from '~/components/behandling/send-og-godkjenn/BehandlingSendTilBeslutning';
import React, { useEffect, useState } from 'react';

import style from './VedtaksbrevForhåndsvisning.module.css';

type Props = {
    behandling: BehandlingData;
    dto: BrevForhåndsvisningDTO;
    validering: ValideringResultat;
};

export const VedtaksbrevForhåndsvisning = ({ behandling, dto, validering }: Props) => {
    const { hentForhåndsvisning, forhåndsvisningLaster, forhåndsvisningError } =
        useHentVedtaksbrevForhåndsvisning(behandling);

    const [showValidationError, setShowValidationError] = useState(false);

    const harValideringsfeil = validering.errors.length > 0;

    useEffect(() => {
        if (!harValideringsfeil) {
            setShowValidationError(false);
        }
    }, [harValideringsfeil]);

    return (
        <>
            <Button
                size={'small'}
                type={'button'}
                variant={'secondary'}
                icon={<EnvelopeOpenIcon />}
                className={style.knapp}
                loading={forhåndsvisningLaster}
                onClick={async () => {
                    if (harValideringsfeil) {
                        setShowValidationError(true);
                        return;
                    }

                    return hentForhåndsvisning(dto).then((blob) => {
                        if (blob) {
                            window.open(URL.createObjectURL(blob));
                        }
                    });
                }}
            >
                {'Forhåndsvis brev'}
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
