import {
    BodyShort,
    Box,
    Button,
    Heading,
    HStack,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react';
import dayjs from 'dayjs';
import { NextRouter, useRouter } from 'next/router';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import {
    TiltakDeltakerstatus,
    tiltakDeltakerstatusTekst,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { Nullable } from '~/types/UtilTypes';
import { dateTilISOTekst } from '~/utils/date';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { resolverResultat } from '~/utils/resolverResultat';

type OppdaterTiltaksdeltakelseFormData = {
    eksternDeltakelseId: string;
    fraOgMed: Date | undefined;
    tilOgMed: Date | undefined;
    status: TiltakDeltakerstatus | '';
    deltakelseProsent: string;
    antallDagerPerUke: string;
};

type OppdaterTiltaksdeltakelseRequest = {
    eksternDeltakelseId: string;
    fraOgMed: Nullable<string>;
    tilOgMed: Nullable<string>;
    status: Nullable<TiltakDeltakerstatus>;
    deltakelseProsent: Nullable<number>;
    antallDagerPerUke: Nullable<number>;
};

type QueryVerdi = NextRouter['query'][string];

const førsteVerdi = (verdi: QueryVerdi): string | undefined =>
    Array.isArray(verdi) ? verdi[0] : verdi;

// Godtar kun gyldige datoer på formatet YYYY-MM-DD, slik at f.eks. 2025-02-30 ikke rulles over til mars.
const tilDato = (verdi: QueryVerdi): Date | undefined => {
    const tekst = førsteVerdi(verdi);
    if (!tekst || !/^\d{4}-\d{2}-\d{2}$/.test(tekst)) {
        return undefined;
    }
    const dato = dayjs(tekst);
    return dato.isValid() && dateTilISOTekst(dato) === tekst ? dato.toDate() : undefined;
};

const tilStatus = (verdi: QueryVerdi): TiltakDeltakerstatus | '' => {
    const tekst = førsteVerdi(verdi);
    return Object.values(TiltakDeltakerstatus).find((status) => status === tekst) ?? '';
};

const startverdierFraRoute = (query: NextRouter['query']): OppdaterTiltaksdeltakelseFormData => ({
    eksternDeltakelseId: førsteVerdi(query.id) ?? '',
    fraOgMed: tilDato(query.fraOgMed),
    tilOgMed: tilDato(query.tilOgMed),
    status: tilStatus(query.status),
    deltakelseProsent: førsteVerdi(query.deltakelseProsent) ?? '',
    antallDagerPerUke: førsteVerdi(query.antallDagerPerUke) ?? '',
});

// Tomt felt betyr at backend beholder dagens verdi. Ugyldige tall blir NaN, og stoppes av validering.
const tilTall = (verdi: string): Nullable<number> => {
    const trimmet = verdi.trim().replace(',', '.');
    return trimmet ? Number(trimmet) : null;
};

// Uten maks-dato slutter årsvelgeren i datovelgeren ved utgangen av inneværende år.
const senesteVelgbareDato = dayjs().add(2, 'year').endOf('year').toDate();

const erUtenforIntervall = (tall: Nullable<number>, min: number, maks: number) =>
    tall !== null && (Number.isNaN(tall) || tall < min || tall > maks);

/**
 * Route: /dev/deltakelse/[id]?fraOgMed=&tilOgMed=&status=&deltakelseProsent=&antallDagerPerUke=
 * Alle deler er valgfrie, og brukes til å forhåndsutfylle skjemaet.
 */
export const OppdaterTiltaksdeltakelseSide = () => {
    const router = useRouter();

    // Nøkkelen sørger for at skjemaet fylles ut på nytt ved navigering til en annen deltakelse/query.
    return (
        <OppdaterTiltaksdeltakelseSkjema
            key={router.asPath}
            startverdier={startverdierFraRoute(router.query)}
        />
    );
};

const OppdaterTiltaksdeltakelseSkjema = ({
    startverdier,
}: {
    startverdier: OppdaterTiltaksdeltakelseFormData;
}) => {
    const oppdaterTiltaksdeltakelse = useFetchJsonFraApi<unknown, OppdaterTiltaksdeltakelseRequest>(
        '/dev/tiltaksdeltakelse',
        'POST',
    );

    const form = useForm<OppdaterTiltaksdeltakelseFormData>({
        defaultValues: startverdier,
        resolver: async (values) => {
            const errors: FieldErrors<OppdaterTiltaksdeltakelseFormData> = {};
            if (!values.eksternDeltakelseId.trim()) {
                errors.eksternDeltakelseId = {
                    type: 'required',
                    message: 'Ekstern deltakelse-ID er påkrevd',
                };
            }
            if (values.fraOgMed && values.tilOgMed && values.fraOgMed > values.tilOgMed) {
                errors.tilOgMed = {
                    type: 'validate',
                    message: 'Til og med kan ikke være før fra og med',
                };
            }
            if (erUtenforIntervall(tilTall(values.deltakelseProsent), 0, 100)) {
                errors.deltakelseProsent = {
                    type: 'validate',
                    message: 'Må være et tall mellom 0 og 100',
                };
            }
            if (erUtenforIntervall(tilTall(values.antallDagerPerUke), 0, 7)) {
                errors.antallDagerPerUke = {
                    type: 'validate',
                    message: 'Må være et tall mellom 0 og 7',
                };
            }
            return resolverResultat(values, errors);
        },
    });

    const onSubmit = (values: OppdaterTiltaksdeltakelseFormData) => {
        oppdaterTiltaksdeltakelse.trigger({
            eksternDeltakelseId: values.eksternDeltakelseId.trim(),
            fraOgMed: values.fraOgMed ? dateTilISOTekst(values.fraOgMed) : null,
            tilOgMed: values.tilOgMed ? dateTilISOTekst(values.tilOgMed) : null,
            status: values.status || null,
            deltakelseProsent: tilTall(values.deltakelseProsent),
            antallDagerPerUke: tilTall(values.antallDagerPerUke),
        });
    };

    const feil = oppdaterTiltaksdeltakelse.error;

    return (
        <Box padding="space-32">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack gap="space-20" style={{ maxWidth: '40rem' }}>
                    <Heading size="medium" level="1">
                        Oppdater tiltaksdeltakelse
                    </Heading>
                    <BodyShort size="small">
                        Setter tiltaksdeltakelsen som tiltakshistorikken svarer med lokalt, og
                        registrerer en endring på deltakeren slik Kafka-consumerne gjør. Felter som
                        ikke fylles ut beholder dagens verdi.
                    </BodyShort>
                    <BodyShort size="small">
                        Skjemaet kan forhåndsutfylles via URL-en:{' '}
                        <code>
                            /dev/deltakelse/[id]?fraOgMed=YYYY-MM-DD&amp;tilOgMed=YYYY-MM-DD&amp;status=Deltar&amp;deltakelseProsent=100&amp;antallDagerPerUke=5
                        </code>
                    </BodyShort>
                    <Controller
                        control={form.control}
                        name={'eksternDeltakelseId'}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                error={fieldState.error?.message}
                                label="Ekstern deltakelse-ID"
                                description="IDen til en tiltaksdeltakelse som allerede finnes på en sak"
                                size="small"
                            />
                        )}
                    />
                    <HStack gap="space-16">
                        <Controller
                            control={form.control}
                            name={'fraOgMed'}
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
                            name={'tilOgMed'}
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
                    <Controller
                        control={form.control}
                        name={'status'}
                        render={({ field, fieldState }) => (
                            <Select
                                {...field}
                                label="Status"
                                size="small"
                                error={fieldState.error?.message}
                            >
                                <option value="">Behold dagens status</option>
                                {Object.values(TiltakDeltakerstatus).map((status) => (
                                    <option key={status} value={status}>
                                        {tiltakDeltakerstatusTekst[status]}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    <HStack gap="space-16">
                        <Controller
                            control={form.control}
                            name={'deltakelseProsent'}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    error={fieldState.error?.message}
                                    label="Deltakelsesprosent"
                                    inputMode="decimal"
                                    size="small"
                                />
                            )}
                        />
                        <Controller
                            control={form.control}
                            name={'antallDagerPerUke'}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    error={fieldState.error?.message}
                                    label="Antall dager per uke"
                                    inputMode="decimal"
                                    size="small"
                                />
                            )}
                        />
                    </HStack>
                    {feil && (
                        <Infokort variant={'feil'}>
                            {feil.status === 404
                                ? 'Fant ingen tiltaksdeltakelse med denne eksterne IDen.'
                                : `[${feil.status}] ${feil.message}`}
                        </Infokort>
                    )}
                    {oppdaterTiltaksdeltakelse.data !== undefined && !feil && (
                        <Infokort variant={'suksess'}>
                            Tiltaksdeltakelsen er oppdatert. Endringen plukkes opp ved neste kjøring
                            av jobben for oppdaterte tiltaksdeltakelser.
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(oppdaterTiltaksdeltakelse.data, null, 2)}
                            </pre>
                        </Infokort>
                    )}
                    <HStack gap="space-16">
                        <InternLenkeKnapp href="/dev">Tilbake</InternLenkeKnapp>
                        <Button
                            variant="primary"
                            type="submit"
                            loading={oppdaterTiltaksdeltakelse.isMutating}
                            size="small"
                        >
                            Oppdater tiltaksdeltakelse
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
};
