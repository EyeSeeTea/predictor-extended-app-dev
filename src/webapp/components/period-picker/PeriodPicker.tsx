import { InputField } from "@dhis2/ui";
import _ from "lodash";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { buildPeriodDate, PeriodObject, periods, SchedulerPeriod } from "../../../domain/entities/SchedulerPeriod";
import i18n from "../../../locales";
import { UpdateMethod } from "../../../utils/utils";
import { Dropdown } from "../dropdown/Dropdown";

export interface PeriodPickerProps {
    className?: string;
    title?: string;
    period: PeriodObject;
    onChange: UpdateMethod<PeriodObject>;
}

export const PeriodPicker: React.FC<PeriodPickerProps> = props => {
    const { period: objectWithPeriod, onChange, title = i18n.t("Period"), className } = props;

    const { type, startDate, endDate } = objectWithPeriod;

    const periodItems = useMemo(
        () =>
            _(periods)
                .mapValues((value, key) => ({ ...value, id: key as SchedulerPeriod }))
                .values()
                .value(),
        []
    );

    const updatePeriod = useCallback(
        (type: SchedulerPeriod) => {
            onChange(prevState => {
                if (type === "FIXED") {
                    const { startDate, endDate } = buildPeriodDate({ type: prevState.type });
                    return { type, startDate, endDate };
                } else {
                    return { type };
                }
            });
        },
        [onChange]
    );

    const updateStartDate = useCallback(
        ({ value }: { value?: string }) => {
            const startDate = value ? new Date(value) : new Date();
            onChange({ ...objectWithPeriod, startDate });
        },
        [objectWithPeriod, onChange]
    );

    const updateEndDate = useCallback(
        ({ value }: { value?: string }) => {
            const endDate = moment(value).toDate();
            onChange({ ...objectWithPeriod, endDate });
        },
        [objectWithPeriod, onChange]
    );

    return (
        <div className={className}>
            <Dropdown<SchedulerPeriod>
                label={title}
                items={periodItems}
                value={type}
                onChange={updatePeriod}
                hideEmpty={true}
            />

            {type === "FIXED" && (
                <React.Fragment>
                    <InputField
                        type="date"
                        label={`${i18n.t("Start date")}`}
                        value={startDate ? formatDate(startDate) : ""}
                        onChange={updateStartDate}
                    />
                    <InputField
                        type="date"
                        label={`${i18n.t("End date")}`}
                        value={endDate ? formatDate(endDate) : ""}
                        onChange={updateEndDate}
                    />
                </React.Fragment>
            )}
        </div>
    );
};

function formatDate(date: Date) {
    return moment(date).format("YYYY-MM-DD");
}
