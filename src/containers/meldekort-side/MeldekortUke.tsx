import {BodyShort, Heading, Select, Table} from '@navikt/ds-react';
import {
    CheckmarkCircleFillIcon,
    ExclamationmarkTriangleFillIcon,
    XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';

import React, { useState } from 'react';
import Divider from "../../components/divider/Divider";

interface MeldekortUkeProps {
    meldekortUke?: MeldekortDag[];
    ukesnummer: number;
    fom: number;
    tom: number;
}

export const MeldekortUke = ({ ukesnummer, fom, tom, meldekortUke }: MeldekortUkeProps) => {
    const meldekortUker: MeldekortDag[] = [
        { dag: 'Mandag', dato: new Date('2023-11-13'), status: MeldekortStatus.DELTATT },
        { dag: 'Tirsdag', dato: new Date('2023-11-14'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Onsdag', dato: new Date('2023-11-15'), status: MeldekortStatus.FRAVÆR_SYK },
        { dag: 'Torsdag', dato: new Date('2023-11-16'), status: MeldekortStatus.FRAVÆR_SYKT_BARN },
        { dag: 'Fredag', dato: new Date('2023-11-17'), status: MeldekortStatus.DELTATT },
        { dag: 'Lørdag', dato: new Date('2023-11-18'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Søndag', dato: new Date('2023-11-19'), status: MeldekortStatus.IKKE_DELTATT },
    ];

    function velgIkon(deltattEllerFravær: String) {
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
    var ukedagListe = meldekortUker.map((ukedag, index) => {
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
                        >
                            <option value="Deltatt">Deltatt i tiltaket</option>
                            <option value="Ikke_deltatt">Ikke deltatt i tiltaket</option>
                            <option value="Lønn">Lønn for tid i tiltaket</option>
                            <option value="sykefravær">Fravær syk</option>
                            <option value="velferdPermisjon">Fravær velferd</option>
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
