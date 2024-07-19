import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import StegHeader from './VilkårHeader';
import StegKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { dateTilISOTekst, nyPeriodeTilPeriode } from '../../utils/date';
import { SkjemaFelter } from './OppdaterSaksopplysningForm';
import { useSWRConfig } from 'swr';
import { useHentIntroduksjonsprogrammet } from '../../hooks/vilkår/useHentIntroduksjonsprogrammet';
import { Deltagelse } from '../../types/KvpTypes';

const Kvalifiseringsprogrammet = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { intro, isLoading } = useHentIntroduksjonsprogrammet(behandlingId);
  const mutator = useSWRConfig().mutate;

  if (isLoading || !intro) {
    return <Loader />;
  }

  const håndterLagreIntroSaksopplysning = (data: SkjemaFelter) => {
    const deltakelseMedPeriode = {
      periode: data.valgtVerdi
        ? {
            fraOgMed: dateTilISOTekst(data.periode.fra),
            tilOgMed: dateTilISOTekst(data.periode.til),
          }
        : {
            fraOgMed: vurderingsPeriode.fra,
            tilOgMed: vurderingsPeriode.til,
          },
      deltar: data.valgtVerdi,
    };

    const årsakTilEndring = data.begrunnelse;

    fetch(`/api/behandling/${behandlingId}/vilkar/introduksjonsprogrammet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ytelseForPeriode: [deltakelseMedPeriode],
        årsakTilEndring: årsakTilEndring,
      }),
    })
      .then(() => {
        mutator(
          `/api/behandling/${behandlingId}/vilkar/introduksjonsprogrammet`,
        );
      })
      .catch((error) => {
        throw new Error(`Ikke implementert enda: ${error.message}`);
      });
  };

  const deltagelse =
    intro.avklartSaksopplysning.periodeMedDeltagelse.deltagelse;
  const vurderingsPeriode = nyPeriodeTilPeriode(intro.vurderingsperiode);
  const saksopplysningsPeriode = nyPeriodeTilPeriode(
    intro.avklartSaksopplysning.periodeMedDeltagelse.periode ??
      intro.søknadSaksopplysning.periodeMedDeltagelse.periode,
  );
  return (
    <VStack gap="4">
      <StegHeader
        headertekst={'Introduksjonsprogrammet'}
        lovdatatekst={intro.vilkårLovreferanse.beskrivelse}
        paragraf={intro.vilkårLovreferanse.paragraf}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <UtfallstekstMedIkon samletUtfall={intro.samletUtfall} />
      <StegKort
        håndterLagreSaksopplysning={(data: SkjemaFelter) =>
          håndterLagreIntroSaksopplysning(data)
        }
        editerbar={false}
        vurderingsperiode={vurderingsPeriode}
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
