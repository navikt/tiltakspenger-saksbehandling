import {
    Box,
    BodyShort,
    Button,
    Heading,
    HStack,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Controller, FieldErrors, useFieldArray, useForm } from 'react-hook-form';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { Dagpengeperiode } from '~/lib/rammebehandling/typer/Dagpengeperiode';
import { Dato } from '~/types/DatoTid';
import { Nullable } from '~/types/UtilTypes';
import { dateTilISOTekst } from '~/utils/date';
import { nonNullish } from '~/utils/object';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { resolverResultat } from '~/utils/resolverResultat';

// Speiler Dagpengeperiode.Ytelsetype og Dagpengeperiode.Kilde i backend.
const ytelsetyper = [
    { verdi: 'ORDINÆRE_DAGPENGER', tekst: 'Ordinære dagpenger' },
    { verdi: 'PERMITTERING', tekst: 'Dagpenger under permittering' },
    {
        verdi: 'PERMITTERING_FISKEINDUSTRI',
        tekst: 'Dagpenger under permittering fra fiskeindustrien',
    },
] as const;

const kilder = [
    { verdi: 'ARENA', tekst: 'Arena' },
    { verdi: 'DP_SAK', tekst: 'Ny dagpengeløsning' },
] as const;

type Ytelsetype = (typeof ytelsetyper)[number]['verdi'];
type Kilde = (typeof kilder)[number]['verdi'];

type DagpengeperiodeFormData = {
    fraOgMed: Date | undefined;
    tilOgMed: Date | undefined;
    ytelsetype: Ytelsetype;
    kilde: Kilde;
};

type SettDagpengeperioderFormData = {
    sakId: string;
    perioder: DagpengeperiodeFormData[];
};

type SettDagpengeperioderRequest = {
    sakId: string;
    perioder: {
        fraOgMed: Dato;
        tilOgMed: Nullable<Dato>;
        ytelsetype: Ytelsetype;
        kilde: Kilde;
    }[];
};

const nyPeriode = (): DagpengeperiodeFormData => ({
    fraOgMed: undefined,
    tilOgMed: undefined,
    ytelsetype: 'ORDINÆRE_DAGPENGER',
    kilde: 'ARENA',
});

// Uten maks-dato slutter årsvelgeren i datovelgeren ved utgangen av inneværende år.
const senesteVelgbareDato = dayjs().add(2, 'year').endOf('year').toDate();

/**
 * Route: /dev/dagpenger?sakId=
 * sakId er valgfri, og brukes til å forhåndsutfylle skjemaet.
 */
export const SettDagpengeperioderSide = () => {
    const router = useRouter();
    const sakId = router.query.sakId;

    // Nøkkelen sørger for at skjemaet fylles ut på nytt ved navigering til en annen sak.
    return (
        <SettDagpengeperioderSkjema
            key={router.asPath}
            startSakId={(Array.isArray(sakId) ? sakId[0] : sakId) ?? ''}
        />
    );
};

const SettDagpengeperioderSkjema = ({ startSakId }: { startSakId: string }) => {
    const settDagpengeperioder = useFetchJsonFraApi<Dagpengeperiode[], SettDagpengeperioderRequest>(
        '/dev/dagpenger',
        'POST',
    );

    const form = useForm<SettDagpengeperioderFormData>({
        defaultValues: { sakId: startSakId, perioder: [nyPeriode()] },
        resolver: async (values) => {
            const errors: FieldErrors<SettDagpengeperioderFormData> = {};
            if (!values.sakId.trim()) {
                errors.sakId = { type: 'required', message: 'Sak-ID er påkrevd' };
            }
            const periodefeil = values.perioder.map(({ fraOgMed, tilOgMed }) => {
                if (!fraOgMed) {
                    return { fraOgMed: { type: 'required', message: 'Fra og med er påkrevd' } };
                }
                if (tilOgMed && fraOgMed > tilOgMed) {
                    return {
                        tilOgMed: {
                            type: 'validate',
                            message: 'Til og med kan ikke være før fra og med',
                        },
                    };
                }
                return undefined;
            });
            if (periodefeil.some((feil) => feil !== undefined)) {
                errors.perioder = periodefeil;
            }
            return resolverResultat(values, errors);
        },
    });

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'perioder' });

    const onSubmit = (values: SettDagpengeperioderFormData) =>
        settDagpengeperioder.trigger({
            sakId: values.sakId.trim(),
            perioder: values.perioder.map((periode) => ({
                fraOgMed: dateTilISOTekst(nonNullish(periode.fraOgMed)),
                tilOgMed: periode.tilOgMed ? dateTilISOTekst(periode.tilOgMed) : null,
                ytelsetype: periode.ytelsetype,
                kilde: periode.kilde,
            })),
        });

    const feil = settDagpengeperioder.error;
    const lagret = settDagpengeperioder.data;

    return (
        <Box padding="space-32">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack gap="space-20" style={{ maxWidth: '40rem' }}>
                    <Heading size="medium" level="1">
                        Sett dagpengeperioder
                    </Heading>
                    <BodyShort size="small">
                        Setter dagpengeperiodene dp-datadeling svarer med lokalt for personen på
                        saken. Lagring erstatter periodene som var satt fra før, og uten perioder
                        fjernes de. Uten til og med er perioden løpende. Periodene overlever omstart
                        av backend.
                    </BodyShort>
                    <BodyShort size="small">
                        Sett periodene før søknaden opprettes, eller oppdater saksopplysningene i en
                        åpen behandling for å se dem. Skjemaet kan forhåndsutfylles via URL-en:{' '}
                        <code>/dev/dagpenger?sakId=</code>
                    </BodyShort>
                    <Controller
                        control={form.control}
                        name={'sakId'}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                error={fieldState.error?.message}
                                label="Sak-ID"
                                description="F.eks. sak_01J..."
                                size="small"
                            />
                        )}
                    />
                    {fields.map((item, index) => (
                        <Box key={item.id} background="neutral-soft" padding="space-16">
                            <VStack gap="space-16">
                                <HStack gap="space-16">
                                    <Controller
                                        control={form.control}
                                        name={`perioder.${index}.fraOgMed`}
                                        render={({ field, fieldState }) => (
                                            <Datovelger
                                                label="Fra og med"
                                                size="small"
                                                dropdownCaption
                                                maxDate={senesteVelgbareDato}
                                                defaultSelected={field.value}
                                                selected={field.value}
                                                onDateChange={field.onChange}
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={form.control}
                                        name={`perioder.${index}.tilOgMed`}
                                        render={({ field, fieldState }) => (
                                            <Datovelger
                                                label="Til og med"
                                                size="small"
                                                dropdownCaption
                                                maxDate={senesteVelgbareDato}
                                                defaultSelected={field.value}
                                                selected={field.value}
                                                onDateChange={field.onChange}
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </HStack>
                                <HStack gap="space-16">
                                    <Controller
                                        control={form.control}
                                        name={`perioder.${index}.ytelsetype`}
                                        render={({ field }) => (
                                            <Select {...field} label="Ytelsetype" size="small">
                                                {ytelsetyper.map(({ verdi, tekst }) => (
                                                    <option key={verdi} value={verdi}>
                                                        {tekst}
                                                    </option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <Controller
                                        control={form.control}
                                        name={`perioder.${index}.kilde`}
                                        render={({ field }) => (
                                            <Select {...field} label="Kilde" size="small">
                                                {kilder.map(({ verdi, tekst }) => (
                                                    <option key={verdi} value={verdi}>
                                                        {tekst}
                                                    </option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </HStack>
                                <Button
                                    type="button"
                                    size="small"
                                    variant="secondary"
                                    style={{ alignSelf: 'end' }}
                                    onClick={() => remove(index)}
                                >
                                    Fjern periode
                                </Button>
                            </VStack>
                        </Box>
                    ))}
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        style={{ alignSelf: 'start' }}
                        onClick={() => append(nyPeriode())}
                    >
                        Legg til periode
                    </Button>
                    {feil && (
                        <Infokort variant={'feil'}>{`[${feil.status}] ${feil.message}`}</Infokort>
                    )}
                    {lagret !== undefined && !feil && (
                        <Infokort variant={'suksess'}>
                            {lagret.length > 0
                                ? `${lagret.length} dagpengeperiode(r) er satt for personen på saken.`
                                : 'Dagpengeperiodene er fjernet for personen på saken.'}
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(lagret, null, 2)}
                            </pre>
                        </Infokort>
                    )}
                    <HStack gap="space-16">
                        <InternLenkeKnapp href="/dev">Tilbake</InternLenkeKnapp>
                        <Button
                            variant="primary"
                            type="submit"
                            loading={settDagpengeperioder.isMutating}
                            size="small"
                        >
                            Lagre dagpengeperioder
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
};
