import { FieldState, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import React, { useCallback } from "react";
import { NamedRef } from "../../../../domain/entities/DHIS2";
import { useAppContext } from "../../../contexts/app-context";
import { useFuture } from "../../../hooks/useFuture";

export const CategoryOptionComboFF: React.FC<CategoryOptionComboFFProps> = ({ input }) => {
    const { compositionRoot } = useAppContext();
    const { data: dataElements = [] } = useFuture(
        () =>
            compositionRoot.usecases
                .listMetadata(
                    "dataElements",
                    {},
                    {
                        categoryCombo: {
                            id: true,
                            name: true,
                            code: true,
                            categoryOptionCombos: { id: true, name: true },
                        },
                    }
                )
                .map(({ objects }) => buildOptions(objects)),
        []
    );
    const onChange = useCallback(
        ({ selected }) => {
            const dataElement = dataElements.find(item => item.value === selected);
            if (dataElement) input.onChange({ id: dataElement.value, name: dataElement.label });
        },
        [dataElements, input]
    );

    if (dataElements.length === 0) return null;

    return (
        <SingleSelectField onChange={onChange} selected={input.value.id}>
            {dataElements.map(({ value, label }) => (
                <SingleSelectOption value={value} label={label} key={value} />
            ))}
        </SingleSelectField>
    );
};

export interface CategoryOptionComboFFProps {
    input: any;
    meta: FieldState<NamedRef>;
}

const buildOptions = (options: any[]): { label: string; value: string }[] => {
    return options.map(({ id, categoryCombo: { code } }) => ({ value: id, label: code }));
};
