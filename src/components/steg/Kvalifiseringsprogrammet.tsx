import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentKvp } from '../../hooks/useHentKvp';
import { Deltagelse } from '../../types/Kvp';
import { nyPeriodeTilPeriode } from '../../utils/date';

const Kvalifiseringsprogrammet = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { kvp, isLoading } = useHentKvp(behandlingId);

  if (isLoading || !kvp) {
    return <Loader />;
  }

  const deltagelse = kvp.avklartSaksopplysning.periodeMedDeltagelse.deltagelse;
  const vurderingsPeriode = nyPeriodeTilPeriode(kvp.vurderingsperiode);
  const saksopplysningsPeriode = nyPeriodeTilPeriode(
    kvp.avklartSaksopplysning.periodeMedDeltagelse.periode ??
      kvp.søknadSaksopplysning.periodeMedDeltagelse.periode,
  );
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
      <UtfallstekstMedIkon samletUtfall={kvp.samletUtfall} />
      <StegKort
        editerbar={true}
        behandlingId={behandlingId}
        vurderingsperiode={vurderingsPeriode}
        saksopplysningsperiode={saksopplysningsPeriode}
        kilde={kvp.avklartSaksopplysning.kilde}
        utfall={kvp.samletUtfall}
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
};

export default Kvalifiseringsprogrammet;
