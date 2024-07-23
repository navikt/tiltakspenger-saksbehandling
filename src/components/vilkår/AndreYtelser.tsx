import {
  Alert,
  Button,
  Heading,
  Loader,
  Radio,
  RadioGroup,
  VStack,
} from '@navikt/ds-react';
import { useRouter } from 'next/router';
import VilkårHeader from './VilkårHeader';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentLivsopphold } from '../../hooks/vilkår/useHentLivsopphold';
import { useSWRConfig } from 'swr';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import styles from './Vilkår.module.css';

export interface SkjemaFelter {
  harAndreYtelser: boolean;
}

export const AndreYtelser = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { livsopphold, isLoading } = useHentLivsopphold(behandlingId);
  const mutator = useSWRConfig().mutate;

  const { handleSubmit, control, watch } = useForm<SkjemaFelter>({
    mode: 'onSubmit',
    defaultValues: {
      harAndreYtelser: undefined,
    },
  });

  const watchHarLivsoppholdytelser = watch('harAndreYtelser');

  if (isLoading || !livsopphold) {
    return <Loader />;
  }

  const håndterLagreLivsoppholdSaksopplysning = (harYtelser: boolean) => {
    if (harYtelser) {
      return;
    }

    fetch(`/api/behandling/${behandlingId}/vilkar/livsopphold`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ytelseForPeriode: {
          periode: livsopphold.vurderingsPeriode,
          harYtelse: harYtelser,
        },
      }),
    })
      .then(() => {
        mutator(`/api/behandling/${behandlingId}/vilkar/livsopphold`);
      })
      .catch((error) => {
        throw new Error(
          `Noe gikk galt ved lagring av antall dager: ${error.message}`,
        );
      });
  };

  const onSubmit: SubmitHandler<SkjemaFelter> = (data) => {
    håndterLagreLivsoppholdSaksopplysning(data.harAndreYtelser);
  };

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Forholdet til andre ytelser'}
        lovdatatekst={livsopphold.vilkårLovreferanse.beskrivelse}
        paragraf={livsopphold.vilkårLovreferanse.paragraf}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />

      {!watchHarLivsoppholdytelser && (
        <UtfallstekstMedIkon samletUtfall={livsopphold.samletUtfall} />
      )}
      {watchHarLivsoppholdytelser && (
        <Alert variant="error">
          <Heading spacing size="small" level="3">
            Utfall støttes ikke
          </Heading>
          Denne vurderingen fører til et utfall vi ikke støtter i denne
          løsningen enda.
        </Alert>
      )}
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name={'harAndreYtelser'}
          control={control}
          render={({ field: { onChange } }) => {
            return (
              <RadioGroup
                legend="Har bruker andre ytelser til livsopphold i vurderingsperioden?"
                onChange={onChange}
                defaultValue={undefined}
              >
                <Radio value={true}>{`Ja`}</Radio>
                <Radio value={false}>{`Nei`}</Radio>
              </RadioGroup>
            );
          }}
        />
        <Button
          type="submit"
          value="submit"
          size="small"
          className={styles.marginTop}
          disabled={watchHarLivsoppholdytelser}
        >
          Lagre
        </Button>
      </form>
    </VStack>
  );
};
