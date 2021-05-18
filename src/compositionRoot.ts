import { ExcelXlsxPopulateRepository } from "./data/ExcelXlsxPopulateRepository";
import { FileBrowserRepository } from "./data/FileBrowserRepository";
import { MetadataD2ApiRepository } from "./data/MetadataD2ApiRepository";
import { PredictorD2ApiRepository } from "./data/PredictorD2ApiRepository";
import { DeletePredictorsUseCase } from "./domain/usecases/DeletePredictorsUseCase";
import { ExportPredictorsUseCase } from "./domain/usecases/ExportPredictorsUseCase";
import { GetPredictorGroupsUseCase } from "./domain/usecases/GetPredictorGroupsUseCase";
import { GetDataElementsUseCase } from "./domain/usecases/GetDataElementsUseCase";
import { ListPredictorsUseCase } from "./domain/usecases/GetPredictorsUseCase";
import { ImportPredictorsUseCase } from "./domain/usecases/ImportPredictorsUseCase";
import { ReadPredictorsExcelUseCase } from "./domain/usecases/ReadPredictorsExcelUseCase";
import { RunPredictorsUseCase } from "./domain/usecases/RunPredictorsUseCase";

export function getCompositionRoot(baseUrl: string) {
    const predictorRepository = new PredictorD2ApiRepository(baseUrl);
    const metadataRepository = new MetadataD2ApiRepository(baseUrl);
    const excelRepository = new ExcelXlsxPopulateRepository();
    const fileRepository = new FileBrowserRepository();

    return {
        usecases: getExecute({
            list: new ListPredictorsUseCase(predictorRepository),
            getGroups: new GetPredictorGroupsUseCase(predictorRepository),
            getDataElements: new GetDataElementsUseCase(predictorRepository),
            run: new RunPredictorsUseCase(predictorRepository),
            readExcel: new ReadPredictorsExcelUseCase(excelRepository, metadataRepository),
            import: new ImportPredictorsUseCase(predictorRepository),
            export: new ExportPredictorsUseCase(
                predictorRepository,
                excelRepository,
                fileRepository
            ),
            delete: new DeletePredictorsUseCase(predictorRepository),
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
