export function getMediatRRequestTemplate(): string { 
    const slot1 = "${1:Unit}";
    const slot2 = "${2:}";
    return `using MediatR;

namespace {Namespace};

public class {ClassName} : IRequest<${slot1}>
{
    ${slot2}
}`;
}