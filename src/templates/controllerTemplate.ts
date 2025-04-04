export function getControllerTemplate(): string { 
    const slot1 = "${1:ControllerBase}";
    const slot2 = "${2:}";
    return `using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace {Namespace};

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class {ClassName} : ${slot1}
{
    ${slot2}
}`;
}