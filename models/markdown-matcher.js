'use strict';

class MarkdownMatcher {
    static getHeaderMatch(line) {
        for(let size=1;size<=6;size++) {
            const regexp = new RegExp(`^${'#'.repeat(size)} ([\\s\\S]+)$`,'gi');
            const match = Array.from(line.matchAll(regexp),x=>x[1])
            if(match.length>0) {
                return {content: match[0], hSize: size}
            }
        }
        return;
    }
    static getLinkMatches(line) {
        const matches = Array.from(line.matchAll(/\[([\s\S]+?)\] \((http[s]*:\/\/[\S]+?)\)/gi));
        return matches;
    }

}

module.exports = MarkdownMatcher