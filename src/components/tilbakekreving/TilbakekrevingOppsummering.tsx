import { Button, VStack } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { TilbakekrevingBehandling } from '~/types/Tilbakekreving';
import { OppsummeringsPar } from '~/components/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import {
    formaterDatotekst,
    formaterTidspunktKort,
    periodeTilFormatertDatotekst,
} from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { TilbakekrevingStatusTag } from '~/components/tilbakekreving/TilbakekrevingStatusTag';

import style from './TilbakekrevingOppsummering.module.css';

type Props = {
    tilbakekreving: TilbakekrevingBehandling;
};

export const TilbakekrevingOppsummering = ({ tilbakekreving }: Props) => {
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
        <VStack gap={'space-24'}>
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
