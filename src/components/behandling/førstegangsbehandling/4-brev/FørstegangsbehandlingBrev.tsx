import { BodyLong, Button, Heading, Textarea } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useFørstegangsbehandling } from '../context/FørstegangsbehandlingContext';
import { VedtakSeksjon } from '../../vedtak/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '../../vedtak/hjelpetekst/VedtakHjelpetekst';

import style from './FørstegangsbehandlingBrev.module.css';

export const FørstegangsbehandlingBrev = () => {
    const { dispatch, behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { fritekstTilVedtaksbrev } = behandling;

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
                    size={'small'}
                    variant={'secondary'}
                    icon={<EnvelopeOpenIcon />}
                    className={style.knapp}
                >
                    {'Forhåndsvis brev'}
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
