import { Tab, TabBar } from "@dhis2/ui";
import { LinearProgress } from "@material-ui/core";
import React, { ReactElement } from "react";
import styled from "styled-components";

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
                    <StyledTab
                        key={`tab-${item.value}`}
                        onClick={(_val, event) => {
                            event.preventDefault();
                            onClick(item.value);
                        }}
                        selected={selected === item.value}
                        disabled={disabled.includes(item.value)}
                        icon={item.icon}
                    >
                        {item.label}
                    </StyledTab>
                ))}
            </TabBar>
            {loading && <LinearProgress />}
        </React.Fragment>
    );
}

const StyledTab = styled(Tab)`
    outline: none;
`;
