import { Alert, Button, Heading, VStack } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { TilbakekrevingId } from '~/types/Tilbakekreving';
import { OppsummeringsPar } from '~/components/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import {
    formaterDatotekst,
    formaterTidspunktKort,
    periodeTilFormatertDatotekst,
} from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { TilbakekrevingStatusTag } from '~/components/tilbakekreving/TilbakekrevingStatusTag';
import { useSak } from '~/context/sak/SakContext';
import { hentTilbakekreving } from '~/utils/sak';

import style from './TilbakekrevingOppsummering.module.css';

type Props = {
    tilbakekrevingId: TilbakekrevingId;
};

export const TilbakekrevingOppsummering = ({ tilbakekrevingId }: Props) => {
    const { sak } = useSak();

    const tilbakekreving = hentTilbakekreving(sak, tilbakekrevingId);

    if (!tilbakekreving) {
        return (
            <Alert
                variant={'error'}
            >{`Teknisk feil: fant ikke tilbakekreving for id ${tilbakekrevingId}`}</Alert>
        );
    }

    const {
        status,
        totaltFeilutbetaltBeløp,
        kravgrunnlagTotalPeriode,
        varselSendt,
        url,
        opprettet,
        sistEndret,
    } = tilbakekreving;

    return (
        <VStack gap={'space-24'} className={style.tilbakekreving}>
            <Alert variant={'warning'} inline={true}>
                <Heading size={'small'} level={'3'}>
                    {'Tilbakekreving'}
                </Heading>
                {'Det ble opprettet en tilbakekrevingssak for dette vedtaket.'}
            </Alert>
            <div className={style.grid}>
                <OppsummeringsPar
                    label={'Status'}
                    verdi={<TilbakekrevingStatusTag status={status} />}
                    retning={'vertikal'}
                />
                <OppsummeringsPar
                    label={'Feilutbetalt beløp'}
                    verdi={formatterBeløp(totaltFeilutbetaltBeløp)}
                    retning={'vertikal'}
                />
                <OppsummeringsPar
                    label={'Totalperiode for kravgrunnlag'}
                    verdi={periodeTilFormatertDatotekst(kravgrunnlagTotalPeriode)}
                    retning={'vertikal'}
                />
                <OppsummeringsPar
                    label={'Opprettet'}
                    verdi={formaterTidspunktKort(opprettet)}
                    retning={'vertikal'}
                />
                <OppsummeringsPar
                    label={'Sist endret'}
                    verdi={formaterTidspunktKort(sistEndret)}
                    retning={'vertikal'}
                />
                <OppsummeringsPar
                    label={'Varsel sendt'}
                    verdi={varselSendt ? formaterDatotekst(varselSendt) : '-'}
                    retning={'vertikal'}
                />
            </div>
            <Button
                as={'a'}
                href={url}
                variant={'secondary'}
                size={'small'}
                icon={<ExternalLinkIcon />}
                iconPosition={'right'}
                target={'_blank'}
                className={style.button}
            >
                {'Åpne tilbakekreving'}
            </Button>
        </VStack>
    );
};
