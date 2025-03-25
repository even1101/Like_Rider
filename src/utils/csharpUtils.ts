// skip true, false
const csharpKeywords = [
	'abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'checked',
	'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else',
	'enum', 'event', 'explicit', 'extern', 'finally', 'fixed', 'float', 'for',
	'foreach', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock',
	'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params',
	'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed', 'short',
	'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw',
	'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual',
	'void', 'volatile', 'while', 'var'
];

const csharpTypes = [
	'int', 'string', 'float', 'double', 'bool', 'char', 'byte', 'decimal', 'long', 'short',
	'object', 'sbyte', 'uint', 'ulong', 'ushort', 'void'
];

export function isCSharpKeyword(word: string): boolean {
	return csharpKeywords.includes(word);
}

export function isCSharpType(word: string): boolean {
	return csharpTypes.includes(word);
}
