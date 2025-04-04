export function getClassTemplate(): string { 
    const slot1 = "${1: : XXX }"
    const slot2 = "${2:Property}"
    return `namespace {Namespace};
    
public class {ClassName} ${slot1}
{
    ${slot2}
}`;
}