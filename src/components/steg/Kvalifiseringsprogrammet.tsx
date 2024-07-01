import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentKvp } from '../../hooks/useHentKvp';
import { Deltagelse } from '../../types/Kvp';

const Kvalifiseringsprogrammet = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { kvp, isLoading } = useHentKvp(behandlingId);

  if (isLoading || !kvp) {
    return <Loader />;
  }

  const vurderingsperiode = {
    fra: new Date('2024-05-10'),
    til: new Date('2024-10-10'),
  };
  const utfall = kvp.samletUtfall;
  const deltagelse = kvp.avklartSaksopplysning.periodeMedDeltagelse.deltagelse;

  return (
    <VStack gap="4">
      <StegHeader
        headertekst={'Kvalifiseringsprogrammet'}
        lovdatatekst={kvp.vilkårLovreferanse.beskrivelse}
        paragraf={kvp.vilkårLovreferanse.paragraf}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <UtfallstekstMedIkon samletUtfall={utfall} />
      <StegKort
        editerbar={true}
        behandlingId={behandlingId}
        vurderingsperiode={vurderingsperiode}
        saksopplysningsperiode={vurderingsperiode}
        kilde={kvp.avklartSaksopplysning.kilde}
        utfall={utfall}
        vilkår={'Kvalifiseringsprogrammet'}
        vilkårTittel={'Kvalifiseringsprogrammet'}
        grunnlag={deltagelseTekst(deltagelse)}
        grunnlagHeader={'Deltar'}
      />
    </VStack>
  );
};

const deltagelseTekst = (deltagelse: Deltagelse): string => {
  switch (deltagelse) {
    case Deltagelse.DELTAR:
      return 'Ja';
    case Deltagelse.DELTAR_IKKE:
      return 'Nei';
  }
}

export default Kvalifiseringsprogrammet;
