import { Button, VStack } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import React from 'react';
import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';
import { ForhåndsvisMeldekortbehandlingBrevRequest } from '~/lib/meldekort/2-hovedseksjon/behandling/utfylling/meldekortUtfyllingUtils';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { InfokortEnkel } from '~/lib/_felles/infokort/InfokortEnkel';

import style from './MeldekortbehandlingForhåndsvisBrev.module.css';

export const MeldekortbehandlingForhåndsvisBrev = () => {
    const { sakId } = useSak().sak;
    const { id, erAvsluttet } = useMeldekortbehandling();

    const { meldeperioder, textAreas, skalSendeVedtaksbrev } = useMeldekortbehandlingSkjema();

    const { trigger, error, isMutating } =
        useFetchBlobFraApi<ForhåndsvisMeldekortbehandlingBrevRequest>(
            `/sak/${sakId}/meldekortbehandling/${id}/forhandsvis`,
            'POST',
        );

    if (erAvsluttet) {
        return null;
    }

    return (
        <VStack gap={'space-8'} className={style.outer}>
            <Button
                size={'small'}
                variant={'secondary'}
                icon={<EnvelopeOpenIcon />}
                loading={isMutating}
                disabled={!skalSendeVedtaksbrev}
                className={style.knapp}
                onClick={async () => {
                    return trigger({
                        dager: meldeperioder.at(0)!.dager,
                        tekstTilVedtaksbrev: textAreas.brevtekst.getValue(),
                    }).then((blob) => {
                        if (blob) {
                            window.open(URL.createObjectURL(blob));
                        }
                    });
                }}
            >
                {'Forhåndsvis brev'}
            </Button>
            {error && (
                <InfokortEnkel
                    data-color={'danger'}
                >{`Feil ved forhåndsvisning: ${error.message} (${error.status})`}</InfokortEnkel>
            )}
        </VStack>
    );
};
