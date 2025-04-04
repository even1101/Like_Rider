export function getEnumTemplate(): string { 
    const slot1 = "${1:Property}";
    return `namespace {Namespace};
    
public enum {ClassName}
{
    ${slot1}
}`;
}