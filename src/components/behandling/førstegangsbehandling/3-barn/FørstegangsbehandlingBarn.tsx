import { VedtakSeksjon } from '../../vedtak/seksjon/VedtakSeksjon';
import { BodyLong, Button, Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { useFørstegangsbehandling } from '../context/FørstegangsbehandlingContext';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useState } from 'react';
import { BarnetilleggPerioder } from './barnetillegg/BarnetilleggPerioder';
import { classNames } from '../../../../utils/classNames';
import { VedtakHjelpetekst } from '../../vedtak/hjelpetekst/VedtakHjelpetekst';

import style from './FørstegangsbehandlingBarn.module.css';

export const FørstegangsbehandlingBarn = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { barnetillegg } = behandling.søknad;

    const [harSøktBarnetillegg, setHarSøktBarnetillegg] = useState(barnetillegg.length > 0);

    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <RadioGroup
                        legend={'Har det blitt søkt om barnetillegg?'}
                        size={'small'}
                        className={style.radioGroup}
                        value={harSøktBarnetillegg}
                        readOnly={erIkkeSaksbehandler}
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
                    <Textarea
                        label={''}
                        hideLabel={true}
                        minRows={10}
                        resize={'vertical'}
                        defaultValue={''}
                        readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                        onChange={(event) => {
                            console.log(event.target.value);
                        }}
                    />
                </VedtakSeksjon.Venstre>
                <VedtakSeksjon.Høyre>
                    <VedtakHjelpetekst header={'Vilkårsvurdering barnetillegg'}>
                        <BodyLong size={'small'}>
                            {'Vurder vilkårene for barnetillegg og noter ned:'}
                        </BodyLong>
                        <ul>
                            <li>
                                {
                                    'Er det noe som begrenser retten? Vis til informasjonen du har funnet, hvordan det endrer retten og paragrafen det gjelder'
                                }
                            </li>
                            <li>{'Eventuelle kommentarer til beslutter'}</li>
                        </ul>
                    </VedtakHjelpetekst>
                </VedtakSeksjon.Høyre>
            </VedtakSeksjon>
        </>
    );
};
