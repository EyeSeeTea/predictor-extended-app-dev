import { TableSorting } from "d2-ui-components";
import { Pager } from "../../webapp/components/objects-list/objects-list-hooks";
import { Predictor } from "../entities/Predictor";

export interface PredictorRepository {
    get(
        search: string,
        paging: { page: number; pageSize: number },
        sorting: TableSorting<Predictor>
    ): Promise<{ pager: Pager; objects: Predictor[] }>;

    run(ids: string[], startDate: Date, endDate: Date): Promise<void>;
    runAll(): Promise<void>;
}
