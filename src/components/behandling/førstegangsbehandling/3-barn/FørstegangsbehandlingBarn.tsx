import { VedtakSeksjon } from '../../vedtak/seksjon/VedtakSeksjon';
import { Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { useFørstegangsbehandling } from '../context/FørstegangsbehandlingContext';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useState } from 'react';
import { BarnetilleggPerioder } from './perioder/BarnetilleggPerioder';
import { classNames } from '../../../../utils/classNames';
import { BarnetilleggBegrunnelse } from './begrunnelse/BarnetilleggBegrunnelse';

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
                    <Heading level={'3'} size={'xsmall'} className={style.header}>
                        {'Barnetillegg'}
                    </Heading>
                </VedtakSeksjon.Venstre>

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
                className={classNames(style.input, !harSøktBarnetillegg && style.skjult)}
            >
                <BarnetilleggPerioder />
                <BarnetilleggBegrunnelse />
            </VedtakSeksjon>
        </>
    );
};
