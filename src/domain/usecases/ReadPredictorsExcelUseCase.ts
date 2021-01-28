import _ from "lodash";
import { UseCase } from "../../compositionRoot";
import i18n from "../../locales";
import { promiseMap } from "../../utils/promises";
import { getTemplates, interpolate } from "../../utils/strings";
import { generateUid } from "../../utils/uid";
import { ExcelCell, ExcelModel, getColumn, getRow } from "../entities/Excel";
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
        const { columns, warnings: columnWarnings } = this.buildColumns(cells);

        const entries = _(cells)
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

        const { dictionary, warnings: dictionaryWarnings } = await this.buildDictionary(entries);
        const predictors = await this.cleanPredictors(entries, dictionary);
        const warnings = [...columnWarnings, ...dictionaryWarnings];

        return { predictors, warnings };
    }

    private buildColumns(cells: ExcelCell[]) {
        const columns: Record<number, string> = _(cells)
            .filter(item => getRow(item.ref) === 0)
            .map(item => [getColumn(item.ref), String(item.contents.value)])
            .fromPairs()
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

        return { columns, warnings };
    }

    private async buildDictionary(entries: Record<string, string>[]) {
        const templates = _(entries)
            .flatMap(({ generator, sampleSkipTest }) => [generator, sampleSkipTest])
            .compact()
            .flatMap(formula => getTemplates(formula))
            .value();

        const metadata = await this.metadataRepository.lookup(templates);

        const dictionary = _(metadata)
            .values()
            .flatten()
            .flatMap(({ id, name, code }) => [
                [name, id],
                [code, id],
            ])
            .fromPairs()
            .value();

        const warnings: Validation<"UNKNOWN_REF">[] = _(templates)
            .difference(_.keys(dictionary))
            .map(template => ({
                id: template,
                error: "UNKNOWN_REF" as const,
                description: i18n.t("Reference {{template}} was not found on this instance", {
                    template,
                }),
            }))
            .value();

        return { dictionary, warnings };
    }

    private async cleanPredictors(
        entries: Record<string, string | undefined>[],
        dictionary: Record<string, string>
    ): Promise<Partial<Predictor>[]> {
        return promiseMap(entries, async object => {
            const output = await this.metadataRepository.search(
                "dataElements",
                object.output ?? ""
            );
            const outputCombo = await this.metadataRepository.search(
                "categoryOptionCombos",
                object.outputCombo ?? ""
            );

            const predictorGroups = _.compact(
                await promiseMap(object.predictorGroups?.split(",") ?? [], group =>
                    this.metadataRepository.search("predictorGroups", group)
                )
            );

            const organisationUnitLevels = _.compact(
                await promiseMap(object.organisationUnitLevels?.split(",") ?? [], level =>
                    this.metadataRepository.search("organisationUnitLevels", level)
                )
            );

            return {
                ...object,
                id: object.id ?? generateUid(),
                output,
                outputCombo,
                predictorGroups,
                organisationUnitLevels,
                generator: { expression: interpolate(object.generator ?? "", dictionary) },
                sampleSkipTest: {
                    expression: interpolate(object.sampleSkipTest ?? "", dictionary),
                },
            };
        });
    }
}

export interface ImportResult {
    predictors: Partial<Predictor>[];
    warnings?: Validation<"UNKNOWN_COLUMN" | "UNKNOWN_REF">[];
}
