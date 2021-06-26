import { TextField } from "@material-ui/core";

interface ExpressionDescriptionProps {
    descriptionLabel: string;
    descriptionValue: string;
    onDescriptionChange: (...args: any[]) => any;
    errorText?: string;
}

export const ExpressionDescription: React.FC<ExpressionDescriptionProps> = ({
    descriptionLabel,
    descriptionValue,
    onDescriptionChange,
    errorText,
    ...textFieldProps
}) => {
    const handleDescriptionChange = (event: any) => {
        const descriptionValue = event.target.value;
        onDescriptionChange(descriptionValue);
    };

    return (
        <div className="expression-description">
            <TextField
                {...textFieldProps}
                value={descriptionValue}
                label={errorText ?? descriptionLabel}
                onChange={handleDescriptionChange}
                fullWidth
                error={!!errorText}
            />
        </div>
    );
};
