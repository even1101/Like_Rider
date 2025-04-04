export function getMinimalControllerTemplate(): string { 
    const slot1 = "${1:groupName}";
    return `using Microsoft.AspNetCore.Http.HttpResults;


namespace {Namespace};

public static class {ClassName}
{
    public static void Register{ClassName}(this WebApplication app)
    {
        var ${slot1}Group = app.MapGroup("/${slot1}");   
    
    }`;
}