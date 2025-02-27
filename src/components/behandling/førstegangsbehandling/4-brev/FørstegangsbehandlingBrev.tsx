import { Alert, BodyLong, Button, Heading } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import {
    useFørstegangsbehandling,
    useFørstegangsVedtakDispatch,
    useFørstegangsVedtakSkjema,
} from '../context/FørstegangsbehandlingContext';
import { VedtakSeksjon } from '../../vedtak/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '../../vedtak/hjelpetekst/VedtakHjelpetekst';
import { TekstfeltMedMellomlagring } from '../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBrevFritekstDTO } from '../../../../types/VedtakTyper';
import { useHentVedtaksbrevForhåndsvisning } from './useHentVedtaksbrevForhåndsvisning';

import style from './FørstegangsbehandlingBrev.module.css';

export const FørstegangsbehandlingBrev = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { fritekstTilVedtaksbrev, sakId, id } = behandling;

    const vedtak = useFørstegangsVedtakSkjema();
    const dispatch = useFørstegangsVedtakDispatch();

    const { hentForhåndsvisning, forhåndsvisningLaster, forhåndsvisningError } =
        useHentVedtaksbrevForhåndsvisning(behandling);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'}>
                    {'Tekst til vedtaksbrev'}
                </Heading>
                <BodyLong size={'small'}>{'Teksten vises i vedtaksbrevet til bruker.'}</BodyLong>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Venstre className={style.brev}>
                <TekstfeltMedMellomlagring
                    description={'Teksten vises i vedtaksbrevet til bruker.'}
                    defaultValue={fritekstTilVedtaksbrev ?? ''}
                    readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                    lagringUrl={`/sak/${sakId}/behandling/${id}/fritekst`}
                    lagringBody={(tekst) => ({ fritekst: tekst }) satisfies VedtakBrevFritekstDTO}
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
                    loading={forhåndsvisningLaster}
                    onClick={() =>
                        //Backend vil ignorere perioden dersom vedtaket er avslag, og hvis tilstanden er tilBeslutter (senere enn under behandling)
                        hentForhåndsvisning({
                            fritekst: vedtak.fritekstTilVedtaksbrev,
                            virkningsperiode: vedtak.innvilgelsesPeriode,
                        }).then((blob) => {
                            if (blob) {
                                window.open(URL.createObjectURL(blob));
                            }
                        })
                    }
                >
                    Forhåndsvis brev
                </Button>
                {forhåndsvisningError && (
                    <Alert
                        variant={'error'}
                        size={'small'}
                        inline={true}
                    >{`Feil ved forhåndsvisning av brev: [${forhåndsvisningError.status}] ${forhåndsvisningError.message}`}</Alert>
                )}
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
