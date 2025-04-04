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
    ensureDirectoryExists(targetPath);


    const fileName = await getFileName(fileType);
    if (!fileName) { return; }

    const filePath = path.join(targetPath, fileName);
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

async function getFileName(fileType: string): Promise<string | undefined> {
    let fileName = await vscode.window.showInputBox({ prompt: "Enter the file name (e.g., MyClass)" });
    
    switch (fileType) {
        case 'class':
        case 'record':
        case 'enum':
            fileName += '.cs';
            break;
        case 'interface':
            fileName = `I${fileName}.cs`;
            break;
        case 'controller':
            fileName += 'Controller.cs';
            break;
        case 'minimal controller':
            fileName += 'ApiEndPoints.cs'; 
            break;
        case 'service class':
            fileName += 'Service.cs';
            break;
        case 'service interface':
            fileName = `I${fileName}Service.cs`;
            break;
        case 'repository class':
            fileName += 'Repository.cs';
            break;
        case 'repository interface':
            fileName = `I${fileName}Repository.cs`;
            break; 
        case 'struct':
            fileName += 'Struct.cs';
            break;
        case 'Auto Mapper':
            fileName = `${fileName}Profile.cs`;
            break;
        case 'Fluent Validation':
            fileName += 'Validator.cs';
            break;
        case 'MediatR Handler':
            fileName += 'Handler.cs';
            break;
        case 'MediatR Request':
            fileName += 'Request.cs';
            break;
        case 'New Othe File':
            break;
    }
    
    return fileName;
}

async function getTargetFolder(workspacePath: string): Promise<string | undefined> {
    const folders = fs.readdirSync(workspacePath).filter(name => 
        fs.statSync(path.join(workspacePath, name)).isDirectory()
    );
    folders.push("New folder from workspace path.");

    const selectedFolder = await vscode.window.showQuickPick(folders, { placeHolder: "Select a folder or create a new one" });
    if (!selectedFolder) { return; }

    if (selectedFolder === "New folder from workspace path.") {
        const newFolderName = await vscode.window.showInputBox({ prompt: "Enter new folder name" });
        return newFolderName ? path.join(workspacePath, newFolderName) : undefined;
    }

    return path.join(workspacePath, selectedFolder);
}


function ensureDirectoryExists(directoryPath: string) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
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




