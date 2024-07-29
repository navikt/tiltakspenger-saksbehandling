import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { Deltagelse } from '../../types/KvpTypes';
import { useHentKvp } from '../../hooks/vilkår/useHentKvp';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';

const Kvalifiseringsprogrammet = () => {
  const { behandlingId } = useContext(BehandlingContext);
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
