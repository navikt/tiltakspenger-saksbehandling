import { VStack, BodyShort, Loader } from '@navikt/ds-react';
import styles from './Behandlingdetaljer.module.css';
import { useHentBehandlingDeprecated } from '../../hooks/useHentBehandlingDeprecated';
import { periodeTilFormatertDatotekst } from '../../utils/date';
import { useContext } from 'react';
import { BehandlingContextDeprecated } from '../layout/FørstegangsbehandlingLayout';
import { useHentKravfrist } from '../../hooks/vilkår/useHentKravfrist';

const Behandlingdetaljer = () => {
    const { behandlingId } = useContext(BehandlingContextDeprecated);
    const { valgtBehandling, isLoading } = useHentBehandlingDeprecated(behandlingId);
    const { kravfristVilkår } = useHentKravfrist(behandlingId);

    if (isLoading || !valgtBehandling || !kravfristVilkår) {
        return <Loader />;
    }

    const { vurderingsperiode, vilkårssett, stønadsdager, saksbehandler } = valgtBehandling;
    return (
        <>
            <VStack gap="3" className={styles.wrapper}>
                <BodyShort>
                    <b>Vurderingsperiode: </b>
                </BodyShort>
                <BodyShort>{periodeTilFormatertDatotekst(vurderingsperiode)}</BodyShort>
                <BodyShort>
                    <b>Tiltak</b>
                </BodyShort>
                <BodyShort>
                    {vilkårssett.tiltakDeltagelseVilkår.registerSaksopplysning.tiltakNavn}
                </BodyShort>
                <BodyShort>
                    <b>Antall dager per meldeperiode</b>
                </BodyShort>
                <BodyShort>{stønadsdager.registerSaksopplysning.antallDager}</BodyShort>
                <BodyShort>
                    <b>Vurdert av</b>
                </BodyShort>
                <BodyShort>{saksbehandler}</BodyShort>
            </VStack>
        </>
    );
};

export default Behandlingdetaljer;
