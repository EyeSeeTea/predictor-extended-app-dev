import _ from "lodash";
import qs from "qs";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

export function useQueryState<Obj extends object>(initialState: Obj): [Obj, (state: Obj) => void] {
    const history = useHistory();

    const [state, setState] = useState<Obj>(() => {
        const preloadState = qs.parse(history.location.search, { ignoreQueryPrefix: true });
        return { ...initialState, ...preloadState };
    });

    const updateState = useCallback(
        (state: Obj) => {
            history.push(`${history.location.pathname}?${qs.stringify(compactQuery(state))}`);
            setState(state);
        },
        [history]
    );

    return [state, updateState];
}

function compactQuery<T extends object>(query: T) {
    return _(query)
        .toPairs()
        .filter(([, value]) => !!value)
        .fromPairs()
        .value();
}
