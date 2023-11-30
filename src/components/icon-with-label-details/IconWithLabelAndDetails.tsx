import {BodyShort, Detail, Label} from "@navikt/ds-react";
import React from "react";

interface LabelWithIconAndDiscriptionProps {
    iconRenderer: () => React.ReactNode;
    label: string;
    discription: string;
}

export const IconWithLabelAndDetails = ({ iconRenderer, label, discription }: LabelWithIconAndDiscriptionProps) => {
    return (
        <div style={{margin:'1rem'}}>
            <span style={{display:'flex', alignItems:'center'}}>
                {iconRenderer()}<Label size="small" style={{paddingLeft:'0.5rem'}}>{label}</Label>
            </span>
            <BodyShort size="small" style={{marginLeft:'1.6rem'}}>{discription}</BodyShort>
        </div>
    )
}

export default IconWithLabelAndDetails;
