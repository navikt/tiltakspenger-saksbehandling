import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import StegHeader from './VilkårHeader';
import StegKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { Deltagelse } from '../../types/KvpTypes';
import { dateTilISOTekst } from '../../utils/date';
import { SkjemaFelter } from './OppdaterSaksopplysningForm';
import { useSWRConfig } from 'swr';
import { useHentKvp } from '../../hooks/vilkår/useHentKvp';

const Kvalifiseringsprogrammet = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { kvp, isLoading } = useHentKvp(behandlingId);
  const mutator = useSWRConfig().mutate;

  if (isLoading || !kvp) {
    return <Loader />;
  }

  const håndterLagreKvpSaksopplysning = (data: SkjemaFelter) => {
    const deltakelseMedPeriode = {
      periode: data.valgtVerdi
        ? {
            fraOgMed: dateTilISOTekst(data.periode.fraOgMed),
            tilOgMed: dateTilISOTekst(data.periode.tilOgMed),
          }
        : {
            fraOgMed: kvp.vurderingsperiode.fraOgMed,
            tilOgMed: kvp.vurderingsperiode.tilOgMed,
          },
      deltar: data.valgtVerdi,
    };

    const årsakTilEndring = data.begrunnelse;

    fetch(`/api/behandling/${behandlingId}/vilkar/kvp`, {
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
        mutator(`/api/behandling/${behandlingId}/vilkar/kvp`);
      })
      .catch((error) => {
        throw new Error(
          `Noe gikk galt ved lagring av antall dager: ${error.message}`,
        );
      });
  };

  const deltagelse = kvp.avklartSaksopplysning.periodeMedDeltagelse.deltagelse;
  const saksopplysningsPeriode =
    kvp.avklartSaksopplysning.periodeMedDeltagelse.periode ??
    kvp.søknadSaksopplysning.periodeMedDeltagelse.periode;

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
        håndterLagreSaksopplysning={(data: SkjemaFelter) =>
          håndterLagreKvpSaksopplysning(data)
        }
        editerbar={false}
        vurderingsperiode={kvp.vurderingsperiode}
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
