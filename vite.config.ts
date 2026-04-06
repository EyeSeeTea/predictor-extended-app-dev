/// <reference types="vitest" />
import { UserConfig, defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import nodePolyfills from "vite-plugin-node-stdlib-browser";
import * as path from "path";

const redirectPaths = ["/dhis-web-pivot", "/dhis-web-data-visualizer"];

const config = ({ mode }): UserConfig => {
    const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    if (!env.VITE_PORT) {
        console.error("Set VITE_PORT");
        process.exit(1);
    }

    const isBuild = env.NODE_ENV === "production" || mode === "production" || mode === "test";
    const proxy = getProxy(env, mode) as any;
    const vitePort = parseInt(env.VITE_PORT as string);

    const plugins = [
        nodePolyfills(),
        react(),
        checker({
            overlay: false,
            typescript: true,
            eslint: {
                lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
                dev: { logLevel: ["warning"] },
            },
        }),
        // Keep CRA's `redirectPaths` behaviour when running Vite dev server.
        {
            name: "dhis2-redirects",
            configureServer: server => {
                if (isBuild) return;
                const targetUrl = env.VITE_DHIS2_BASE_URL?.trim() || "";
                if (!targetUrl) return;

                server.middlewares.use("/dhis2", (req, res, next) => {
                    const url = req.url || "";
                    const pathAfterPrefix = url.replace(/^\/dhis2/, "");
                    const shouldRedirect = redirectPaths.some(redirectPath => pathAfterPrefix.startsWith(redirectPath));

                    if (shouldRedirect) {
                        const newUrl = targetUrl.replace(/\/$/, "") + pathAfterPrefix;
                        res.statusCode = 302;
                        res.setHeader("Location", newUrl);
                        res.end();
                        return;
                    }

                    next();
                });
            },
        },
    ];

    return defineConfig({
        base: "", // Relative paths
        plugins,
        define: {
            // Keep existing code that checks `process.env.NODE_ENV`.
            "process.env.NODE_ENV": JSON.stringify(isBuild ? "production" : "development"),
        },
        test: {
            environment: "jsdom",
            include: ["**/*.spec.{ts,tsx}"],
            setupFiles: "./src/tests/setup.ts",
            exclude: ["node_modules", "src/tests/playwright"],
            globals: true,
        },
        server: {
            port: vitePort,
            proxy,
        },
        resolve: {
            alias: {
                $: path.resolve(__dirname, "./src"),
            },
        },
    });
};

export default config;

function getProxy(env: Record<string, string | undefined>, mode: string) {
    const dhis2UrlVar = "VITE_DHIS2_BASE_URL";
    const dhis2AuthVar = "VITE_DHIS2_AUTH";
    const targetUrl = env[dhis2UrlVar];
    const auth = env[dhis2AuthVar];
    const isBuild = env.NODE_ENV === "production" || process.env.NODE_ENV === "production" || mode === "test";

    if (isBuild) {
        return {};
    } else if (!targetUrl) {
        console.error(`Set ${dhis2UrlVar}`);
        process.exit(1);
    } else if (!auth) {
        console.error(`Set ${dhis2AuthVar}`);
        process.exit(1);
    } else {
        return {
            "/dhis2": {
                target: targetUrl,
                changeOrigin: true,
                auth: auth,
                rewrite: path => path.replace(/^\/dhis2/, ""),
            },
        };
    }
}
