'use strict';
const fs = require('fs');
const path = require('path');
const MarkdownMatcher = require('./markdown-matcher');

class MarkdownConverter {
    static convertToHtml(filePath) {
        try {
            const fileArr = MarkdownConverter.parseFileToArray(filePath);
            MarkdownConverter.convertFile(filePath, fileArr);
        } catch(e) {
            console.error('ERR: ' + e.message);
        }
        
    }
    static parseFileToArray(filePath) {
        let fileArr = fs.readFileSync(filePath).toString().split("\n");
        if(fileArr==null || fileArr.length===0 || fileArr[0]=='') {
            throw new Error('Markdown file is empty');
        }
        return fileArr;
    }
    
    static convertFile(filePath, fileArr) {
        let parsedPath = path.parse(filePath);
        let convertedFilePath = parsedPath.dir + '/' + parsedPath.name + '_converted.html';
        let html;
        fileArr.map((line)=>{
            html = MarkdownConverter.getHtml(line);
            if(html) {
                fs.writeFileSync(convertedFilePath, html + '\n', {flag:'a'});
            }
        })
    }

    static getHtml(line) {
        let match;
        line = line.trim();
        match = MarkdownMatcher.getHeaderMatch(line);
        if(match) {
            return `<h${match.hSize}>${MarkdownConverter.populateLinkMarkdown(match.content)}</h${match.hSize}>`
        }
        if(line!=null && line!='') {
            return `<p>${MarkdownConverter.populateLinkMarkdown(line)}</p>`;
        }
    }

    static populateLinkMarkdown(content) {
        let matches = MarkdownMatcher.getLinkMatches(content);
        let linkText;
        let link;
        matches.map((match)=>{
            linkText = match[1];
            link = match[2];
            content = content.replace(match[0], `<a href="${link}">${linkText}</a>`)
        });
        return content;
    }

}

module.exports = MarkdownConverter