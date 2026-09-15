import { BodyShort } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Rammebehandling, Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { hentGjenåpningAvSøknad } from '~/lib/søknad/søknadUtils';
import { formaterTidspunkt } from '~/utils/date';

export const GjenåpnetSøknadInfokort = (props: { behandling: Rammebehandling }) => {
    if (props.behandling.type !== Rammebehandlingstype.SØKNADSBEHANDLING) {
        return null;
    }

    const gjenåpning = hentGjenåpningAvSøknad(props.behandling.søknad);

    if (!gjenåpning) {
        return null;
    }

    return (
        <Infokort variant={'info'} size={'small'} header={'Gjenåpnet søknad'}>
            <BodyShort size={'small'}>
                {`Søknaden ble tatt opp igjen av ${gjenåpning.utførtAv} ${formaterTidspunkt(gjenåpning.tidspunkt)}.`}
            </BodyShort>
            {gjenåpning.begrunnelse && (
                <BodyShort size={'small'}>{`Begrunnelse: ${gjenåpning.begrunnelse}`}</BodyShort>
            )}
        </Infokort>
    );
};
