import { Table } from '@navikt/ds-react';
import { BenkSøknaderKolonne, BenkSøknadsbehandling } from '../typer/søknader';
import { BenkV2Sortering } from '../typer/felles';
import { formaterTidspunkt } from '~/utils/date';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';
import { RammebehandlingResultatTag } from '~/lib/rammebehandling/felles/resultat-tag/RammebehandlingResultatTag';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { behandlingUrl } from '~/utils/urls';
import { FnrCelle } from '../felles/FnrCelle';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { VentestatusCelle } from '../felles/VentestatusCelle';
import { useBenkSortering } from '../felles/useBenkSortering';
import { BenkBehandlingMeny } from '../felles/BenkBehandlingMeny';
import { Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { kanFortsetteBenkRad } from '../benkV2Utils';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { HStack } from '@navikt/ds-react';

type Props = {
    behandlinger: BenkSøknadsbehandling[];
    aktivSortering: BenkV2Sortering<BenkSøknaderKolonne>;
};

export const SøknaderTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);
    const { innloggetSaksbehandler } = useSaksbehandler();

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader sortable={true} sortKey={BenkSøknaderKolonne.fnr}>
                        {'Fødselsnummer'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkSøknaderKolonne.søknadstype}>
                        {'Søknadstype'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>{'Resultat'}</Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkSøknaderKolonne.status}>
                        {'Status'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>{'Ventestatus'}</Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkSøknaderKolonne.kravtidspunkt}>
                        {'Kravtidspunkt'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkSøknaderKolonne.sistEndret}>
                        {'Sist endret'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkSøknaderKolonne.saksbehandler}>
                        {'Saksbehandler'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkSøknaderKolonne.beslutter}>
                        {'Beslutter'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <Table.HeaderCell scope={'row'}>
                            <FnrCelle fnr={behandling.fnr} saksnummer={behandling.saksnummer} />
                        </Table.HeaderCell>
                        <Table.DataCell>{søknadstypeTekst[behandling.søknadstype]}</Table.DataCell>
                        <Table.DataCell>
                            {behandling.resultat ? (
                                <RammebehandlingResultatTag resultat={behandling.resultat} />
                            ) : (
                                '-'
                            )}
                        </Table.DataCell>
                        <Table.DataCell>
                            <BenkStatusTag
                                status={behandling.status}
                                erUnderkjent={behandling.erUnderkjent}
                            />
                        </Table.DataCell>
                        <Table.DataCell>
                            <VentestatusCelle ventestatus={behandling.ventestatus} />
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTidspunkt(behandling.kravtidspunkt)}
                        </Table.DataCell>
                        <Table.DataCell>{formaterTidspunkt(behandling.sistEndret)}</Table.DataCell>
                        <Table.DataCell>
                            {behandling.saksbehandler ?? 'Ikke tildelt'}
                        </Table.DataCell>
                        <Table.DataCell>{behandling.beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                        <Table.DataCell align={'right'}>
                            <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
                                <InternLenkeKnapp
                                    href={behandlingUrl({
                                        saksnummer: behandling.saksnummer,
                                        id: behandling.id,
                                    })}
                                >
                                    {kanFortsetteBenkRad(
                                        behandling,
                                        innloggetSaksbehandler.navIdent,
                                    )
                                        ? 'Fortsett'
                                        : 'Se behandling'}
                                </InternLenkeKnapp>
                                <BenkBehandlingMeny
                                    behandling={behandling}
                                    behandlingstype={Rammebehandlingstype.SØKNADSBEHANDLING}
                                />
                            </HStack>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
