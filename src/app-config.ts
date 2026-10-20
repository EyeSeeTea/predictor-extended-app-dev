import { FeedbackOptions } from "@eyeseetea/feedback-component";

export const appConfig: AppConfig = {
    appKey: "predictor-extended",
    appearance: {
        showShareButton: false,
    },
    feedback: {
        repositories: {
            clickUp: {
                apiUrl: "https://dev.eyeseetea.com/clickup",
                listId: "170646859",
                title: "[User feedback] {title}",
                body: "## dhis2\n\nUsername: {username}\n\n{body}",
                status: "Misc",
            },
        },
        layoutOptions: {
            showContact: false,
            descriptionTemplate: "## Summary\n\n## Steps to reproduce\n\n## Actual results\n\n## Expected results\n\n",
        },
    },
};

type AppConfig = {
    appKey: string;
    appearance: {
        showShareButton: boolean;
    };
    feedback: FeedbackOptions;
};
