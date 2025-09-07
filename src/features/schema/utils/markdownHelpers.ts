export function toMarkdown(plain: string): string;
export function toMarkdown(plain: string | undefined): string | undefined;
export function toMarkdown(plain: string | undefined): string | undefined {
	if (plain) {
		const res = plain.replace(/([^\n\r])(\r?\n)([^\n\r])/gm, '$1\n\n$3'); // single new lines to \n\n (Markdown paragraph)
		return res.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&"); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
	}
	return undefined;
}