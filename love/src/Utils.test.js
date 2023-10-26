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
  const options = { codeFriendly: true, parseLines: true };
  it('should handle links', () => {
    const input = 'This is a [link|https://example.com].\r\n';
    const expectedOutput =
      '<p>This is a <a href="https://example.com" rel="noopener noreferrer" target="_blank">link</a>.</p>';
    expect(jiraMarkdownToHtml(input, options)).toEqual(expectedOutput);
  });

  it('should handle headings', () => {
    const input = 'h1. This is a heading.\r\n';
    const expectedOutput = '<p><h1>This is a heading.</h1></p>';
    expect(jiraMarkdownToHtml(input, options)).toEqual(expectedOutput);
  });

  it('should convert Jira markdown to HTML', () => {
    const input =
      'This is a string with mixed content\r\nh1. This is a heading.\r\nThis is a [link|http://google.com/].\r\n';
    const expectedOutput =
      '<p>This is a string with mixed content</p><p><h1>This is a heading.</h1></p><p>This is a <a href="http://google.com/" rel="noopener noreferrer" target="_blank">link</a>.</p>';
    expect(jiraMarkdownToHtml(input, options)).toEqual(expectedOutput);
  });
});

describe('jiraMarkdownToHtml with options', () => {
  it('should handle only links and headings if parseLines option is false', () => {
    const options = { codeFriendly: true, parseLines: false };
    const input = 'This is a [link|https://example.com].\r\nThis is another line.\r\nh1. This is a heading.\r\n';
    const expectedOutput =
      'This is a <a href="https://example.com" rel="noopener noreferrer" target="_blank">link</a>.\r\nThis is another line.\r\n<h1>This is a heading.</h1>\r\n';
  });

  it('should handle links, headings and lines if parseLines option is false', () => {
    const options = { codeFriendly: true, parseLines: true };
    const input = 'This is a [link|https://example.com].\r\nThis is another line.\r\nh1. This is a heading.\r\n';
    const expectedOutput =
      '<p>This is a <a href="https://example.com" rel="noopener noreferrer" target="_blank">link</a>.</p><p>This is another line.</p><p><h1>This is a heading.</h1></p>';
  });
});
