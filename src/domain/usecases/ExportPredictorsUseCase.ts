import _ from "lodash";
import { UseCase } from "../../compositionRoot";
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
        const predictors = await this.predictorRepository.get(ids);

        const data: ExcelCell[] = _.flatten([
            columns.map((column: string, index: number) => ({
                ref: {
                    type: "cell" as const,
                    sheet: "Predictors",
                    address: { row: 0, column: index },
                },
                contents: { type: "text" as const, value: column },
            })),
            ...predictors.map((predictor: Predictor, row: number) =>
                columns.map((key: keyof Predictor, column: number) => ({
                    ref: {
                        type: "cell" as const,
                        sheet: "Predictors",
                        address: { row: row + 2, column },
                    },
                    contents: { type: "text" as const, value: formatValue(predictor, key) ?? "" },
                }))
            ),
        ]);

        const file: ExcelModel = {
            definedNames: {},
            sheets: { Predictors: { data } },
        };

        const buffer = await this.excelRepository.writeFile(emptyFile, file);
        this.fileRepository.download({ type: "excel", name: "Test", buffer });
    }
}

const columns: Array<keyof Predictor> = [
    "id",
    "code",
    "name",
    "description",
    "output",
    "outputCombo",
    "periodType",
    "annualSampleCount",
    "generator",
    "organisationUnitLevels",
    "predictorGroups",
    "sampleSkipTest",
    "sequentialSampleCount",
    "sequentialSkipCount",
];

// TODO: This should be a mapper and be improved
const formatValue = (predictor: Predictor, key: keyof Predictor): string | number => {
    const value = predictor[key];
    if (!value) return "";

    if (key === "output" || key === "outputCombo") return predictor[key]?.name ?? "";
    if (key === "predictorGroups") return predictor[key]?.map(({ name }) => name).join(",") ?? "";
    if (key === "generator" || key === "sampleSkipTest") return predictor[key]?.expression ?? "";
    if (typeof value === "string" || typeof value === "number") return value;

    return "";
};
