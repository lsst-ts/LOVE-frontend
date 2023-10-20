import { htmlToJiraMarkdown, jiraMarkdownToHtml } from './Utils';

describe('htmlToJiraMarkdown', () => {
  it('should handle links', () => {
    const input = '<p>This is a <a href="https://example.com" rel="noopener noreferrer" target="_blank">link</a>.</p>';
    const expectedOutput = 'This is a [link|https://example.com].\r\n';
    expect(htmlToJiraMarkdown(input)).toEqual(expectedOutput);
  });

  it('should handle headings', () => {
    const input = '<h1>This is a heading.</h1>';
    const expectedOutput = 'h1. This is a heading.\r\n';
    expect(htmlToJiraMarkdown(input)).toEqual(expectedOutput);
  });

  it('should convert HTML to Jira markdown', () => {
    const input =
      '<p>This is a string with mixed content</p><h1>This is a heading.</h1><p>This is a <a href="http://google.com/" rel="noopener noreferrer" target="_blank">link</a>.</p>';
    const expectedOutput =
      'This is a string with mixed content\r\nh1. This is a heading.\r\nThis is a [link|http://google.com/].\r\n';
    expect(htmlToJiraMarkdown(input)).toEqual(expectedOutput);
  });
});

describe('jiraMarkdownToHtml', () => {
  it('should handle links', () => {
    const input = 'This is a [link|https://example.com].\r\n';
    const expectedOutput =
      '<p>This is a <a href="https://example.com" rel="noopener noreferrer" target="_blank">link</a>.</p>';
    expect(jiraMarkdownToHtml(input)).toEqual(expectedOutput);
  });

  it('should handle headings', () => {
    const input = 'h1. This is a heading.\r\n';
    const expectedOutput = '<p><h1>This is a heading.</h1></p>';
    expect(jiraMarkdownToHtml(input)).toEqual(expectedOutput);
  });

  it('should convert Jira markdown to HTML', () => {
    const input =
      'This is a string with mixed content\r\nh1. This is a heading.\r\nThis is a [link|http://google.com/].\r\n';
    const expectedOutput =
      '<p>This is a string with mixed content</p><p><h1>This is a heading.</h1></p><p>This is a <a href="http://google.com/" rel="noopener noreferrer" target="_blank">link</a>.</p>';
    expect(jiraMarkdownToHtml(input)).toEqual(expectedOutput);
  });
});
