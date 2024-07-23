import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { Deltagelse } from '../../types/KvpTypes';
import { useHentKvp } from '../../hooks/vilkår/useHentKvp';

const Kvalifiseringsprogrammet = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { kvp, isLoading } = useHentKvp(behandlingId);

  if (isLoading || !kvp) {
    return <Loader />;
  }

  const deltagelse = kvp.avklartSaksopplysning.periodeMedDeltagelse.deltagelse;
  const saksopplysningsPeriode =
    kvp.avklartSaksopplysning.periodeMedDeltagelse.periode ??
    kvp.søknadSaksopplysning.periodeMedDeltagelse.periode;

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Kvalifiseringsprogrammet'}
        lovdatatekst={kvp.vilkårLovreferanse.beskrivelse}
        paragraf={kvp.vilkårLovreferanse.paragraf}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <UtfallstekstMedIkon samletUtfall={kvp.samletUtfall} />
      <VilkårKort
        saksopplysningsperiode={saksopplysningsPeriode}
        kilde={kvp.avklartSaksopplysning.kilde}
        utfall={kvp.samletUtfall}
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
};

export default Kvalifiseringsprogrammet;
