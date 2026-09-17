import { BodyShort, ExpansionCard, Link, Table, Tag } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { SakProps } from '~/lib/sak/SakTyper';
import { ÅpenBehandling, ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';
import {
    hentKlagebehandling,
    hentMeldekortbehandling,
    hentRammebehandling,
    hentSøknad,
    hentTilbakekreving,
} from '~/lib/sak/sakUtils';
import { behandlingUrl, meldekortbehandlingUrl } from '~/utils/urls';
import { formaterPeriode, formaterTidspunkt } from '~/utils/date';
import { finnSisteGyldigeStegForKlage } from '~/lib/klage/utils/klageUtils';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import { BehandlingStatusTags } from '~/lib/behandling-felles/status/BehandlingStatusTags';
import { KlagebehandlingStatusTag } from '~/lib/klage/tags/KlagebehandlingStatusTag';
import { TilbakekrevingStatusTags } from '~/lib/tilbakekreving/status-tags/TilbakekrevingStatusTags';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { classNames } from '~/utils/classNames';

import style from './ÅpneBehandlingerSammendrag.module.css';

type Props = {
    sak: SakProps;
    /** Id til behandlingen som vises på siden - ekskluderes fra sammendraget */
    ekskluderBehandlingId?: string;
    className?: string;
};

export const ÅpneBehandlingerSammendrag = ({ sak, ekskluderBehandlingId, className }: Props) => {
    const åpneBehandlinger = sak.åpneBehandlinger.filter(
        (åpenBehandling) => åpenBehandling.id !== ekskluderBehandlingId,
    );

    if (åpneBehandlinger.length === 0) {
        return null;
    }

    return (
        <ExpansionCard
            size={'small'}
            aria-label={'Andre åpne behandlinger på saken'}
            className={classNames(style.card, className)}
        >
            <ExpansionCard.Header data-color={'info'} className={style.header}>
                <BodyShort>
                    <strong>{'Andre åpne behandlinger: '}</strong>
                    {antallPerTypeTekst(åpneBehandlinger)}
                </BodyShort>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <Table size={'small'}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope={'col'}>{'Type'}</Table.HeaderCell>
                            <Table.HeaderCell scope={'col'}>{'Status'}</Table.HeaderCell>
                            <Table.HeaderCell scope={'col'}>{'Periode'}</Table.HeaderCell>
                            <Table.HeaderCell scope={'col'}>{'Opprettet'}</Table.HeaderCell>
                            <Table.HeaderCell scope={'col'} />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {åpneBehandlinger.map((åpenBehandling) => (
                            <ÅpenBehandlingRad
                                key={åpenBehandling.id}
                                åpenBehandling={åpenBehandling}
                                sak={sak}
                            />
                        ))}
                    </Table.Body>
                </Table>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

const ÅpenBehandlingRad = ({
    åpenBehandling,
    sak,
}: {
    åpenBehandling: ÅpenBehandling;
    sak: SakProps;
}) => {
    const { typeTekst, statusTag, opprettet, periodeTekst, info, lenke } = propsForRad(
        åpenBehandling,
        sak,
    );

    return (
        <Table.Row shadeOnHover={false}>
            <Table.DataCell>{typeTekst}</Table.DataCell>
            <Table.DataCell>{statusTag}</Table.DataCell>
            <Table.DataCell>{periodeTekst ?? '-'}</Table.DataCell>
            <Table.DataCell>{formaterTidspunkt(opprettet)}</Table.DataCell>
            <Table.DataCell align={'right'}>
                {lenke ??
                    (info && (
                        <BodyShort size={'small'} as={'span'}>
                            {info}
                        </BodyShort>
                    ))}
            </Table.DataCell>
        </Table.Row>
    );
};

type RadProps = {
    typeTekst: string;
    statusTag: React.ReactNode;
    opprettet: string;
    periodeTekst?: string;
    info?: string;
    lenke?: React.ReactNode;
};

const propsForRad = (åpenBehandling: ÅpenBehandling, sak: SakProps): RadProps => {
    const { saksnummer } = sak;

    const typeTekst = typeBehandlingTekst[åpenBehandling.type];

    switch (åpenBehandling.type) {
        case ÅpenBehandlingType.SØKNAD: {
            const { opprettet } = hentSøknad(sak, åpenBehandling.id);

            return {
                typeTekst,
                opprettet,
                statusTag: (
                    <Tag data-color={'neutral'} variant={'outline'} size={'small'}>
                        {'Søknad'}
                    </Tag>
                ),
                info: 'Søknadsbehandling opprettes automatisk',
            };
        }
        case ÅpenBehandlingType.SØKNADSBEHANDLING:
        case ÅpenBehandlingType.REVURDERING: {
            const rammebehandling = hentRammebehandling(sak, åpenBehandling.id);
            const { id, opprettet, vedtaksperiode } = rammebehandling;

            return {
                typeTekst,
                opprettet,
                statusTag: (
                    <BehandlingStatusTags
                        behandling={rammebehandling}
                        kompakt={true}
                        size={'small'}
                    />
                ),
                periodeTekst: vedtaksperiode ? formaterPeriode(vedtaksperiode) : undefined,
                lenke: (
                    <InternLenke href={behandlingUrl({ saksnummer, id })}>
                        {'Til behandlingen'}
                    </InternLenke>
                ),
            };
        }
        case ÅpenBehandlingType.MELDEKORT: {
            const meldekortbehandling = hentMeldekortbehandling(sak, åpenBehandling.id);
            const { id, opprettet, meldeperioder } = meldekortbehandling;

            return {
                typeTekst,
                opprettet,
                statusTag: (
                    <BehandlingStatusTags
                        behandling={meldekortbehandling}
                        kompakt={true}
                        size={'small'}
                    />
                ),
                periodeTekst: meldeperioder
                    .map((meldeperiode) => formaterPeriode(meldeperiode.periode))
                    .join(', '),
                lenke: (
                    <InternLenke href={meldekortbehandlingUrl(saksnummer, id)}>
                        {'Til behandlingen'}
                    </InternLenke>
                ),
            };
        }
        case ÅpenBehandlingType.KLAGE: {
            const klagebehandling = hentKlagebehandling(sak, åpenBehandling.id);
            const { opprettet, status } = klagebehandling;

            return {
                typeTekst,
                opprettet,
                statusTag: erBehandlingSattPåVent(klagebehandling) ? (
                    <Tag data-color={'warning'} size={'small'}>
                        {'Satt på vent'}
                    </Tag>
                ) : (
                    <KlagebehandlingStatusTag status={status} size={'small'} />
                ),
                lenke: (
                    <InternLenke href={finnSisteGyldigeStegForKlage(klagebehandling)}>
                        {'Til behandlingen'}
                    </InternLenke>
                ),
            };
        }
        case ÅpenBehandlingType.TILBAKEKREVING: {
            const { opprettet, status, venter, url, kravgrunnlagTotalPeriode } = hentTilbakekreving(
                sak,
                åpenBehandling.id,
            );

            return {
                typeTekst,
                opprettet,
                statusTag: (
                    <TilbakekrevingStatusTags status={status} venter={venter} size={'small'} />
                ),
                periodeTekst: formaterPeriode(kravgrunnlagTotalPeriode),
                lenke: (
                    <Link href={url} target={'_blank'}>
                        {'Åpne tilbakekreving'}
                        <ExternalLinkIcon aria-hidden />
                    </Link>
                ),
            };
        }
    }
};

const typeBehandlingTekst: Record<ÅpenBehandlingType, string> = {
    SØKNAD: 'Søknad',
    SØKNADSBEHANDLING: 'Søknadsbehandling',
    REVURDERING: 'Revurdering',
    MELDEKORT: 'Meldekortbehandling',
    KLAGE: 'Klage',
    TILBAKEKREVING: 'Tilbakekreving',
} as const;

const antallPerTypeTekst = (åpneBehandlinger: ÅpenBehandling[]): string => {
    const antallPerType = new Map<ÅpenBehandlingType, number>();

    åpneBehandlinger.forEach(({ type }) => {
        antallPerType.set(type, (antallPerType.get(type) ?? 0) + 1);
    });

    return [...antallPerType.entries()]
        .map(([type, antall]) => `${typeBehandlingTekst[type]} (${antall})`)
        .join(', ');
};
