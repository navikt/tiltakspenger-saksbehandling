import { BodyShort, Button, Textarea, VStack } from '@navikt/ds-react';
import { formaterTidspunktKort } from '~/utils/date';
import { MeldekortBehandlingProps } from '~/types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../uker/MeldekortUker';
import { MeldekortBegrunnelse } from '../begrunnelse/MeldekortBegrunnelse';
import { MeldekortBeregningOgSimulering } from '~/components/meldekort/0-felles-komponenter/beregning-simulering/MeldekortBeregningOgSimulering';
import Divider from '~/components/divider/Divider';
import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';
import { ForhåndsvisMeldekortbehandlingBrevRequest } from '../../2-hovedseksjon/behandling/utfylling/meldekortUtfyllingUtils';
import styles from './MeldekortOppsummering.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortOppsummering = ({ meldekortBehandling }: Props) => {
    const { sakId, id, beregning, begrunnelse, godkjentTidspunkt, dager, tekstTilVedtaksbrev } =
        meldekortBehandling;

    const forhåndsvisBrev = useFetchBlobFraApi<ForhåndsvisMeldekortbehandlingBrevRequest>(
        `/sak/${sakId}/meldekortbehandling/${id}/forhandsvis`,
        'POST',
    );

    return (
        <VStack gap={'5'}>
            <MeldekortUker dager={beregning?.beregningForMeldekortetsPeriode.dager ?? dager} />
            {godkjentTidspunkt && (
                <BodyShort size={'small'}>
                    {'Godkjent: '}
                    <strong>{formaterTidspunktKort(godkjentTidspunkt)}</strong>
                </BodyShort>
            )}
            <MeldekortBeregningOgSimulering meldekortBehandling={meldekortBehandling} />
            {begrunnelse && <MeldekortBegrunnelse readOnly={true} defaultValue={begrunnelse} />}
            {begrunnelse && tekstTilVedtaksbrev ? <Divider orientation="horizontal" /> : null}
            {tekstTilVedtaksbrev && (
                <>
                    <Textarea
                        readOnly={true}
                        value={tekstTilVedtaksbrev}
                        label="Vedtaksbrev for behandling av meldekort"
                        description="Teksten vises i vedtaksbrevet til bruker."
                    />
                    <Button
                        className={styles.forhåndsvisBrevButton}
                        type="button"
                        variant="secondary"
                        size="small"
                        loading={forhåndsvisBrev.isMutating}
                        onClick={() => {
                            forhåndsvisBrev.trigger(
                                {
                                    tekstTilVedtaksbrev: tekstTilVedtaksbrev,
                                },
                                {
                                    onSuccess: (blob) => {
                                        window.open(URL.createObjectURL(blob!));
                                    },
                                },
                            );
                        }}
                    >
                        Forhåndsvis brev
                    </Button>
                </>
            )}
        </VStack>
    );
};
