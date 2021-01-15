import { ExcelXlsxPopulateRepository } from "./data/ExcelXlsxPopulateRepository";
import { PredictorD2ApiRepository } from "./data/PredictorD2ApiRepository";
import { ExportPredictorsUseCase } from "./domain/usecases/ExportPredictorsUseCase";
import { GetPredictorGroupsUseCase } from "./domain/usecases/GetPredictorGroupsUseCase";
import { ListPredictorsUseCase } from "./domain/usecases/GetPredictorsUseCase";
import { RunPredictorsUseCase } from "./domain/usecases/RunPredictorsUseCase";

export function getCompositionRoot(baseUrl: string) {
    const predictorRepository = new PredictorD2ApiRepository(baseUrl);
    const excelRepository = new ExcelXlsxPopulateRepository();

    return {
        usecases: getExecute({
            list: new ListPredictorsUseCase(predictorRepository),
            getGroups: new GetPredictorGroupsUseCase(predictorRepository),
            run: new RunPredictorsUseCase(predictorRepository),
            export: new ExportPredictorsUseCase(predictorRepository, excelRepository),
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
