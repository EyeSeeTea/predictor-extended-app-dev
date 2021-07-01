declare module "@dhis2/ui" {
    export function HeaderBar(props: { className?: string; appName: string }): React.ReactElement;
    export type InputFieldProps = {
        className?: string;
        dataTest?: string;
        dense?: boolean;
        disabled?: boolean;
        error?: any;
        helpText?: string;
        initialFocus?: boolean;
        inputWidth?: string;
        label?: string;
        loading?: boolean;
        max?: string;
        min?: string;
        name?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        step?: string;
        tabIndex?: string;
        type?:
            | "button"
            | "checkbox"
            | "color"
            | "date"
            | "datetime-local"
            | "email"
            | "file"
            | "hidden"
            | "image"
            | "month"
            | "number"
            | "password"
            | "radio"
            | "range"
            | "reset"
            | "search"
            | "submit"
            | "tel"
            | "text"
            | "time"
            | "url"
            | "week";
        valid?: any;
        validationText?: string;
        value?: string;
        warning?: any;
        onBlur?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
        onChange?: (data: { value?: string; name?: string }, event: ChangeEvent) => void;
        onFocus?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
    };
    export function InputField(props: InputFieldProps): React.ReactElement;
    export function InputFieldFF(
        props: InputFieldProps & {
            input: any;
            meta: any;
            error?: boolean;
            loading?: boolean;
            showLoadingStatus?: boolean;
            showValidStatus?: boolean;
            valid?: boolean;
            validationText?: string;
        }
    ): React.ReactElement;
    export function Button(props: {
        children?: ReactNode;
        className?: string;
        dataTest?: string;
        destructive?: any;
        disabled?: boolean;
        icon?: JSX.Element;
        initialFocus?: boolean;
        large?: any;
        name?: string;
        primary?: any;
        secondary?: any;
        small?: any;
        tabIndex?: string;
        toggled?: boolean;
        type?: "submit" | "reset" | "button";
        value?: string;
        onBlur?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
        onClick?: (data: { value?: string; name?: string }, event: MouseEvent) => void;
        onFocus?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
    }): React.ReactElement;
    export function Transfer(props: {
        options: {
            label: string;
            value: string;
            disabled?: boolean;
        }[];
        onChange: (...args: any[]) => any;
        addAllText?: string;
        addIndividualText?: string;
        className?: string;
        dataTest?: string;
        disabled?: boolean;
        enableOrderChange?: boolean;
        filterCallback?: (...args: any[]) => any;
        filterCallbackPicked?: (...args: any[]) => any;
        filterLabel?: string;
        filterLabelPicked?: string;
        filterPlaceholder?: string;
        filterPlaceholderPicked?: string;
        filterable?: boolean;
        filterablePicked?: boolean;
        height?: string;
        hideFilterInput?: boolean;
        hideFilterInputPicked?: boolean;
        initialSearchTerm?: string;
        initialSearchTermPicked?: string;
        leftFooter?: React.ReactNode;
        leftHeader?: React.ReactNode;
        loading?: boolean;
        loadingPicked?: boolean;
        maxSelections?: any;
        optionsWidth?: string;
        removeAllText?: string;
        removeIndividualText?: string;
        renderOption?: (...args: any[]) => any;
        rightFooter?: React.ReactNode;
        rightHeader?: React.ReactNode;
        searchTerm?: string;
        searchTermPicked?: string;
        selected?: string[];
        selectedEmptyComponent?: React.ReactNode;
        selectedWidth?: string;
        sourceEmptyPlaceholder?: React.ReactNode;
        onEndReached?: (...args: any[]) => any;
        onEndReachedPicked?: (...args: any[]) => any;
        onFilterChange?: (...args: any[]) => any;
        onFilterChangePicked?: (...args: any[]) => any;
    }): React.ReactElement;
    export type MultiSelectProps = {
        children: React.ReactNode;
        className: string;
        /** Required if `clearable` prop is `true` */
        clearText: string;
        /** Adds a 'clear' option to the menu */
        clearable: boolean;
        dataTest: string;
        dense: boolean;
        disabled: boolean;
        empty: React.ReactNode;
        error: boolean;
        filterPlaceholder: string;
        /** Adds a 'filter' field to the menu */
        filterable: boolean;
        initialFocus: boolean;
        inputMaxHeight: string;
        loading: boolean;
        loadingText: string;
        maxHeight: string;
        /** Required if `filterable` prop is `true` */
        noMatchText: string;
        placeholder: string;
        prefix: string;
        selected: string[];
        tabIndex: string;
        valid: boolean;
        warning: boolean;
        onBlur?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
        onChange?: (data: { value?: string; name?: string }, event: ChangeEvent) => void;
        onFocus?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
    };
    export function MultiSelect(props: MultiSelectProps): React.ReactElement;
    export function MultiSelectFieldFF(
        props: MultiSelectProps & {
            input?: {
                name: string;
                value?: any;
                onBlur?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
                onChange?: (data: { value?: string; name?: string }, event: ChangeEvent) => void;
                onFocus?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
            };
            meta?: {
                error?: string;
                invalid?: boolean;
                touched?: boolean;
                valid?: boolean;
                validating?: boolean;
            };
            error?: boolean;
            loading?: boolean;
            options?: {
                label?: string;
                value?: string;
            }[];
            showLoadingStatus?: boolean;
            showValidStatus?: boolean;
            valid?: boolean;
            validationText?: string;
            onBlur?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
            onFocus?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
        }
    ): React.ReactElement;
    export type SingleSelectProps = {
        className?: string;
        clearText?: string;
        clearable?: boolean;
        dataTest?: string;
        dense?: boolean;
        disabled?: boolean;
        empty?: React.ReactNode;
        error?: boolean;
        filterPlaceholder?: string;
        filterable?: boolean;
        initialFocus?: boolean;
        inputMaxHeight?: string;
        loading?: boolean;
        loadingText?: string;
        maxHeight?: string;
        noMatchText?: string;
        placeholder?: string;
        prefix?: string;
        selected?: string;
        tabIndex?: string;
        valid?: boolean;
        warning?: boolean;
        onBlur?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
        onChange?: (data: { value?: string; name?: string }, event: ChangeEvent) => void;
        onFocus?: (data: { value?: string; name?: string }, event: FocusEvent) => void;
    };
    export function SingleSelectFieldFF(
        props: SingleSelectProps & {
            input: any;
            meta: any;
            options: {
                label?: string;
                value?: string;
            }[];
            error?: boolean;
            loading?: boolean;
            showLoadingStatus?: boolean;
            showValidStatus?: boolean;
            valid?: boolean;
            validationText?: string;
        }
    ): React.ReactElement;
    export function SingleSelect(props: SingleSelectProps): React.ReactElement;
    export function composeValidators(...validators: any[]): any;
    export function integer(): any;
    export function createMinNumber(min: number): any;
    export type TabProps = {
        children: React.ReactNode;
        className?: string;
        dataTest?: string;
        disabled?: boolean;
        icon?: JSX.Element;
        selected?: boolean;
        onClick?: (...args: any[]) => any;
    };
    export function Tab(props: TabProps): React.ReactElement;
    export type TabBarProps = {
        children: React.ReactNode;
        className?: string;
        dataTest?: string;
        fixed?: boolean;
        scrollable?: boolean;
    };
    export function TabBar(props: TabBarProps): React.ReactElement;
    export function Menu(props: {
        children: React.ReactNode;
        className?: string;
        dataTest?: string;
        dense?: boolean;
    }): React.ReactElement;
    export function MenuItem(props: {
        active?: boolean;
        chevron?: boolean;
        className?: string;
        dataTest?: string;
        dense?: boolean;
        destructive?: boolean;
        disabled?: boolean;
        href?: string;
        icon?: React.ReactNode;
        label?: React.ReactNode;
        showSubMenu?: boolean;
        target?: string;
        toggleSubMenu?: (...args: any[]) => any;
        value?: string;
        onClick?: (data: { value?: string; name?: string }, event: MouseEvent) => void;
    }): React.ReactElement;
    export function Pagination(props: {
        page: number;
        pageCount: number;
        pageSize: number;
        total: number;
        className?: string;
        dataTest?: string;
        hidePageSelect?: boolean;
        hidePageSizeSelect?: boolean;
        nextPageText?: string | ((...args: any[]) => any);
        pageSelectText?: string | ((...args: any[]) => any);
        pageSizeSelectText?: string | ((...args: any[]) => any);
        pageSizes?: string[];
        pageSummaryText?: string | ((...args: any[]) => any);
        previousPageText?: string | ((...args: any[]) => any);
        onPageChange: (page: number) => void;
        onPageSizeChange: (pageSize: number) => void;
    }): React.ReactElement;
    export function ButtonStrip(props: {
        children: React.ReactNode;
        className?: string;
        dataTest?: string;
        end?: boolean;
        middle?: boolean;
    }): React.ReactElement;
}
