import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { getClassTemplate } from '../templates/classTemplate';
import { getInterfaceTemplate } from '../templates/interfaceTemplate';
import { getControllerTemplate } from '../templates/controllerTemplate';
import { getMinimalControllerTemplate } from '../templates/minimalControllerTemplate';
import { getRecordTemplate } from '../templates/recordTemplate';
import { getStructTemplate } from '../templates/structTemplate';
import { getEnumTemplate } from '../templates/enumTemplate';
import { getAutoMapperTemplate } from '../templates/autoMapperTemplate';
import { getFluentValidationTemplate } from '../templates/fluentValidationTemplate';
import { getMediatRHandlerTemplate } from '../templates/mediatRHandlerTemplate';
import { getMediatRRequestTemplate } from '../templates/mediatRRequestTemplate';


export async function createNewFile() { 
    const workspacePath = getWorkspacePath();
    if (!workspacePath) { return; }

    const fileType = await getSelectFileType();
    if (!fileType) { return; }

    const targetPath = await getTargetFolder(workspacePath);
    if (!targetPath) { return; }
    // ensureDirectoryExists(targetPath);


    // 取得檔案資訊（檔名與資料夾路徑）
    const fileInfo = await getFileName(fileType);
    if (!fileInfo) { return; }

    const { fileName, folderPath } = fileInfo;

    // 確定最終資料夾路徑
    const finalFolderPath = folderPath ? path.join(targetPath, folderPath) : targetPath;

    // 確保資料夾存在
    ensureDirectoryExists(finalFolderPath);

    const filePath = path.join(finalFolderPath, fileName);
    if (fs.existsSync(filePath)) {
        vscode.window.showErrorMessage("File already exists!");
        return;
    }
    
    const fileContent = createFile(filePath, fileType);
    openFile(filePath, fileContent);
    
}

function getWorkspacePath(): string | null {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace is opened.");
        return null;
    }
    return workspaceFolders[0].uri.fsPath;
}

async function getSelectFileType(): Promise<string | undefined> {
    const fileTypeSelection = await vscode.window.showQuickPick(
        [
            { label: 'class', description: 'Input: Demo, outPut: Demo.cs' },
            { label: 'interface', description: 'Input: Demo, outPut: IDemo.cs' },
            { label: 'controller', description: 'Input: Demo, outPut: DemoController.cs' },
            { label: 'minimal controller', description: 'Minimal API controller' },
            { label: 'service class', description: 'Input: Demo, outPut: DemoService.cs' },
            { label: 'service interface', description: 'Input: Demo, outPut: IDemoService.cs' },
            { label: 'repository class', description: 'Input: Demo, outPut: DemoRepository.cs' },
            { label: 'repository interface', description: 'Input: Demo, outPut: IDemoRepository.cs' },
            { label: 'record', description: 'Input: Demo, outPut: Demo.cs' },
            { label: 'struct', description: 'Input: Demo, outPut: DemoStruct.cs' },
            { label: 'enum', description: 'Input: Demo, outPut: Demo.cs' },
            { label: 'Auto Mapper', description: 'Input: Demo, outPut: DemoProfile.cs' },
            { label: 'Fluent Validation', description: 'Input: Demo, outPut: DemoValidator.cs' },
            { label: 'MediatR Handler', description: 'Input: Demo, outPut: DemoHandler.cs' },
            { label: 'MediatR Request', description: 'Input: Demo, outPut: DemoRequest.cs' },
            { label: 'New Othe File', description: 'Input: Demo.md, outPut: DemoRequest.md' }
        ],
        { placeHolder: 'Select File Type' }
    );

    return fileTypeSelection?.label;
}


async function getTargetFolder(workspacePath: string): Promise<string | undefined> {
    const excludedFolders = getExcludedFolders(); // 從設定檔抓取排除資料夾
    const folders = getAllFolders(workspacePath, excludedFolders);
    folders.push("New folder from workspace path.");

    const selectedFolder = await vscode.window.showQuickPick(folders, { placeHolder: "Select a folder or create a new one" });
    if (!selectedFolder) { return; }

    if (selectedFolder === "New folder from workspace path.") {
        const newFolderName = await vscode.window.showInputBox({ prompt: "Enter new folder name" });
        return newFolderName ? path.join(workspacePath, newFolderName) : undefined;
    }

    return selectedFolder;
}

function getAllFolders(dir: string, excludedFolders: string[], folderList: string[] = []): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory() && !excludedFolders.includes(entry.name)) {
            const fullPath = path.join(dir, entry.name);
            folderList.push(fullPath);
            getAllFolders(fullPath, excludedFolders, folderList); // 遞迴處理子資料夾
        }
    }

    return folderList;
}

function getExcludedFolders(): string[] {
    const config = vscode.workspace.getConfiguration('likeRider'); // 假設設定檔名稱為 likeRider
    const excludedFolders = config.get<string[]>('excludedFolders', ['.git', '.idea', 'bin', 'obj']); // 預設排除資料夾
    return excludedFolders;
}

function ensureDirectoryExists(directoryPath: string) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

async function getFileName(fileType: string): Promise<{ fileName: string; folderPath: string } | undefined> {
    let fileNameWithPath = await vscode.window.showInputBox({ prompt: "Enter the file name (e.g., MyClass or /A/B/MyClass)" });
    if (!fileNameWithPath) {
        return undefined;
    }

    // 分割路徑，取得檔名和資料夾路徑
    const pathParts = fileNameWithPath.split('/');
    const fileName = pathParts.pop() || ''; // 取得最後一部分作為檔名
    const folderPath = pathParts.join('/'); // 剩下的部分作為資料夾路徑

    // 根據檔案類型附加副檔名
    let finalFileName = '';
    switch (fileType) {
        case 'class':
        case 'record':
        case 'enum':
            finalFileName = `${fileName}.cs`;
            break;
        case 'interface':
            finalFileName = `I${fileName}.cs`;
            break;
        case 'controller':
            finalFileName = `${fileName}Controller.cs`;
            break;
        case 'minimal controller':
            finalFileName = `${fileName}ApiEndPoints.cs`;
            break;
        case 'service class':
            finalFileName = `${fileName}Service.cs`;
            break;
        case 'service interface':
            finalFileName = `I${fileName}Service.cs`;
            break;
        case 'repository class':
            finalFileName = `${fileName}Repository.cs`;
            break;
        case 'repository interface':
            finalFileName = `I${fileName}Repository.cs`;
            break;
        case 'struct':
            finalFileName = `${fileName}Struct.cs`;
            break;
        case 'Auto Mapper':
            finalFileName = `${fileName}Profile.cs`;
            break;
        case 'Fluent Validation':
            finalFileName = `${fileName}Validator.cs`;
            break;
        case 'MediatR Handler':
            finalFileName = `${fileName}Handler.cs`;
            break;
        case 'MediatR Request':
            finalFileName = `${fileName}Request.cs`;
            break;
        case 'New Othe File':
            finalFileName = fileName; // 不附加副檔名
            break;
        default:
            finalFileName = fileName;
    }

    return { fileName: finalFileName, folderPath };
}

function createFile(filePath: string, fileType: string): string {
    if (fileType === 'New Othe File') { 
        fs.writeFileSync(filePath, '');
        return '';
    }

    const maxLevel: number = 15;
    const csprojInfo = findCsprojInfo(filePath, maxLevel);
    
    let namespaceStr: string;
    if (!csprojInfo) {
        namespaceStr = 'NoCsproj';
    } else { 

        const { projectDir, projectName } = csprojInfo;
        const subPath = path.relative(projectDir, path.dirname(filePath));
        const namespaceSuffix = subPath
            .split(path.sep)
            .filter(Boolean)
            .map(part => part.replace(/-/g, "_"))
            .join(".");
        namespaceStr = namespaceSuffix ? `${projectName}.${namespaceSuffix}` : projectName;
    }

    const className = path.basename(filePath, '.cs');
    const templateContent = getTemplateContent(fileType);

    const fileContent = templateContent
        .replace(/\{Namespace\}/g, namespaceStr)
        .replace(/\{ClassName\}/g, className);

    fs.writeFileSync(filePath, '');
    return fileContent;
}

function findCsprojInfo(startPath: string, level: number): { projectDir: string, projectName: string } | null {
    let currentPath = path.dirname(startPath);
    for (let i = 0; i < level; i++) {
        const files = fs.readdirSync(currentPath);
        const csproj = files.find(file => file.endsWith(".csproj"));
        if (csproj) {
            const projectName = path.basename(csproj, ".csproj").replace(/-/g, "_");
            return {
                projectDir: currentPath,
                projectName: projectName
            };
        }

        const parentPath = path.dirname(currentPath);
        if (parentPath === currentPath) { break; }
        currentPath = parentPath;
    }
    return null;
}

function getTemplateContent(fileType: string): string { 

    switch (fileType) {
        case 'class':
        case 'service class':
        case 'repository class':
            return getClassTemplate();
        case 'record':
            return getRecordTemplate();
        case 'enum':
            return getEnumTemplate();
        case 'interface':
        case 'service interface':    
        case 'repository interface':
            return getInterfaceTemplate();
        case 'controller':
            return getControllerTemplate();
        case 'minimal controller':
            return getMinimalControllerTemplate();
        case 'struct':
            return getStructTemplate();
        case 'Auto Mapper':
            return getAutoMapperTemplate();
        case 'Fluent Validation':
            return getFluentValidationTemplate();
        case 'MediatR Handler':
            return getMediatRHandlerTemplate();
        case 'MediatR Request':
            return getMediatRRequestTemplate();
        default:
            return '';
    }
}

async function openFile(filePath: string, fileContent: string) {
    const document = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(document);

    if (fileContent) {
        editor.insertSnippet(new vscode.SnippetString(fileContent), new vscode.Position(0, 0));
    }
}




