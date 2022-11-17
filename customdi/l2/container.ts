import { FileReader, FileWriter, loadConfig } from "./services"


export const container = {
    reader: new FileReader(),
    writer: new FileWriter(),
    loadConfig() {
        return loadConfig(container.reader);
    }
}