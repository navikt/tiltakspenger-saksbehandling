import React from 'react';
import { People } from '@navikt/ds-icons';
import Personalia from '../../types/Personalia';
import styles from './PersonaliaHeader.module.css';

interface PersonaliaHeaderProps {
    personalia: Personalia;
}

const PersonaliaHeader = ({ personalia }: PersonaliaHeaderProps) => {
    const { fornavn, etternavn, ident } = personalia;
    return (
        <div className={styles.personaliaHeader}>
            <People className={styles.personaliaHeader__personIcon} />
            <span className={styles.personaliaHeader__name}>
                {fornavn} {etternavn}
            </span>
            <span className={styles.personaliaHeader__ident}>{ident}</span>
        </div>
    );
};

export default PersonaliaHeader;
