import { Button, VStack } from '@navikt/ds-react';
import { useOppdaterMeldekortbehandlingV2 } from '~/lib/meldekort/v2/meldekortbehandling/lagre/useOppdaterMeldekortbehandlingV2';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import style from './MeldekortbehandlingLagre.module.css';

type Props = {
    tekst: string;
};

export const MeldekortbehandlingLagre = ({ tekst }: Props) => {
    const { sak, setSak } = useSak();
    const { id } = useMeldekortbehandling();

    const { tilDTO, erReadonly } = useMeldekortbehandlingSkjema();

    const { trigger, error, isMutating } = useOppdaterMeldekortbehandlingV2({
        sakId: sak.sakId,
        meldekortbehandlingId: id,
    });

    return (
        <VStack align={'end'} gap={'space-8'}>
            {error && (
                <Infokort
                    data-color={'danger'}
                >{`Feil ved lagring: ${error.message} (kode ${error.status})`}</Infokort>
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
                disabled={erReadonly}
            >
                {tekst}
            </Button>
        </VStack>
    );
};
