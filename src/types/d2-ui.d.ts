declare module "@dhis2/ui" {
    export function HeaderBar(props: { className?: string; appName: string }): React.ReactElement;
    export function InputField(props: {
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
        onBlur?: (...args: any[]) => any;
        onChange?: (...args: any[]) => any;
        onFocus?: (...args: any[]) => any;
    }): React.ReactElement;
    export function InputFieldFF(props: {
        input: any;
        meta: any;
        error?: boolean;
        loading?: boolean;
        showLoadingStatus?: boolean;
        showValidStatus?: boolean;
        valid?: boolean;
        validationText?: string;
        onBlur?: (...args: any[]) => any;
        onFocus?: (...args: any[]) => any;
    }): React.ReactElement;
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
        onBlur?: (...args: any[]) => any;
        onClick?: (...args: any[]) => any;
        onFocus?: (...args: any[]) => any;
    }): React.ReactElement;
    export function composeValidators(...validators: any[]): any;
    export function integer(): any;
    export function createMinNumber(min: number): any;
}
