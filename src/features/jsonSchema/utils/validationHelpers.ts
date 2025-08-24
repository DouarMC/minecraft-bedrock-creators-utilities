import * as JsonParser from 'jsonc-parser';

export function isNumber(val: any): val is number {
	return typeof val === 'number';
}

export function isBoolean(val: any): val is boolean {
	return typeof val === 'boolean';
}

export function isString(val: any): val is string {
	return typeof val === 'string';
}

export function stringLength(str: string) {
	let count = 0;
	for (let i = 0; i < str.length; i++) {
		count++;
		// obtain the i-th 16-bit
		const code = str.charCodeAt(i);
		if (0xD800 <= code && code <= 0xDBFF) {
			// if the i-th 16bit is an upper surrogate
			// skip the next 16 bits (lower surrogate)
			i++;
		}
	}
	return count;
}

export function extendedRegExp(pattern: string): RegExp | undefined {
    let flags = '';
    if (startsWith(pattern, '(?i)')) {
        pattern = pattern.substring(4);
        flags = 'i';
    }
    try {
        return new RegExp(pattern, flags + 'u');
    } catch (e) {
        // could be an exception due to the 'u ' flag
        try {
            return new RegExp(pattern, flags);
        } catch (e) {
            // invalid pattern
            return undefined;
        }
    }
}

export function startsWith(haystack: string, needle: string): boolean {
	if (haystack.length < needle.length) {
		return false;
	}

	for (let i = 0; i < needle.length; i++) {
		if (haystack[i] !== needle[i]) {
			return false;
		}
	}

	return true;
}

export function contains(node: JsonParser.Node, offset: number, includeRightBound = false): boolean {
    return offset >= node.offset && offset < (node.offset + node.length) || includeRightBound && offset === (node.offset + node.length);
}