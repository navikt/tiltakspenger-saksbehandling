import { BodyShort, HStack, Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import { Utfall } from '../../types/Utfall';
import { finnUtfallTekst } from '../../utils/tekstformateringUtils';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import { formatDateObject } from '../../utils/date';

const Alder = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  //Mocket ut data ettersom dette jobbes med parallellt
  return (
    <>
      <StegHeader
        headertekst={'Krav fremmet innen frist'}
        lovdatatekst={
          'Utbetaling, frist for framsetting av krav og rett til etterbetaling'
        }
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={'§11'}
      />
      <HStack gap="3" align="center" style={{ marginBottom: '1em' }}>
        <UtfallIkon utfall={Utfall.KREVER_MANUELL_VURDERING} />
        <BodyShort>
          {`Vilkåret er ${finnUtfallTekst(Utfall.KREVER_MANUELL_VURDERING)} for hele eller deler av perioden`}
        </BodyShort>
      </HStack>
      <StegKort
        editerbar={true}
        behandlingId={valgtBehandling.behandlingId}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={valgtBehandling.vurderingsperiode}
        kilde={'Søknad'}
        utfall={Utfall.OPPFYLT}
        vilkår={'SØKNADSFRIST'}
        vilkårTittel={'Krav fremmet innen frist'}
        grunnlag={formatDateObject(valgtBehandling.søknadsdato)}
        grunnlagHeader={'Søknadsdato'}
      />
    </>
  );
};

export default Alder;
