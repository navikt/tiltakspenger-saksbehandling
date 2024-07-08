import { Alert, Heading, Loader, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { SaksbehandlerContext } from '../../pages/_app';
import StegHeader from './StegHeader';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { Utfall } from '../../types/Utfall';

const radioknapp = {
    ja: "ja",
    nei: "nei",
    ikkeSatt: undefined,
}

const velgRadioknappBasertPåUtfall = (utfall: Utfall): string | undefined => {
    switch (utfall) {
        case 'OPPFYLT':
            return radioknapp.ja;
        case 'IKKE_OPPFYLT':
            return radioknapp.nei;
        case 'KREVER_MANUELL_VURDERING':
            return radioknapp.ikkeSatt;
        default:
            return radioknapp.ikkeSatt;
    }
}

export const AndreYtelserMinimalistisk = () => {
    const [radioButtonValg, setRadioButtonValg] = useState<string | undefined>()
    const router = useRouter();
    const behandlingId = router.query.behandlingId as string;
    const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

    if (isLoading || !valgtBehandling) {
        return <Loader />;
    }

    const andreYtelser = valgtBehandling.ytelsessaksopplysninger;

    const handleRadioButtonChange = (val: string) => {
        setRadioButtonValg(val)
    }

    if (!andreYtelser) return <Loader />;
    return (
        <VStack gap="4">
            <StegHeader
                headertekst={'Forholdet til andre ytelser'}
                lovdatatekst={andreYtelser.vilkårLovreferanse.beskrivelse}
                paragraf={andreYtelser.vilkårLovreferanse.paragraf}
                lovdatalenke={
                    'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
                }
            />
            <UtfallstekstMedIkon samletUtfall={andreYtelser.samletUtfall} />
            <RadioGroup
                legend="Har bruker andre ytelser til livsopphold i vurderingperioden?."
                onChange={handleRadioButtonChange}
                defaultValue={radioButtonValg}
            >
                <Radio value={radioknapp.ja}>Ja</Radio>
                <Radio value={radioknapp.nei}>Nei</Radio>
            </RadioGroup>

            {radioButtonValg === radioknapp.ja && (
                <Alert variant="error">
                    <Heading spacing size="small" level="3">
                        Fører til avslag
                    </Heading>
                    Denne vurderingen fører til et avslag. Det støttes ikke i denne løsningen.
                </Alert>
            )}
        </VStack >
    );
};
