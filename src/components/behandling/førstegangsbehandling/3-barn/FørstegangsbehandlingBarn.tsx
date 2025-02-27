import { VedtakSeksjon } from '../../vedtak/seksjon/VedtakSeksjon';
import { BodyLong, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { useFørstegangsbehandling } from '../context/FørstegangsbehandlingContext';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useState } from 'react';
import { BarnetilleggPerioder } from './barnetillegg/BarnetilleggPerioder';
import { classNames } from '../../../../utils/classNames';
import { VedtakHjelpetekst } from '../../vedtak/hjelpetekst/VedtakHjelpetekst';
import { BarnetilleggBegrunnelse } from './begrunnelse/BarnetilleggBegrunnelse';
import { TekstListe } from '../../../liste/TekstListe';

import style from './FørstegangsbehandlingBarn.module.css';

export const FørstegangsbehandlingBarn = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { søknad } = behandling;
    const { barnetillegg } = søknad;

    const [harSøktBarnetillegg, setHarSøktBarnetillegg] = useState(barnetillegg.length > 0);

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <RadioGroup
                        legend={'Har det blitt søkt om barnetillegg?'}
                        size={'small'}
                        className={style.radioGroup}
                        value={harSøktBarnetillegg}
                        readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                        onChange={(harSøkt: boolean) => {
                            setHarSøktBarnetillegg(harSøkt);
                        }}
                    >
                        <Radio value={true}>{'Ja'}</Radio>
                        <Radio value={false}>{'Nei'}</Radio>
                    </RadioGroup>
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>

            <VedtakSeksjon
                className={classNames(style.barnetillegg, !harSøktBarnetillegg && style.skjult)}
            >
                <VedtakSeksjon.Venstre>
                    <Heading level={'3'} size={'xsmall'} className={style.header}>
                        {'Barnetillegg'}
                    </Heading>
                </VedtakSeksjon.Venstre>
                <BarnetilleggPerioder />
                <VedtakSeksjon.Venstre>
                    <Button variant={'secondary'} size={'small'} className={style.knapp}>
                        {'Ny periode for barnetillegg'}
                    </Button>
                </VedtakSeksjon.Venstre>

                <BarnetilleggBegrunnelse />

                <VedtakSeksjon.Høyre>
                    <VedtakHjelpetekst header={'Vilkårsvurdering barnetillegg'}>
                        <BodyLong size={'small'}>
                            {'Vurder vilkårene for barnetillegg og noter ned:'}
                        </BodyLong>
                        <TekstListe
                            tekster={[
                                'Er det noe som begrenser retten? Vis til informasjonen du har funnet, hvordan det endrer retten og paragrafen det gjelder',
                                'Eventuelle kommentarer til beslutter',
                            ]}
                        />
                    </VedtakHjelpetekst>
                </VedtakSeksjon.Høyre>
            </VedtakSeksjon>
        </>
    );
};
