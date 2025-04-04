export function getStructTemplate(): string { 
    const slot1 = "${1:Property}";
    return `namespace {Namespace};
    
public struct {ClassName}
{
    ${slot1}
}`;
}