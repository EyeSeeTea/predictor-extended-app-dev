import _ from "lodash";
import { UseCase } from "../../compositionRoot";
import i18n from "../../locales";
import { promiseMap } from "../../utils/promises";
import { ExcelModel, getColumn, getRow } from "../entities/Excel";
import { Predictor, predictorColumns } from "../entities/Predictor";
import { Validation } from "../entities/Validation";
import { ExcelRepository } from "../repositories/ExcelRepository";

export class ReadPredictorsExcelUseCase implements UseCase {
    constructor(private excelRepository: ExcelRepository) {}

    public async execute(files: File[]): Promise<ImportResult> {
        const listPredictors = await promiseMap(files, async file => {
            const buffer = await file.arrayBuffer();
            const excelFile = await this.excelRepository.readFile(buffer);
            return this.buildPredictors(excelFile);
        });

        return {
            predictors: _.flatMap(listPredictors, ({ predictors }) => predictors),
            warnings: _.flatMap(listPredictors, ({ warnings }) => warnings ?? []),
        };
    }

    public buildPredictors(excelFile: ExcelModel): ImportResult {
        const { cells } = excelFile.sheets["Predictors"];

        const columns: Record<number, string> = _(cells)
            .filter(item => getRow(item.ref) === 0)
            .map(item => [getColumn(item.ref), String(item.contents.value)])
            .fromPairs()
            .value();

        //@ts-ignore TODO FIXME Add validation
        const predictors: Predictor[] = _(cells)
            .groupBy(item => getRow(item.ref))
            .omitBy((_value, key) => parseInt(key) <= 1)
            .values()
            .map(cells =>
                _.fromPairs(
                    _.compact(
                        cells?.map(cell => {
                            const column = columns[getColumn(cell.ref)];
                            return column ? [column, String(cell.contents.value)] : undefined;
                        })
                    )
                )
            )
            .value();

        const warnings: Validation<"UNKNOWN_COLUMN">[] = _(columns)
            .values()
            .difference(predictorColumns)
            .map(column => ({
                id: column,
                error: "UNKNOWN_COLUMN" as const,
                description: i18n.t("Column {{column}} not valid for type predictor", { column }),
            }))
            .value();

        return { predictors, warnings };
    }
}

export interface ImportResult {
    predictors: Predictor[];
    warnings?: Validation<"UNKNOWN_COLUMN">[];
}
