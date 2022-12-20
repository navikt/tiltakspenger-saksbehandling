import React from 'react';
import { Tag } from '@navikt/ds-react';
import { People } from '@navikt/ds-icons';
import Personalia from '../../types/Personalia';
import styles from './PersonaliaHeader.module.css';

interface PersonaliaHeaderProps {
    personalia: Personalia;
}

const PersonaliaHeader = ({ personalia }: PersonaliaHeaderProps) => {
    const { fornavn, etternavn, ident, skjermet, strengtFortrolig, fortrolig } = personalia;
    return (
        <div className={styles.personaliaHeader}>
            <People className={styles.personaliaHeader__personIcon} />
            <span data-testid="nav-personalia-header-name" className={styles.personaliaHeader__name}>
                {fornavn} {etternavn}
            </span>
            <span data-testid="nav-personalia-header-ident" className={styles.personaliaHeader__ident}>
                {ident}
            </span>
            {strengtFortrolig && (
                <Tag variant="error" className={styles.personaliaHeader__tag}>
                    Søker har strengt fortrolig adresse
                </Tag>
            )}
            {fortrolig && (
                <Tag variant="error" className={styles.personaliaHeader__tag}>
                    Søker har fortrolig adresse
                </Tag>
            )}
            {skjermet && (
                <Tag variant="error" className={styles.personaliaHeader__tag}>
                    Søker er skjermet
                </Tag>
            )}
            {personalia.finnBarnMedFortroligAdresse().length > 0 && (
                <Tag variant="error" className={styles.personaliaHeader__tag}>
                    Barn har fortrolig adresse
                </Tag>
            )}
            {personalia.finnBarnMedStrengtFortroligAdresse().length > 0 && (
                <Tag variant="error" className={styles.personaliaHeader__tag}>
                    Barn har strengt fortrolig adresse
                </Tag>
            )}
        </div>
    );
};

export default PersonaliaHeader;
