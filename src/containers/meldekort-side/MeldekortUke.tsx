import {BodyShort, Heading, Select, Table} from '@navikt/ds-react';
import {
    CheckmarkCircleFillIcon,
    ExclamationmarkTriangleFillIcon,
    XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';
import React from 'react';
import Divider from "../../components/divider/Divider";

interface MeldekortUkeProps {
    meldekortUke: MeldekortDag[];
    ukesnummer: number;
    fom: number;
    tom: number;
    handleOppdaterMeldekort: (index: number, status: MeldekortStatus, ukeNr: number) => void;
    ukeNr: number;
}

export const MeldekortUke = ({ ukesnummer, meldekortUke, handleOppdaterMeldekort, ukeNr }: MeldekortUkeProps) => {
    function velgIkon(deltattEllerFravær: MeldekortStatus) {
        switch (deltattEllerFravær) {
            case MeldekortStatus.DELTATT:
                return <CheckmarkCircleFillIcon style={{ color: 'green' }} />;

            case MeldekortStatus.IKKE_DELTATT:
            case MeldekortStatus.LØNN_FOR_TID_I_ARBEID:
                return <XMarkOctagonFillIcon style={{ color: 'red' }} />;

            case MeldekortStatus.FRAVÆR_SYK:
            case MeldekortStatus.FRAVÆR_SYKT_BARN:
            case MeldekortStatus.FRAVÆR_VELFERD:
                return <ExclamationmarkTriangleFillIcon style={{ color: 'orange' }} />;
        }
    }

    function velgStatus(status: string) {
        switch (status) {
            case 'Deltatt':
                return MeldekortStatus.DELTATT;
            case 'Ikke deltatt':
                return MeldekortStatus.IKKE_DELTATT;
            case 'Lønn for tid i arbeid':
                return MeldekortStatus.LØNN_FOR_TID_I_ARBEID;
            case 'Fravær syk':
                return MeldekortStatus.FRAVÆR_SYK;
            case 'Fravær sykt barn':
                return MeldekortStatus.FRAVÆR_SYKT_BARN;
            case 'Fravær velferd':
                return MeldekortStatus.FRAVÆR_VELFERD;
            default:
                return MeldekortStatus.IKKE_DELTATT;
        }
    }

    function oppdaterMeldekort(index: number, status: string) {
        const meldekortStatus = velgStatus(status);
        handleOppdaterMeldekort(index, meldekortStatus, ukeNr);
    }

    var ukedagListe = meldekortUke.map((ukedag, index) => {
        return (
            <>
                <div style={{display:'flex', width:'100%', padding:'0.5rem', alignItems:'center'}}>
                    <div style={{width:'8%'}}>{velgIkon(ukedag.status)}</div>
                    <div style={{width:'30%'}}><BodyShort size="small">{ukedag.dag} {ukedag.dato.getDate()}</BodyShort></div>
                    <div style={{width:'62%'}}>
                        <Select
                            label="Deltatt Eller Fravær"
                            id="deltattEllerFravær"
                            size="small"
                            hideLabel
                            defaultValue={ukedag.status}
                            onChange={(e) => oppdaterMeldekort(index, e.target.value)}
                        >
                            <option value={MeldekortStatus.DELTATT}>Deltatt i tiltaket</option>
                            <option value={MeldekortStatus.IKKE_DELTATT}>Ikke deltatt i tiltaket</option>
                            <option value={MeldekortStatus.LØNN_FOR_TID_I_ARBEID}>Lønn for tid i arbeid</option>
                            <option value={MeldekortStatus.FRAVÆR_SYK}>Fravær syk</option>
                            <option value={MeldekortStatus.FRAVÆR_SYKT_BARN}>Fravær sykt barn</option>
                            <option value={MeldekortStatus.FRAVÆR_VELFERD}>Fravær velferd</option>
                        </Select>
                    </div>
                </div>
                <Divider />
            </>

        );
    });

    return (
        <div style={{padding:'1rem'}}>
            <div style={{marginBottom:'1.5rem', marginLeft:'1rem'}}>
                <Heading size="small">Uke {ukesnummer} - Jan 2024</Heading>
            </div>
            <Divider />
            {ukedagListe}
        </div>
    );
};
