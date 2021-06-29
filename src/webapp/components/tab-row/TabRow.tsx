import { Tab, TabBar } from "@dhis2/ui";
import { LinearProgress } from "@material-ui/core";
import React, { ReactElement } from "react";

export interface TabRowProps<T extends string> {
    options: TabRowOption<T>[];
    onClick: (value: T) => void;
    selected?: T;
    disabled?: T[];
    fixed?: boolean;
    scrollable?: boolean;
    loading?: boolean;
}

export interface TabRowOption<T extends string> {
    value: T;
    label: string;
    icon?: ReactElement;
}

export function TabRow<T extends string>({
    loading,
    options,
    onClick,
    selected,
    disabled = [],
    fixed,
    scrollable,
}: TabRowProps<T>) {
    return (
        <React.Fragment>
            <TabBar fixed={fixed} scrollable={scrollable}>
                {options.map(item => (
                    <Tab
                        key={`tab-${item.value}`}
                        onClick={() => onClick(item.value)}
                        selected={selected === item.value}
                        disabled={disabled.includes(item.value)}
                        icon={item.icon}
                    >
                        {item.label}
                    </Tab>
                ))}
            </TabBar>
            {loading && <LinearProgress />}
        </React.Fragment>
    );
}
