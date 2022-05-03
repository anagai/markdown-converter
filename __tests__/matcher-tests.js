const Matcher = require('../models/markdown-matcher');

describe('Markdown Matcher Tests', () => {
    for(let x=1;x<=6;x++) {
        it(`${x}. getHeaderMatch() - Header ${x} match found. Expect matched content and header size returned. `, () => {
            let match = Matcher.getHeaderMatch(`${'#'.repeat(x)} This is header ${x}`);
            expect(match.content).toBe(`This is header ${x}`);
            expect(match.hSize).toBe(x);
        });    
    }

    it("7. getHeaderMatch() - Header match not found. Expect undefined returned. ", () => {
        let match = Matcher.getHeaderMatch("some text");
        expect(match).toBe(undefined);
    });

    it("8. getLinkMatches() - Markdown link match found. Expect link markdown tags found. ", () => {
        let matches = Matcher.getLinkMatches("some text [this link] (https://Example.com) more text [another link] (http://api.example.com/path/#title?param=1) end text");
        expect(matches[0][1]).toBe('this link');
        expect(matches[0][2]).toBe('https://Example.com');
        expect(matches[1][1]).toBe('another link');
        expect(matches[1][2]).toBe('http://api.example.com/path/#title?param=1');
    });

    it("9. getLinkMatches() - Markdown link match not found. Expect empty array returned. ", () => {
        let matches = Matcher.getLinkMatches("some text");
        expect(matches).toStrictEqual([]);
    });
})
