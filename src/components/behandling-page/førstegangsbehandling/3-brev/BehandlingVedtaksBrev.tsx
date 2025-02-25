import { Button, Textarea } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useFørstegangsbehandling } from '../FørstegangsbehandlingContext';
import useSWRMutation from 'swr/mutation';
import style from './BehandlingVedtaksBrev.module.css';
import { FetcherError, throwErrorIfFatal } from '../../../../utils/client-fetch';
import { Periode } from '../../../../types/Periode';

const fetchForhåndsvisVedtaksbrev = async (
    url: string,
    body: { arg: { fritekst: string; virkningsperiode: Periode } },
): Promise<Blob> => {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            fritekst: body.arg.fritekst,
            virkningsperiode: body.arg.virkningsperiode,
        }),
    });
    await throwErrorIfFatal(res);
    return res.blob();
};

export const BehandlingVedtaksBrev = () => {
    const { setBrevTekst, behandling, vedtak, rolleForBehandling } = useFørstegangsbehandling();
    const { fritekstTilVedtaksbrev } = behandling;

    const forhåndsvisVedtaksbrevMutation = useSWRMutation<
        Blob,
        FetcherError,
        string,
        { fritekst: string; virkningsperiode: Periode }
    >(
        `/api/sak/${behandling.sakId}/behandling/${behandling.id}/forhandsvis`,
        fetchForhåndsvisVedtaksbrev,
        {
            onSuccess(b) {
                return window.open(URL.createObjectURL(b));
            },
        },
    );

    return (
        <>
            <Textarea
                label={'Tekst til vedtaksbrev'}
                description={'Teksten vises i vedtaksbrevet til bruker.'}
                size={'small'}
                minRows={10}
                resize={'vertical'}
                defaultValue={fritekstTilVedtaksbrev ?? ''}
                readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                onChange={(event) => setBrevTekst(event.target.value)}
            />
            <Button
                size="small"
                type="button"
                variant="secondary"
                icon={<EnvelopeOpenIcon />}
                className={style.knapp}
                loading={forhåndsvisVedtaksbrevMutation.isMutating}
                onClick={() =>
                    //Backend vil ignorere perioden dersom vedtaket er avslag, og hvis tilstanden er tilBeslutter (senere enn under behandling)
                    forhåndsvisVedtaksbrevMutation.trigger({
                        fritekst: vedtak.fritekstTilVedtaksbrev,
                        virkningsperiode: vedtak.innvilgelsesPeriode,
                    })
                }
            >
                Forhåndsvis brev
            </Button>
        </>
    );
};
