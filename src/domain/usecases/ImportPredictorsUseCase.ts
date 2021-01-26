import _ from "lodash";
import { UseCase } from "../../compositionRoot";
import { ExcelModel, getColumn, getRow } from "../entities/Excel";
import { Predictor } from "../entities/Predictor";
import { ExcelRepository } from "../repositories/ExcelRepository";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class ImportPredictorsUseCase implements UseCase {
    constructor(
        private predictorRepository: PredictorRepository,
        private excelRepository: ExcelRepository
    ) {}

    public async execute(files: File[]) {
        for (const file of files) {
            const buffer = await file.arrayBuffer();
            const excelFile = await this.excelRepository.readFile(buffer);
            const predictors = this.buildPredictors(excelFile);
            console.log({ excelFile, repo: this.predictorRepository, predictors });
        }
    }

    public buildPredictors(excelFile: ExcelModel): Predictor[] {
        const { cells } = excelFile.sheets["Predictors"];

        const columns = _(cells)
            .filter(item => getRow(item.ref) === 0)
            .map(item => [getColumn(item.ref), String(item.contents.value)])
            .fromPairs()
            .value();

        return _(cells)
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
            .value() as Predictor[];
    }
}
