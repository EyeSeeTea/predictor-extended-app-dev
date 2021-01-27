import _ from "lodash";
import { UseCase } from "../../compositionRoot";
import i18n from "../../locales";
import { promiseMap } from "../../utils/promises";
import { ExcelModel, getColumn, getRow } from "../entities/Excel";
import { Predictor, predictorColumns } from "../entities/Predictor";
import { Validation } from "../entities/Validation";
import { ExcelRepository } from "../repositories/ExcelRepository";
import { MetadataRepository } from "../repositories/MetadataRepository";

export class ReadPredictorsExcelUseCase implements UseCase {
    constructor(
        private excelRepository: ExcelRepository,
        private metadataRepository: MetadataRepository
    ) {}

    public async execute(files: File[]): Promise<ImportResult> {
        const excelPredictors = await promiseMap(files, async file => {
            const buffer = await file.arrayBuffer();
            const excelFile = await this.excelRepository.readFile(buffer);
            return this.buildPredictors(excelFile);
        });

        return {
            predictors: _.flatMap(excelPredictors, ({ predictors }) => predictors),
            warnings: _.flatMap(excelPredictors, ({ warnings }) => warnings ?? []),
        };
    }

    public async buildPredictors(excelFile: ExcelModel): Promise<ImportResult> {
        const { cells } = excelFile.sheets["Predictors"];

        const columns: Record<number, string> = _(cells)
            .filter(item => getRow(item.ref) === 0)
            .map(item => [getColumn(item.ref), String(item.contents.value)])
            .fromPairs()
            .value();

        const predictors = await this.cleanPredictors(
            _(cells)
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
                .value()
        );

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

    private async cleanPredictors(
        objects: Record<string, string>[]
    ): Promise<Partial<Predictor>[]> {
        return promiseMap(objects, async object => {
            const output = await this.metadataRepository.lookup("dataElements", object.output);
            const outputCombo = await this.metadataRepository.lookup(
                "categoryOptionCombos",
                object.outputCombo
            );

            const predictorGroups = _.compact(
                await promiseMap(object.predictorGroups?.split(",") ?? [], group =>
                    this.metadataRepository.lookup("predictorGroups", group)
                )
            );

            const organisationUnitLevels = _.compact(
                await promiseMap(object.organisationUnitLevels?.split(",") ?? [], level =>
                    this.metadataRepository.lookup("organisationUnitLevels", level)
                )
            );

            return {
                ...object,
                output,
                outputCombo,
                predictorGroups,
                organisationUnitLevels,
                generator: { expression: object.generator },
                sampleSkipTest: { expression: object.sampleSkipTest },
            };
        });
    }
}

export interface ImportResult {
    predictors: Partial<Predictor>[];
    warnings?: Validation<"UNKNOWN_COLUMN">[];
}
