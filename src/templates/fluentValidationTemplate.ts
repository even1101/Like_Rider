export function getFluentValidationTemplate(): string { 
    const slot1 = "${1:YourClass}";
    const slot2 = "${2:Property}";
    const slot3 = "${3:error message}";
    return `using FluentValidation;

namespace {Namespace};

public class {ClassName} : AbstractValidator<${slot1}>
{
    public {ClassName}()
    {
        RuleFor(v => v.${slot2})
            .NotEmpty().NotNull().WithMessage("${slot3}");         
    }
}`;
}