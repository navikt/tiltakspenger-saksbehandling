import { Button, VStack } from '@navikt/ds-react';
import { useOppdaterMeldekortbehandlingV2 } from '~/lib/meldekort/v2/meldekortbehandling/handlinger/lagre/useOppdaterMeldekortbehandlingV2';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { InfokortEnkel } from '~/lib/_felles/infokort/InfokortEnkel';

import style from './MeldekortbehandlingLagre.module.css';

export const MeldekortbehandlingLagre = () => {
    const { sak, setSak } = useSak();
    const { id } = useMeldekortbehandling();

    const { tilDTO } = useMeldekortbehandlingSkjema();

    const { trigger, error, isMutating } = useOppdaterMeldekortbehandlingV2({
        sakId: sak.sakId,
        meldekortbehandlingId: id,
    });

    return (
        <VStack align={'end'} gap={'space-8'}>
            {error && (
                <InfokortEnkel
                    data-color={'danger'}
                >{`Feil ved lagring: ${error.message} (kode ${error.status})`}</InfokortEnkel>
            )}
            <Button
                loading={isMutating}
                size={'small'}
                onClick={() => {
                    trigger(tilDTO()).then((sak) => {
                        if (sak) {
                            setSak(sak);
                        }
                    });
                }}
                className={style.knapp}
            >
                {'Lagre og beregn'}
            </Button>
        </VStack>
    );
};
