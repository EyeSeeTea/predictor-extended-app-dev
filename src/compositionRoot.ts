import { ExcelXlsxPopulateRepository } from "./data/ExcelXlsxPopulateRepository";
import { PredictorD2ApiRepository } from "./data/PredictorD2ApiRepository";
import { ExportExcelUseCase } from "./domain/usecases/excel/ExportExcelUseCase";
import { GetPredictorGroupsUseCase } from "./domain/usecases/predictors/GetPredictorGroupsUseCase";
import { GetPredictorsUseCase } from "./domain/usecases/predictors/GetPredictorsUseCase";
import { RunPredictorsUseCase } from "./domain/usecases/predictors/RunPredictorsUseCase";

export function getCompositionRoot(baseUrl: string) {
    const predictorRepository = new PredictorD2ApiRepository(baseUrl);
    const excelRepository = new ExcelXlsxPopulateRepository();

    return {
        predictors: getExecute({
            get: new GetPredictorsUseCase(predictorRepository),
            getGroups: new GetPredictorGroupsUseCase(predictorRepository),
            run: new RunPredictorsUseCase(predictorRepository),
        }),
        excel: getExecute({
            export: new ExportExcelUseCase(excelRepository),
        }),
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

function getExecute<UseCases extends Record<Key, UseCase>, Key extends keyof UseCases>(
    useCases: UseCases
): { [K in Key]: UseCases[K]["execute"] } {
    const keys = Object.keys(useCases) as Key[];
    const initialOutput = {} as { [K in Key]: UseCases[K]["execute"] };

    return keys.reduce((output, key) => {
        const useCase = useCases[key];
        const execute = useCase.execute.bind(useCase) as UseCases[typeof key]["execute"];
        output[key] = execute;
        return output;
    }, initialOutput);
}

export interface UseCase {
    execute: Function;
}
