import { FileRepository } from "../domain/repositories/FileRepository";
import { File } from "../domain/entities/File";

export class FileBrowserRepository implements FileRepository {
    public download(file: File): void {
        switch (file.type) {
            case "excel": {
                const blob = new Blob([file.buffer], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                saveAs(blob, file.name);
                return;
            }
            default: {
                console.error(`Unknown file type ${file.type}`);
                return;
            }
        }
    }
}
