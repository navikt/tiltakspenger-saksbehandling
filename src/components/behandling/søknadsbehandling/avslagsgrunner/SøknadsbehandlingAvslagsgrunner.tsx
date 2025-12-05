import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Separator } from '../../../separator/Separator';
import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { Avslagsgrunn } from '~/types/Søknadsbehandling';
import {
    useSøknadsbehandlingAvslagSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';
import styles from './SøknadsbehandlingAvslagsgrunner.module.css';

export const SøknadsbehandlingAvslagsgrunner = () => {
    const { rolleForBehandling, behandling } = useSøknadsbehandling();
    const { avslagsgrunner } = useSøknadsbehandlingAvslagSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();

    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;
    const erUnderBehandling = behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING;

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <CheckboxGroup
                        legend="Avslagsgrunner"
                        className={styles.checkboxGroup}
                        value={avslagsgrunner}
                        readOnly={erIkkeSaksbehandler || !erUnderBehandling}
                        onChange={(avslagsgrunner: Avslagsgrunn[]) => {
                            dispatch({
                                type: 'oppdaterAvslagsgrunner',
                                payload: {
                                    avslagsgrunner,
                                },
                            });
                        }}
                    >
                        {Object.values(Avslagsgrunn).map((grunn) => (
                            <Checkbox key={grunn} value={grunn} size={'small'}>
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

const AvslagsgrunnTekst: Record<Avslagsgrunn, string> = {
    [Avslagsgrunn.DeltarIkkePåArbeidsmarkedstiltak]: 'Deltar ikke på arbeidsmarkedstiltak',
    [Avslagsgrunn.Alder]: 'Alder',
    [Avslagsgrunn.Livsoppholdytelser]: 'Livsoppholdytelser',
    [Avslagsgrunn.Kvalifiseringsprogrammet]: 'Kvalifiseringsprogrammet',
    [Avslagsgrunn.Introduksjonsprogrammet]: 'Introduksjonsprogrammet',
    [Avslagsgrunn.LønnFraTiltaksarrangør]: 'Lønn fra tiltaksarrangør',
    [Avslagsgrunn.LønnFraAndre]: 'Lønn fra andre',
    [Avslagsgrunn.Institusjonsopphold]: 'Institusjonsopphold',
    [Avslagsgrunn.FremmetForSent]: 'Fremmet for sent',
} as const;
