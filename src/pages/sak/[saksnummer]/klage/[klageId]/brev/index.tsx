import { ReactElement, useState } from 'react';

import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Button, Heading, HStack, Textarea, VStack } from '@navikt/ds-react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProps } from '~/types/Sak';
import router from 'next/router';
import { Klagebehandling, KlageId } from '~/types/Klage';
import KlageLayout from '../../layout';
import Image from 'next/image';

type Props = {
    sak: SakProps;
    klage: Klagebehandling;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const saksnummer = context.params!.saksnummer as string;
    const klageId = context.params!.klageId as KlageId;

    const sak = await fetchSak(context.req, context.params!.saksnummer as string).catch((e) => {
        logger.error(`Feil under henting av sak med saksnummer ${saksnummer} - ${e.toString()}`);
        throw e;
    });

    const klage = sak.klageBehandlinger.find((klage) => klage.id === klageId);

    if (!klage) {
        logger.error(`Fant ikke klage ${klageId} på sak ${sak.sakId}`);

        return {
            notFound: true,
        };
    }

    return { props: { sak, klage } };
});

const BrevKlagePage = ({ sak, klage }: Props) => {
    const [harSendt, setHarSendt] = useState<boolean>(false);

    const form = useForm<{
        brevtekst: string;
    }>({
        defaultValues: {
            brevtekst: '',
        },
        resolver: (data) => {
            const errors: FieldErrors<{ brevtekst: string }> = {};

            if (!data.brevtekst) {
                errors.brevtekst = {
                    type: 'required',
                    message: 'Brevtekst er påkrevd',
                };
            }

            return { values: data, errors };
        },
    });

    const onSubmit = (data: { brevtekst: string }) => {
        console.log('Form data sendt inn:', data);
        setHarSendt(true);
    };

    return (
        <VStack>
            <Heading size="medium">Brev</Heading>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack gap="4" align="start">
                    <Controller
                        control={form.control}
                        name="brevtekst"
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                label="Brevtekst"
                                description="Skriv inn teksten som skal være med i klagebrevet."
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    <HStack gap="4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                                router.push(`/sak/${sak.saksnummer}/klage/${klage.id}/formkrav`)
                            }
                        >
                            Tilbake
                        </Button>
                        <Button type="submit">Send </Button>
                    </HStack>

                    {harSendt && (
                        <Image
                            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExamwxMXI1bnI4dG1zcjkxNGk3eTIza2oxa2I1MGN3cDB0dHpvdWZ6dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CuHO2q0lorhBieOEMp/giphy.gif"
                            alt="alt"
                            width="400"
                            height="400"
                        />
                    )}
                </VStack>
            </form>
        </VStack>
    );
};

BrevKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak } = page.props as Props;
    return <KlageLayout saksnummer={sak.saksnummer}>{page}</KlageLayout>;
};

export default BrevKlagePage;
