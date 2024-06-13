import { BodyShort, HStack, Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import { Utfall } from '../../types/Utfall';
import { finnUtfallTekst } from '../../utils/tekstformateringUtils';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';

const Introduksjonsprogrammet = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const intro = valgtBehandling.ytelsessaksopplysninger.saksopplysninger.find(
    (saksopplysning) =>
      saksopplysning.saksopplysningTittel == 'Introduksjonsprogrammet',
  );
  if (!intro) return <Loader />;
  return (
    <>
      <StegHeader
        headertekst={intro.saksopplysningTittel}
        lovdatatekst={
          valgtBehandling.ytelsessaksopplysninger.vilkårLovreferanse.beskrivelse
        }
        paragraf={
          valgtBehandling.ytelsessaksopplysninger.vilkårLovreferanse.paragraf
        }
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <HStack gap="3" align="center" style={{ marginBottom: '1em' }}>
        <UtfallIkon utfall={intro.utfall} />
        <BodyShort>
          {`Vilkåret er ${finnUtfallTekst(Utfall.KREVER_MANUELL_VURDERING)} for hele eller deler av perioden`}
        </BodyShort>
      </HStack>
      <StegKort
        editerbar={true}
        behandlingId={valgtBehandling.behandlingId}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={valgtBehandling.vurderingsperiode}
        kilde={intro.kilde}
        utfall={intro.utfall}
        vilkår={intro.saksopplysning}
        vilkårTittel={intro.saksopplysningTittel}
        grunnlag={intro.utfall === 'OPPFYLT' ? 'Nei' : 'Ja'}
        grunnlagHeader={'Deltar'}
      />
    </>
  );
};

export default Introduksjonsprogrammet;
