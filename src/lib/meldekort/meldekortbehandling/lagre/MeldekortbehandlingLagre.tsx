import { Button, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useMeldekortbehandlingSkjemaLagring } from '~/lib/meldekort/meldekortbehandling/lagre/MeldekortbehandlingLagringProvider';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';
import { OppdaterMeldekortbehandlingDTO } from '~/lib/meldekort/typer/Meldekortbehandling';
import { classNames } from '~/utils/classNames';
import { formaterTidspunktMedSekunder } from '~/utils/date';

import style from './MeldekortbehandlingLagre.module.css';

export const MeldekortbehandlingLagre = () => {
    const { sak, setSak } = useSak();
    const { id, sistEndret } = useMeldekortbehandling();

    const { erReadonly } = useMeldekortbehandlingSkjema();
    const { dto, isDirty } = useMeldekortbehandlingSkjemaLagring();

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        SakProps,
        OppdaterMeldekortbehandlingDTO
    >(`/sak/${sak.sakId}/meldekort/${id}/oppdater`, 'POST');

    return (
        <HStack
            justify={'space-between'}
            gap={'space-16'}
            className={classNames(style.outer, isDirty && style.dirty)}
        >
            <HStack gap={'space-8'} align={'center'}>
                <InlineMessage status={isDirty ? 'warning' : 'success'}>
                    {isDirty ? 'Du har ulagrede endringer - ' : ''}
                    {`Sist lagret: ${formaterTidspunktMedSekunder(sistEndret)}`}
                </InlineMessage>
            </HStack>

            <VStack align={'end'} gap={'space-8'}>
                <Button
                    loading={isMutating}
                    onClick={() => {
                        trigger(dto).then((sak) => {
                            if (sak) {
                                setSak(sak);
                            }
                        });
                    }}
                    className={classNames(style.knapp, isDirty && style.dirty)}
                    disabled={erReadonly}
                >
                    {'Lagre og oppdater beregning'}
                </Button>
                {error && (
                    <Infokort variant={'feil'}>
                        {`Feil ved lagring: ${error.message} (kode ${error.status})`}
                    </Infokort>
                )}
            </VStack>
        </HStack>
    );
};
