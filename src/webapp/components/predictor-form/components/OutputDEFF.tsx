import React from "react";
//import { SingleSelectFieldFF } from "@dhis2/ui";
import { useAppContext } from "../../../contexts/app-context";
import { useFuture } from "../../../hooks/useFuture";
//import { Metadata } from "../../../../domain/entities/Metadata";
import { SingleSelectFF } from "./SingleSelectFF";
import { SingleSelectFieldFFProps } from "@dhis2/ui";
import { NamedRef } from "../../../../domain/entities/DHIS2";
import { TransferOption } from "@dhis2/ui";

export const OutputDEFF: React.FC<Omit<SingleSelectFieldFFProps, "options"|"onChange">> = props => {
    const { compositionRoot } = useAppContext();
    //const [fullOutput, setFullOutput] = React.useState<Metadata[]>([]);
    //const [selected, setSelected] = React.useState<any>();
    const { data: output = [] } = useFuture(() => 
         compositionRoot.usecases
            .getDataElements()
            .map((objects ) => buildTransferOptions(objects))
        , []);
    console.log(output);
    console.log(props);
    //console.log(selected);
    //<SingleSelectFieldFF {...props} filterable options={output} />
    return <SingleSelectFF
    {...props}
    filterable
    options={output}
/>;
};


const buildTransferOptions = (options: NamedRef[]): TransferOption[] => {
    return options.map(({ id, name }) => ({ value: id, label: name }));
};
