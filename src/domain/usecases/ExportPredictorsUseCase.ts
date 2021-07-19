import _ from "lodash";
import { UseCase } from "../../compositionRoot";
import {
    getPredictorName,
    PredictorFormField,
    predictorFormFields,
} from "../../webapp/components/predictor-form/PredictorForm";
import { ExcelCell, ExcelModel } from "../entities/Excel";
import { Predictor } from "../entities/Predictor";
import { ExcelRepository } from "../repositories/ExcelRepository";
import { FileRepository } from "../repositories/FileRepository";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class ExportPredictorsUseCase implements UseCase {
    constructor(
        private predictorRepository: PredictorRepository,
        private excelRepository: ExcelRepository,
        private fileRepository: FileRepository
    ) {}

    public async execute(ids: string[]) {
        const emptyFile = await this.excelRepository.createFile();
        const predictors = await this.predictorRepository.get(ids).toPromise();

        const definedNames = _(predictorFormFields)
            .map((field, index) => [
                `_${field}`,
                {
                    ref: {
                        type: "cell" as const,
                        sheet: "Metadata",
                        address: { row: index + 1, column: 0 },
                    },
                    contents: { type: "text" as const, value: getPredictorName(field) },
                },
            ])
            .fromPairs()
            .value();

        const cells: ExcelCell[] = [
            ...predictorFormFields.map((field: string, index: number) => ({
                ref: {
                    type: "cell" as const,
                    sheet: "Predictors",
                    address: { row: 0, column: index },
                },
                contents: { type: "formula" as const, value: `_${field}` },
            })),
            ..._.flatMap(predictors, (predictor: Predictor, row: number) =>
                predictorFormFields.map((key: PredictorFormField, column: number) => ({
                    ref: {
                        type: "cell" as const,
                        sheet: "Predictors",
                        address: { row: row + 2, column },
                    },
                    contents: { type: "text" as const, value: formatValue(predictor, key) ?? "" },
                }))
            ),
        ];

        const file: ExcelModel = {
            definedNames,
            sheets: {
                Predictors: { cells },
                Metadata: { cells: _.toPairs(definedNames).map(([_key, value]) => value) },
            },
        };

        const buffer = await this.excelRepository.writeFile(emptyFile, file);
        this.fileRepository.download({ type: "excel", name: "Test", buffer });
    }
}

// TODO: This should be a mapper and be improved
const formatValue = (predictor: Predictor, key: PredictorFormField): string | number => {
    const value = _.get(predictor, key);
    if (!value) return "";

    switch (key) {
        case "output":
        case "outputCombo":
            return predictor[key]?.name ?? "";
        case "predictorGroups":
            return predictor[key]?.map(({ name }) => name).join(",") ?? "";
        case "generator":
        case "sampleSkipTest":
            return predictor[key]?.expression ?? "";
    }

    if (typeof value === "string" || typeof value === "number") return value;

    return "";
};
