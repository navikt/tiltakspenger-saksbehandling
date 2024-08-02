import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentInstitusjonsopphold } from '../../hooks/vilkår/useHentInstitusjonsopphold';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import Varsel from '../varsel/Varsel';

const Institusjonsopphold = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { institusjonsopphold, isLoading, error } =
    useHentInstitusjonsopphold(behandlingId);

  if (isLoading || !institusjonsopphold) {
    return <Loader />;
  } else if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke hente institusjonsoppholdvilkår (${error.status} ${error.info})`}
      />
    );

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Institusjonsopphold'}
        lovdatatekst="Opphold i institusjon, fengsel mv."
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={'§9'}
      />
      <UtfallstekstMedIkon samletUtfall={institusjonsopphold.samletUtfall} />
      <VilkårKort
        saksopplysningsperiode={
          institusjonsopphold.søknadSaksopplysning.periodeMedOpphold.periode
        }
        kilde={institusjonsopphold.søknadSaksopplysning.kilde}
        utfall={institusjonsopphold.samletUtfall}
        vilkårTittel={'Institusjonsopphold'}
        grunnlag={[
          {
            header: 'Opphold',
            data: institusjonsopphold.samletUtfall === 'OPPFYLT' ? 'Nei' : 'Ja',
          },
        ]}
      />
    </VStack>
  );
};

export default Institusjonsopphold;
