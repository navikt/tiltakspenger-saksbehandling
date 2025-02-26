import { BodyLong, Button, Heading, Textarea } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import {
    useFørstegangsbehandling,
    useFørstegangsVedtakDispatch,
} from '../context/FørstegangsbehandlingContext';
import { VedtakSeksjon } from '../../vedtak/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '../../vedtak/hjelpetekst/VedtakHjelpetekst';

import style from './FørstegangsbehandlingBrev.module.css';
import { Periode } from '../../../../types/Periode';
import useSWRMutation from 'swr/mutation';
import { FetcherError } from '../../../../utils/fetch';

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

    return res.blob();
};

export const FørstegangsbehandlingBrev = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { fritekstTilVedtaksbrev } = behandling;
    const dispatch = useFørstegangsVedtakDispatch();

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
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'}>
                    {'Tekst til vedtaksbrev'}
                </Heading>
                <BodyLong size={'small'}>{'Teksten vises i vedtaksbrevet til bruker.'}</BodyLong>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Venstre className={style.brev}>
                <Textarea
                    label={'Tekst til vedtaksbrev'}
                    hideLabel={true}
                    description={'Teksten vises i vedtaksbrevet til bruker.'}
                    size={'small'}
                    minRows={10}
                    resize={'vertical'}
                    defaultValue={fritekstTilVedtaksbrev ?? ''}
                    readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                    onChange={(event) => {
                        dispatch({
                            type: 'setBrevtekst',
                            payload: { brevtekst: event.target.value },
                        });
                    }}
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
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst header={'Tekst i brev'}>
                    <BodyLong size={'small'}>{'Informer bruker om:'}</BodyLong>
                    <ul>
                        <li>
                            {
                                'Tiltaket de har fått godkjent tiltakspenger for og perioden det gjelder'
                            }
                        </li>
                        <li>
                            {
                                'Om det er noe som reduserer retten i deler av perioden de har søkt på'
                            }
                        </li>
                        <li>
                            {
                                'Eventuelt andre relevante opplysninger som ikke kommer frem i standardtekstene i brevet'
                            }
                        </li>
                    </ul>
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
