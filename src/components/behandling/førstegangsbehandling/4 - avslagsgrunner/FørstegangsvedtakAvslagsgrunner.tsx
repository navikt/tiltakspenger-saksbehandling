import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import {
    useFørstegangsVedtakSkjema,
    useFørstegangsVedtakSkjemaDispatch,
} from '../context/FørstegangsVedtakContext';
import { Avslagsgrunn, Behandlingsutfall } from '../../../../types/BehandlingTypes';
import styles from './FørstegangsvedtakAvslagsgrunner.module.css';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { Separator } from '../../../separator/Separator';
import { useFørstegangsbehandling } from '../../BehandlingContext';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';

export const AvslagsgrunnTekst = {
    [Avslagsgrunn.DeltarIkkePåArbeidsmarkedstiltak]: 'Deltar ikke på arbeidsmarkedstiltak',
    [Avslagsgrunn.Alder]: 'Alder',
    [Avslagsgrunn.Livsoppholdytelser]: 'Livsoppholdytelser',
    [Avslagsgrunn.Kvalifiseringsprogrammet]: 'Kvalifiseringsprogrammet',
    [Avslagsgrunn.Introduksjonsprogrammet]: 'Introduksjonsprogrammet',
    [Avslagsgrunn.LønnFraTiltaksarrangør]: 'Lønn fra tiltaksarrangør',
    [Avslagsgrunn.LønnFraAndre]: 'Lønn fra andre',
    [Avslagsgrunn.Institusjonsopphold]: 'Institusjonsopphold',
    [Avslagsgrunn.FremmetForSent]: 'Fremmet for sent',
};

const FørstegangsvedtakAvslagsgrunner = () => {
    const { rolleForBehandling } = useFørstegangsbehandling();
    const { utfall, avslagsgrunner } = useFørstegangsVedtakSkjema();
    const dispatch = useFørstegangsVedtakSkjemaDispatch();
    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;

    if (utfall !== Behandlingsutfall.AVSLAG) {
        return null;
    }

    return (
        <div>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <CheckboxGroup legend="Avslagsgrunner" className={styles.checkboxGroup}>
                        {Object.values(Avslagsgrunn).map((grunn) => (
                            <Checkbox
                                key={grunn}
                                value={grunn}
                                size={'small'}
                                readOnly={erIkkeSaksbehandler}
                                checked={avslagsgrunner.includes(grunn)}
                                onChange={() => {
                                    dispatch({
                                        type: 'oppdaterAvslagsgrunn',
                                        payload: {
                                            avslagsgrunn: grunn,
                                        },
                                    });
                                }}
                            >
                                {AvslagsgrunnTekst[grunn]}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>
            <Separator />
        </div>
    );
};

export default FørstegangsvedtakAvslagsgrunner;
