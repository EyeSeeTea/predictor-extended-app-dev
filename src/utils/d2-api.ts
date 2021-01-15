import _ from "lodash";
import { D2Api } from "../types/d2-api";

export function getMajorVersion(version: string): number {
    const apiVersion = _.get(version.split("."), 1);
    if (!apiVersion) throw new Error(`Invalid version: ${version}`);
    return Number(apiVersion);
}

export function getD2APiFromUrl(baseUrl: string, auth?: { username: string; password: string }) {
    return new D2Api({ baseUrl, auth, backend: "fetch" });
}
