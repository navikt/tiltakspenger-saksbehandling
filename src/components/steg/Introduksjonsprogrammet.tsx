import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { SkjemaFelter } from './OppdaterSaksopplysningForm';
import { useSWRConfig } from 'swr';
import { dateTilISOTekst } from '../../utils/date';

const Introduksjonsprogrammet = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const mutator = useSWRConfig().mutate;

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const intro = valgtBehandling.ytelsessaksopplysninger.saksopplysninger.find(
    (saksopplysning) =>
      saksopplysning.saksopplysningTittel == 'Introduksjonsprogrammet',
  );

  if (!intro) return <Loader />;

  const håndterLagreSaksopplysning = (data: SkjemaFelter) => {
    fetch(`/api/behandling/${behandlingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fra: data.valgtVerdi
          ? dateTilISOTekst(data.periode?.fra)
          : valgtBehandling.vurderingsperiode.fra,
        til: data.valgtVerdi
          ? dateTilISOTekst(data.periode?.til)
          : valgtBehandling.vurderingsperiode.til,
        vilkår: 'INTROPROGRAMMET',
        begrunnelse: data.begrunnelse,
        harYtelse: data.valgtVerdi,
      }),
    }).then(() => {
      mutator(`/api/behandling/${behandlingId}`);
    });
  };

  return (
    <VStack gap="4">
      <StegHeader
        headertekst={'Introduksjonsprogrammet'}
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
      <UtfallstekstMedIkon samletUtfall={intro.utfall} />
      <StegKort
        håndterLagreSaksopplysning={(data: SkjemaFelter) =>
          håndterLagreSaksopplysning(data)
        }
        editerbar={true}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={valgtBehandling.vurderingsperiode}
        kilde={intro.kilde}
        utfall={intro.utfall}
        vilkårTittel={intro.saksopplysningTittel}
        grunnlag={intro.utfall === 'OPPFYLT' ? 'Nei' : 'Ja'}
        grunnlagHeader={'Deltar'}
      />
    </VStack>
  );
};

export default Introduksjonsprogrammet;
