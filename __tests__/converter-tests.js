const Converter = require('../models/markdown-converter');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');

const testFile = __dirname + '/data/markdown_test.txt';
const convertedFile = __dirname + '/data/markdown_test_converted.html';

describe('Markdown Converter Tests', () => {
    
    for(let x=1;x<=6;x++) {
        it(`${x}. getHtml() - get converted html for header ${x}. Expect valid h${x} tag and content`, () => {
            let html = Converter.getHtml(`${'#'.repeat(x)} This is header ${x}`);
            expect(html).toBe(`<h${x}>This is header ${x}</h${x}>`)
        });
    }

    it(`7. getHtml() - get Unformatted text. Expect valid <p> tag and content`, () => {
        let html = Converter.getHtml(`This is unformatted text`);
        expect(html).toBe(`<p>This is unformatted text</p>`)
    });

    it("8. parseFileToArray() - Load and parse file to array. Expect array of correct parsed values", () => {
        let arr = Converter.parseFileToArray(testFile);
        // expect exact number of lines in file
        expect(arr.length).toBe(5);
        // expect first line to be a header
        expect(arr[0]).toBe('# This is a Header\r');
        // expect last line to be a header
        expect(arr[4]).toBe('#### Closing Header');
    });
    
    it("9. populateLinkMarkdown() - Replace link markdown with <a> tag. Expect error caught and logged.", () => { 
        let content = Converter.populateLinkMarkdown("some text [this link] (https://Example.com) more text [another link] (http://api.example.com/path/#title?param=1) end text");
        expect(content).toContain('<a href="https://Example.com">this link</a>');
        expect(content).toContain('<a href="http://api.example.com/path/#title?param=1">another link</a>');
    })

    it("10. convertFile() - Make the converted html file. Expect file with valid html content.", async () => {
        let fileArr = Converter.parseFileToArray(testFile);
        Converter.convertFile(testFile, fileArr);
        await new Promise(resolve => setTimeout(resolve, 1000));
        let convertedArr = Converter.parseFileToArray(convertedFile);
        expect(convertedArr[0]).toBe('<h1>This is a Header</h1>');
        expect(convertedArr[1]).toBe('<p>some body text</p>');
        // Delete converted file
        fs.unlinkSync(convertedFile);
    })

    it("11. convertToHtml() - Full end to end test. Expect file with valid html content.", () => {
        Converter.convertToHtml(testFile);
        //await new Promise(resolve => setTimeout(resolve, 1000));
        let convertedArr = Converter.parseFileToArray(convertedFile);
        expect(convertedArr[0]).toBe('<h1>This is a Header</h1>');
        expect(convertedArr[1]).toBe('<p>some body text</p>');
        // Delete converted file
        fs.unlinkSync(convertedFile);
    })

    it("12. convertToHtml() - Input file not found. Expect error caught and logged.", () => {
        let consoleSpy = sinon.spy(console,'error');
        Converter.convertToHtml('some file');
        sinon.assert.calledWith(consoleSpy, "ERR: ENOENT: no such file or directory, open 'some file'");
        consoleSpy.restore();
    })

    it("13. convertToHtml() - Input file is empty. Expect error caught and logged.", () => {
        let consoleSpy = sinon.spy(console,'error');
        Converter.convertToHtml(__dirname + '/data/markdown_empty.txt');
        sinon.assert.calledWith(consoleSpy, "ERR: Markdown file is empty");
        consoleSpy.restore();
    })

})