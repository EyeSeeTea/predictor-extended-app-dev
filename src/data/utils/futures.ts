import { CancelableResponse } from "@eyeseetea/d2-api/repositories/CancelableResponse";
import _ from "lodash";
import { Future, FutureData } from "../../domain/entities/Future";

export function apiToFuture<Data>(res: CancelableResponse<Data>): FutureData<Data> {
    return Future.fromComputation((resolve, reject) => {
        res.getData()
            .then(resolve)
            .catch(err => reject(getErrorMessage(err)));
        return res.cancel;
    });
}

// The HTTP error message is the response's status text, which DHIS2 sends empty, so an empty
// string would reach callers that test `if (error)`. Prefer what DHIS2 put in the body.
function getErrorMessage(err: any): string {
    const body = err?.response?.data;
    const typeReports = body?.response?.typeReports ?? body?.typeReports ?? [];
    const errorReports = _(typeReports)
        .flatMap(typeReport => typeReport.objectReports ?? [])
        .flatMap(objectReport => objectReport.errorReports ?? [])
        .map(errorReport => errorReport.message)
        .compact()
        .uniq()
        .join("\n");

    return errorReports || body?.message || err?.message || "Unknown error";
}
