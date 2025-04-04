export function getMediatRHandlerTemplate(): string { 
    const slot1 = "${1:YoureRequest}";
    const slot2 = "${2:Unit}";
    const slot3 = "${3:}";
    const slot4 = "${4:Unit.Value}";
    return `using MediatR;

namespace {Namespace};

public class {ClassName} : IRequestHandler<${slot1}, ${slot2}}>
{
    public {ClassName}()
    {
    }
    public async Task<${slot2}> Handle(${slot1} request, CancellationToken cancellationToken)
    {
        ${slot3}
        return ${slot4};
    }
}`;
    
}