import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

export const SøknadsbehandlingBegrunnelse = () => {
    const { behandling, rolleForBehandling } = useSøknadsbehandling();
    const { begrunnelse } = useBehandlingSkjema().textAreas;

    return (
        <BegrunnelseVilkårsvurdering
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={begrunnelse.ref}
        />
    );
};
