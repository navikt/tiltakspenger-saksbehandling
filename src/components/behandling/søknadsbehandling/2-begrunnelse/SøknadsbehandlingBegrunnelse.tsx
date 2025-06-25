import { useSøknadsbehandlingSkjema } from '../context/SøknadsbehandlingVedtakContext';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';

export const SøknadsbehandlingBegrunnelse = () => {
    const { behandling, rolleForBehandling } = useSøknadsbehandling();
    const { begrunnelseRef } = useSøknadsbehandlingSkjema();

    return (
        <BegrunnelseVilkårsvurdering
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={begrunnelseRef}
        />
    );
};
