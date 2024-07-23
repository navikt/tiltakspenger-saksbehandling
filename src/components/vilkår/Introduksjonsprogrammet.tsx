import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import VilkårHeader from './VilkårHeader';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentIntroduksjonsprogrammet } from '../../hooks/vilkår/useHentIntroduksjonsprogrammet';
import { Deltagelse } from '../../types/KvpTypes';
import VilkårKort from './VilkårKort';

const Kvalifiseringsprogrammet = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { intro, isLoading } = useHentIntroduksjonsprogrammet(behandlingId);

  if (isLoading || !intro) {
    return <Loader />;
  }
  const deltagelse =
    intro.avklartSaksopplysning.periodeMedDeltagelse.deltagelse;
  const saksopplysningsPeriode =
    intro.avklartSaksopplysning.periodeMedDeltagelse.periode ??
    intro.søknadSaksopplysning.periodeMedDeltagelse.periode;
  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Introduksjonsprogrammet'}
        lovdatatekst={intro.vilkårLovreferanse.beskrivelse}
        paragraf={intro.vilkårLovreferanse.paragraf}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <UtfallstekstMedIkon samletUtfall={intro.samletUtfall} />
      <VilkårKort
        saksopplysningsperiode={saksopplysningsPeriode}
        kilde={intro.avklartSaksopplysning.kilde}
        utfall={intro.samletUtfall}
        vilkårTittel={'Introduksjonsprogrammet'}
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
};

export default Kvalifiseringsprogrammet;
