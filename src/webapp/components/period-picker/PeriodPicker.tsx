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
    const { period, onChange, title = i18n.t("Period"), className } = props;
    const { type, startDate, endDate } = period;

    const autoPeriod = useMemo(() => buildPeriodDate({ type }), [type]);

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
            onChange({ ...period, startDate });
        },
        [period, onChange]
    );

    const updateEndDate = useCallback(
        ({ value }: { value?: string }) => {
            const endDate = moment(value).toDate();
            onChange({ ...period, endDate });
        },
        [period, onChange]
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

            <InputField
                type="date"
                label={`${i18n.t("Start date")}`}
                value={formatDate(startDate ?? autoPeriod.startDate)}
                onChange={updateStartDate}
                disabled={type !== "FIXED"}
            />

            <InputField
                type="date"
                label={`${i18n.t("End date")}`}
                value={formatDate(endDate ?? autoPeriod.endDate)}
                onChange={updateEndDate}
                disabled={type !== "FIXED"}
            />
        </div>
    );
};

function formatDate(date: Date) {
    return moment(date).format("YYYY-MM-DD");
}
