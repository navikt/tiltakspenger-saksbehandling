import { Alert, Button } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { BrevForhåndsvisningDTO } from './useHentVedtaksbrevForhåndsvisning';

import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { useEffect, useState } from 'react';

import style from './VedtaksbrevForhåndsvisning.module.css';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { erAvsluttet } from '~/lib/rammebehandling/rammebehandlingUtils';
import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';

type Props = {
    behandling: Rammebehandling;
    hentDto: () => BrevForhåndsvisningDTO;
    validering: ValideringResultat;
    readonly?: boolean;
};

export const VedtaksbrevForhåndsvisning = ({
    behandling,
    hentDto,
    validering,
    readonly,
}: Props) => {
    const { trigger, error, isMutating } = useFetchBlobFraApi<BrevForhåndsvisningDTO>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/forhandsvis`,
        'POST',
        {
            onSuccess: (blob) => {
                window.open(URL.createObjectURL(blob));
            },
        },
    );

    const [showValidationError, setShowValidationError] = useState(false);

    const harValideringsfeil = validering.errors.length > 0;

    useEffect(() => {
        if (!harValideringsfeil) {
            // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
            /* eslint-disable-next-line react-hooks/set-state-in-effect */
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
                loading={isMutating}
                disabled={erAvsluttet(behandling) || readonly}
                onClick={async () => {
                    if (harValideringsfeil) {
                        setShowValidationError(true);
                        return;
                    }

                    return trigger(hentDto());
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
            {error && (
                <Alert
                    variant={'error'}
                    size={'small'}
                    inline={true}
                >{`Feil ved forhåndsvisning av brev: [${error.status}] ${error.message}`}</Alert>
            )}
        </>
    );
};
