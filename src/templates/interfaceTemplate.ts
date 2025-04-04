export function getInterfaceTemplate(): string { 
    const slot1 = "${1:}";
    return `namespace {Namespace};
    
public interface {ClassName}
{
    ${slot1}
}`;
}