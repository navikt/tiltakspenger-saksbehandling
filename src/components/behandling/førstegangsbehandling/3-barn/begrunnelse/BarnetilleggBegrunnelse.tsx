import { VedtakSeksjon } from '../../../vedtak/seksjon/VedtakSeksjon';
import { BodyLong, Heading } from '@navikt/ds-react';
import style from '../FørstegangsbehandlingBarn.module.css';
import { TekstfeltMedMellomlagring } from '../../../../tekstfelt/TekstfeltMedMellomlagring';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import { VedtakBarnetilleggDTO } from '../../../../../types/VedtakTyper';
import {
    useFørstegangsbehandling,
    useFørstegangsVedtakDispatch,
} from '../../context/FørstegangsbehandlingContext';

export const BarnetilleggBegrunnelse = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { sakId, id } = behandling;

    const dispatch = useFørstegangsVedtakDispatch();

    return (
        <>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'} className={style.header}>
                    {'Begrunnelse vilkårsvurdering barnetillegg'}
                </Heading>
                <BodyLong size={'small'}>{'Noter ned vurderingen.'}</BodyLong>
                <BodyLong size={'small'} className={style.personinfoVarsel}>
                    {'Ikke skriv personsensitiv informasjon som ikke er relevant for saken.'}
                </BodyLong>
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Venstre>
                <TekstfeltMedMellomlagring
                    label={'Begrunnelse vilkårsvurdering barnetillegg'}
                    defaultValue={''}
                    readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                    lagringUrl={`/sak/${sakId}/behandling/${id}/barnetillegg`}
                    lagringBody={(tekst) =>
                        ({ begrunnelse: tekst }) satisfies VedtakBarnetilleggDTO
                    }
                    onChange={(event) => {
                        dispatch({
                            type: 'setBarnetilleggBegrunnelse',
                            payload: {
                                begrunnelse: event.target.value,
                            },
                        });
                    }}
                />
            </VedtakSeksjon.Venstre>
        </>
    );
};
