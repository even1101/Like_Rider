export function getRecordTemplate(): string { 
    const slot1 = "${1:int Id}";
    return `namespace {Namespace};
    
public record {ClassName}(${slot1});`;
}