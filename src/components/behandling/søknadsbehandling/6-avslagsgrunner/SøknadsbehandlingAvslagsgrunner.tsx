import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '../context/SøknadsbehandlingVedtakContext';
import { Avslagsgrunn, SøknadsbehandlingResultat } from '../../../../types/BehandlingTypes';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Separator } from '../../../separator/Separator';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';

import styles from './SøknadsbehandlingAvslagsgrunner.module.css';

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

const SøknadsbehandlingAvslagsgrunner = () => {
    const { rolleForBehandling } = useSøknadsbehandling();
    const { resultat, avslagsgrunner } = useSøknadsbehandlingSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();
    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;

    if (resultat !== SøknadsbehandlingResultat.AVSLAG) {
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
                                checked={avslagsgrunner !== null && avslagsgrunner.includes(grunn)}
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

export default SøknadsbehandlingAvslagsgrunner;
