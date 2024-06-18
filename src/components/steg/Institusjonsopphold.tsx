import { BodyShort, HStack, Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import { finnUtfallTekst } from '../../utils/tekstformateringUtils';

const Institusjonsopphold = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const saksopplysning =
    valgtBehandling.ytelsessaksopplysninger.saksopplysninger.find(
      (saksopplysning) =>
        saksopplysning.saksopplysningTittel == 'Institusjonsopphold',
    );

  if (!saksopplysning) return <Loader />;

  return (
    <>
      <StegHeader
        headertekst={'Institusjonsopphold'}
        lovdatatekst="Opphold i institusjon, fengsel mv."
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={'§9'}
      />
      <HStack gap="3" align="center" style={{ marginBottom: '1em' }}>
        <UtfallIkon utfall={saksopplysning.utfall} />
        <BodyShort>
          {`Vilkåret er ${finnUtfallTekst(saksopplysning.utfall)} for hele eller deler av perioden`}
        </BodyShort>
      </HStack>
      <StegKort
        editerbar={false}
        behandlingId={valgtBehandling.behandlingId}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={saksopplysning.periode}
        kilde={saksopplysning.kilde}
        utfall={saksopplysning.utfall}
        vilkår={valgtBehandling.ytelsessaksopplysninger.vilkår}
        vilkårTittel={'Institusjonsopphold'}
        grunnlag={saksopplysning.utfall === 'OPPFYLT' ? 'Nei' : 'Ja'}
        grunnlagHeader={'Oppholder seg på institusjon'}
      />
    </>
  );
};

export default Institusjonsopphold;
