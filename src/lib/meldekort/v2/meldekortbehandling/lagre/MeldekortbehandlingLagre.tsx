import { BodyShort, Button, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useMeldekortbehandlingSkjemaLagring } from '~/lib/meldekort/v2/meldekortbehandling/lagre/MeldekortbehandlingLagringProvider';
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
            <VStack gap={'space-4'}>
                <BodyShort
                    size={'small'}
                >{`Sist lagret: ${formaterTidspunktMedSekunder(sistEndret)}`}</BodyShort>

                <InlineMessage status={'warning'} className={classNames(!isDirty && style.skjult)}>
                    {'Du har ulagrede endringer'}
                </InlineMessage>
            </VStack>

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
