export function getAutoMapperTemplate(): string { 
    const slot1 = "${1:SourceClass}";
    const slot2 = "${2:ResultClass}";
    const slot3 = "${3:SourceProperty}";
    const slot4 = "${4:ResultProperty}";
    return `using AutoMapper;

namespace {Namespace};
    
public class {ClassName} : Profile
{
    public {ClassName}()
    {
        CreateMap<${slot1}, ${slot2}>()
            .ForMember(r => r.${slot3}, s => s.MapFrom(x => x.${slot4}))
            .ReverseMap();
    }
}`;
}