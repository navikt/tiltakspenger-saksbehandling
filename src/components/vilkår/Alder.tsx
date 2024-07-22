import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import StegHeader from './VilkårHeader';
import StegKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentAlder } from '../../hooks/vilkår/useHentAlder';
import { nyPeriodeTilPeriode } from '../../utils/date';

const Alder = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { alderVilkår, isLoading } = useHentAlder(behandlingId);

  if (isLoading || !alderVilkår) {
    return <Loader />;
  }

  const vurderingsperiode = nyPeriodeTilPeriode(alderVilkår.vurderingsperiode)

  return (
    <VStack gap="4">
      <StegHeader
        headertekst={alderVilkår.vilkårLovreferanse.beskrivelse}
        lovdatatekst={alderVilkår.vilkårLovreferanse.lovverk}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={alderVilkår.vilkårLovreferanse.paragraf}
      />
      <UtfallstekstMedIkon samletUtfall={alderVilkår.samletUtfall} />
      <StegKort
        editerbar={false}
        håndterLagreSaksopplysning={() => console.log()}
        vurderingsperiode={vurderingsperiode}
        saksopplysningsperiode={vurderingsperiode}
        kilde={alderVilkår.avklartSaksopplysning.kilde}
        utfall={alderVilkår.samletUtfall}
        vilkårTittel={'Alder'}
        grunnlag={alderVilkår.avklartSaksopplysning.fødselsdato}
        grunnlagHeader={'Fødselsdato'}
      />
    </VStack>
  );
};

export default Alder;
