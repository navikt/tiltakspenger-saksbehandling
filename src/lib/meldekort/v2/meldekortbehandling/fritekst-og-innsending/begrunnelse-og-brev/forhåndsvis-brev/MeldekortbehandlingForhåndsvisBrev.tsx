import { Button, VStack } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { OppdatertMeldeperiodeDTO } from '~/lib/meldekort/typer/Meldekortbehandling';
import { Nullable } from '~/types/UtilTypes';

import style from './MeldekortbehandlingForhåndsvisBrev.module.css';

export const MeldekortbehandlingForhåndsvisBrev = () => {
    const { sakId } = useSak().sak;
    const { id, erAvsluttet } = useMeldekortbehandling();

    const { meldeperioder, brevtekst, skalSendeVedtaksbrev } = useMeldekortbehandlingSkjema();

    const { trigger, error, isMutating } =
        useFetchBlobFraApi<ForhåndsvisMeldekortbehandlingBrevBody>(
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
                        meldeperioder: meldeperioder.map((mp) => ({
                            kjedeId: mp.kjedeId,
                            dager: mp.dager,
                        })),
                        tekstTilVedtaksbrev: brevtekst.getValue(),
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
                <Infokort
                    data-color={'danger'}
                >{`Feil ved forhåndsvisning: ${error.message} (${error.status})`}</Infokort>
            )}
        </VStack>
    );
};

export type ForhåndsvisMeldekortbehandlingBrevBody = {
    meldeperioder: OppdatertMeldeperiodeDTO[];
    tekstTilVedtaksbrev: Nullable<string>;
};
