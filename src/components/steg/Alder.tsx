import { BodyShort, HStack, Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import { Utfall } from '../../types/Utfall';
import StegHeader from './StegHeader';
import StegKort from './StegKort';

const Alder = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const saksopplysning = valgtBehandling.alderssaksopplysning;

  if (!saksopplysning) return <Loader />;

  const finnUtfallTekst = (utfall: string) => {
    switch (utfall) {
      case Utfall.IKKE_OPPFYLT:
        return 'ikke oppfylt';
      case Utfall.OPPFYLT:
        return 'oppfylt';
      case Utfall.KREVER_MANUELL_VURDERING:
        return 'uavklart';
      default:
        return 'uavklart';
    }
  };

  return (
    <>
      <StegHeader
        headertekst={saksopplysning.vilkårTittel}
        lovdatatekst="
Tiltakspengeforskriften § 3 Tiltakspenger og barnetillegg"
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <HStack gap="3" align="center" style={{ marginBottom: '1em' }}>
        <UtfallIkon utfall={saksopplysning.utfall} />
        <BodyShort>
          {`Vilkåret er ${finnUtfallTekst(saksopplysning.utfall)} for hele eller deler av perioden`}
        </BodyShort>
      </HStack>
      <StegKort
        behandlingId={valgtBehandling.behandlingId}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={saksopplysning.periode}
        kilde={saksopplysning.kilde}
        utfall={saksopplysning.utfall}
        vilkår={saksopplysning.vilkår}
        vilkårTittel={saksopplysning.vilkårTittel}
      />
    </>
  );
};

export default Alder;
