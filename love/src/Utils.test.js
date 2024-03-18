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
      '<p>This is a string with mixed content</p>' +
      '<h1>This is a heading.</h1>' +
      '<p>This is a <a href="http://google.com/" rel="noopener noreferrer" target="_blank">link</a>.</p>';
    const expectedOutput =
      'This is a string with mixed content\r\n' +
      'h1. This is a heading.\r\n' +
      'This is a [link|http://google.com/].\r\n';
    expect(htmlToJiraMarkdown(input)).toEqual(expectedOutput);
  });

  it('should convert Jira tickets to links', () => {
    const input =
      '<p>This is a string with mixed content</p>' +
      '<h1>This is a heading.</h1>' +
      '<p>This is an already formatted link <a href="https://jira.lsstcorp.org/browse/DM-41184" rel="noopener noreferrer" target="_blank">DM-41184</a>.</p>' +
      '<p>This is a ticket name not yet formatted DM-41184.</p>' +
      '<p>This is an already parsed link [DM-41184|https://jira.lsstcorp.org/browse/DM-41184].</p>';
    const expectedOutput =
      'This is a string with mixed content\r\n' +
      'h1. This is a heading.\r\n' +
      'This is an already formatted link [DM-41184|https://jira.lsstcorp.org/browse/DM-41184].\r\n' +
      'This is a ticket name not yet formatted [DM-41184|https://jira.lsstcorp.org/browse/DM-41184].\r\n' +
      'This is an already parsed link [DM-41184|https://jira.lsstcorp.org/browse/DM-41184].\r\n';
    expect(htmlToJiraMarkdown(input)).toEqual(expectedOutput);
  });

  it('should handle indentations', () => {
    const input =
      '<p>This is a string with mixed content</p>' +
      '<h1>This is a heading.</h1>' +
      '<p>This is a <a href="http://google.com/" rel="noopener noreferrer" target="_blank">link</a>.</p>' +
      '<p class="ql-indent-1">This is an indented line.</p>' +
      '<p class="ql-indent-2">This is a double indented line.</p>' +
      '<p class="ql-indent-3">This is a triple indented line.</p>';
    const expectedOutput =
      'This is a string with mixed content\r\n' +
      'h1. This is a heading.\r\n' +
      'This is a [link|http://google.com/].\r\n' +
      '\tThis is an indented line.\r\n' +
      '\t\tThis is a double indented line.\r\n' +
      '\t\t\tThis is a triple indented line.\r\n';
    expect(htmlToJiraMarkdown(input)).toEqual(expectedOutput);
  });

  it('should handle multiple adjacent headings of the same type', () => {
    // This test is used to verify that the regex is not greedy and that it will match each heading separately.
    // The previous test was failing because the regex was greedy and was matching both headings as a single match.
    const input =
      '<h1>This is a heading.</h1>' +
      '<h1>This is another heading.</h1>' +
      '<h2>This is a subheading.</h2>' +
      '<h2>This is another subheading.</h2>';
    const expectedOutput =
      'h1. This is a heading.\r\n' +
      'h1. This is another heading.\r\n' +
      'h2. This is a subheading.\r\n' +
      'h2. This is another subheading.\r\n';
    expect(htmlToJiraMarkdown(input)).toEqual(expectedOutput);
  });

  it('should strip &bnsp; from the output', () => {
    const input = '<p>This&nbsp;is&nbsp;a&nbsp;string&nbsp;with&nbsp;mixed&nbsp;content</p>';
    const expectedOutput = 'This is a string with mixed content\r\n';
    expect(htmlToJiraMarkdown(input)).toEqual(expectedOutput);
  });
});

describe('jiraMarkdownToHtml', () => {
  const options = { codeFriendly: true };
  it('should handle links', () => {
    const input = 'This is a [link to site|https://example.com].\r\n';
    const expectedOutput =
      '<p>This&nbsp;is&nbsp;a&nbsp;<a href="https://example.com" rel="noopener noreferrer" target="_blank">link&nbsp;to&nbsp;site</a>.</p>';
    expect(jiraMarkdownToHtml(input, options)).toEqual(expectedOutput);
  });

  it('should handle headings', () => {
    const input = 'h1. This is a heading.\r\n';
    const expectedOutput = '<p><h1>This&nbsp;is&nbsp;a&nbsp;heading.</h1></p>';
    expect(jiraMarkdownToHtml(input, options)).toEqual(expectedOutput);
  });

  it('should convert Jira markdown to HTML', () => {
    const input =
      'This is a string with mixed content\r\n' +
      'h1. This is a heading.\r\n' +
      'This is a [link to site|http://google.com/].\r\n';
    const expectedOutput =
      '<p>This&nbsp;is&nbsp;a&nbsp;string&nbsp;with&nbsp;mixed&nbsp;content</p>' +
      '<p><h1>This&nbsp;is&nbsp;a&nbsp;heading.</h1></p>' +
      '<p>This&nbsp;is&nbsp;a&nbsp;<a href="http://google.com/" rel="noopener noreferrer" target="_blank">link&nbsp;to&nbsp;site</a>.</p>';
    expect(jiraMarkdownToHtml(input, options)).toEqual(expectedOutput);
  });

  it('should handle indentations', () => {
    const input =
      'This is a string with mixed content\r\n' +
      'h1. This is a heading.\r\nThis is a [link to site|http://google.com/].\r\n' +
      '\tThis is an indented line.\r\n' +
      '\t\tThis is a double indented line.\r\n' +
      '\t\t\tThis is a triple indented line.\r\n';
    const expectedOutput =
      '<p>This&nbsp;is&nbsp;a&nbsp;string&nbsp;with&nbsp;mixed&nbsp;content</p>' +
      '<p><h1>This&nbsp;is&nbsp;a&nbsp;heading.</h1></p>' +
      '<p>This&nbsp;is&nbsp;a&nbsp;<a href="http://google.com/" rel="noopener noreferrer" target="_blank">link&nbsp;to&nbsp;site</a>.</p>' +
      '<p class="ql-indent-1">This&nbsp;is&nbsp;an&nbsp;indented&nbsp;line.</p>' +
      '<p class="ql-indent-2">This&nbsp;is&nbsp;a&nbsp;double&nbsp;indented&nbsp;line.</p>' +
      '<p class="ql-indent-3">This&nbsp;is&nbsp;a&nbsp;triple&nbsp;indented&nbsp;line.</p>';
    expect(jiraMarkdownToHtml(input, options)).toEqual(expectedOutput);
  });

  it('should handle indentation with spaces', () => {
    const input =
      'This is a string with mixed content\r\n' +
      'h1. This is a heading.\r\nThis is a [link to site|http://google.com/].\r\n' +
      '    This is an indented line.\r\n' +
      '        This is a double indented line.\r\n' +
      '            This is a triple indented line.\r\n';
    const expectedOutput =
      '<p>This&nbsp;is&nbsp;a&nbsp;string&nbsp;with&nbsp;mixed&nbsp;content</p>' +
      '<p><h1>This&nbsp;is&nbsp;a&nbsp;heading.</h1></p>' +
      '<p>This&nbsp;is&nbsp;a&nbsp;<a href="http://google.com/" rel="noopener noreferrer" target="_blank">link&nbsp;to&nbsp;site</a>.</p>' +
      '<p>&nbsp;&nbsp;&nbsp;&nbsp;This&nbsp;is&nbsp;an&nbsp;indented&nbsp;line.</p>' +
      '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This&nbsp;is&nbsp;a&nbsp;double&nbsp;indented&nbsp;line.</p>' +
      '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This&nbsp;is&nbsp;a&nbsp;triple&nbsp;indented&nbsp;line.</p>';
    expect(jiraMarkdownToHtml(input, options)).toEqual(expectedOutput);
  });
});
