import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Separator } from '../../../separator/Separator';
import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

import styles from './SøknadsbehandlingAvslagsgrunner.module.css';
import { RammebehandlingResultatType } from '~/types/Behandling';
import { Avslagsgrunn } from '~/types/Søknadsbehandling';

const AvslagsgrunnTekst = {
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

export const SøknadsbehandlingAvslagsgrunner = () => {
    const { rolleForBehandling } = useSøknadsbehandling();
    const { resultat, avslagsgrunner } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();
    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;

    if (resultat !== RammebehandlingResultatType.AVSLAG) {
        return null;
    }

    return (
        <>
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
        </>
    );
};
