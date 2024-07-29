import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentIntroduksjonsprogrammet } from '../../hooks/vilkår/useHentIntroduksjonsprogrammet';
import { Deltagelse } from '../../types/KvpTypes';
import VilkårKort from './VilkårKort';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';

const Kvalifiseringsprogrammet = () => {
  const { behandlingId } = useContext(BehandlingContext);
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
        grunnlag={[{ header: 'Deltar', data: deltagelseTekst(deltagelse) }]}
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
