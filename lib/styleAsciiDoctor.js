"use strict";
var defined = require('./defined');
var defaultValue = require('./defaultValue');
var enums = require('./enums');

module.exports = {
    getHeaderMarkdown: getHeaderMarkdown,

    getSectionMarkdown: getSectionMarkdown,

    getLinkMarkdown: getLinkMarkdown,

    bulletItem: bulletItem,

    beginTable: beginTable,

    addTableRow: addTableRow,

    endTable: endTable,

    /**
    * @function bold
    * Bold the specified string
    * @param  {string} string - The string to be styled
    * @return {string} The string styled as bolded for display in markdown.
    */
    bold: styleBold,

    /**
    * @function type
    * Format the type heading for display in markdown
    * @param  {string} string - The type heading to be styled
    * @return {string} The type heading styled for display in markdown.
    */
    type: styleBold,

    /**
    * @function typeValue
    * Format a typeValue for display in markdown
    * @param  {string} string - The type value to be styled
    * @return {string} The typeValue styled for display in markdown.
    */
    typeValue: styleCode,

    /**
    * @function propertiesSummary
    * Format the summary of properties for display in markdown
    * @param  {string} string - The summary of properties to be styled
    * @return {string} The summary of properties styled for display in markdown.
    */
    propertiesSummary: styleBold,

    /**
    * @function propertyNameSummary
    * Format a property name for display in markdown
    * @param  {string} string - The property name summary to be styled
    * @return {string} The styled property name summary for display in markdown.
    */
    propertyNameSummary: styleBold,

    /**
    * @function propertiesDetails
    * Format the details of properties for display in markdown
    * @param  {string} string - The details of properties to be styled
    * @return {string} The details of properties styled for display in markdown.
    */
    propertiesDetails: styleBold,

    /**
    * @function propertyDetails
    * Format the details of a property for display in markdown
    * @param  {string} string - The property details to be styled
    * @return {string} The property details styled for display in markdown.
    */
    propertyDetails: styleBold,

    /**
    * @function propertyGltfWebGL
    * Format a glTF WebGL property for display in markdown
    * @param  {string} string - The glTF WebGL property to be styled
    * @return {string} The glTF WebGL property styled for display in markdown.
    */
    propertyGltfWebGL: styleBold,

    /**
    * @function defaultValue
    * Format a defaultValue for display in markdown
    * @param  {string} string - The default value
    * @param  {type} string - The type of the default value
    * @return {string} The default value styled for display in markdown.
    */
    defaultValue: styleCodeType,

    /**
    * @function enumElement
    * Format an enumElement for display in markdown
    * @param  {string} string - The enum element to be styled
    * @param  {type} string - The type of the enum element
    * @return {string} The enum element styled for display in markdown.
    */
    enumElement: styleCodeType,

    /**
    * @function minMax
    * Format a minimum or maximum value for display in markdown
    * @param  {int} value - The minimum/maximum value to be styled
    * @return {string} The minimum or maximum value styled for display in markdown.
    */
    minMax: styleCode,

    linkType: linkType,

    getTOCLink: getTOCLink,

    /**
    * @property {string} The markdown string used for displaying the icon used to indicate a value is required.
    */
    requiredIcon: ' &#x2705; '
};

const REFERENCE = "reference-";

/**
* @function getHeaderMarkdown
* Gets the markdown syntax for the start of a header.
* @param  {int} level - The header lever that is being requested
* @return {string} The markdown string that should be placed prior to the title of the header
*/
function getHeaderMarkdown(level) {
    var md = '';
    for (var i = 0; i < level; ++i) {
        md += '=';
    }

    return md;
}

/**
* @function getSectionMarkdown
* Gets the markdown syntax for the start of a section.
* @param  {object} schema - The schema for which this section is created
* @param  {int} level - The header lever that is being requested
* @param  {boolean} suppressWarnings Indicates if wetzel warnings should be printed in the documentation.
* @return {string} The markdown string that should be placed as the start of the section
*/
function getSectionMarkdown(schema, level, suppressWarnings) {
    var md = '';

    md += "'''\n";

    var title = defaultValue(schema.title, suppressWarnings ? '' : 'WETZEL_WARNING: title not defined');
    var typeName = schema.typeName;
    if (!defined(typeName)) {
        typeName = title.toLowerCase().replace(/ /g, ".");
    }

    md += '[#' + REFERENCE + createAnchorName(typeName) + ']\n';
    md += getHeaderMarkdown(level) + ' ' + title + '\n\n';

    return md;
}

/**
* @function getSectionMarkdown
* Gets the markdown syntax for a bulleted item.
* @param  {string} item - The item being bulleted.
* @param  {int} indentationLevel - The number of indentation levels that should be applied
* @return {string} The markdown string representing the item as a bulleted item at the proper indentation.
*/
function bulletItem(item, indentationLevel) {
    indentationLevel = defaultValue(indentationLevel, 0);
    return ('*'.repeat(indentationLevel + 1)) + ' ' + item + '\n';
}

/**
* @function getLinkMarkdown
* Creates a markdown link
* @param  {string} string - The string to be linked
* @param  {string} link - The link that should be applied to the string
* @return {string} The markdown with the specified string hyperlinked to the specified link.
*/
function getLinkMarkdown(string, link) {
    if ((!defined(string) || string.length === 0)) {
        return '';
    } else if ((!defined(link) || link.length === 0)) {
        return string;
    }
    return 'link:' + link + '[' + string + ']';
}

/**
 * Creates a table header
 * @param {string} title - The name of this table
 * @param {array} columnList - An array of column names
 */
function beginTable(title, columnList) {
    var md = '';
    md += '.' + title + '\n';
    md += '|===\n';
    md += '|' + columnList.join('|') + '\n\n';
    return md;
}

/**
 * Adds a row of cells to a table
 * @param {array} data - An array of data for cells on this row.
 */
function addTableRow(data) {
    return data.map(d => '|' + d + '\n').join('') + '\n';
}

/**
 * Ends a table.
 */
function endTable() {
    return '|===\n\n';
}

/**
* @function styleBold
* Returns back a markdown string that bolds the provided string.
* @param  {string} string - The string to be bolded
* @return {string} The bolded string in markdown syntax
*/
function styleBold(string) {
    if (defined(string) && string.length > 0) {
        return '**' + string + '**';
    }

    return '';
}

/**
* @function styleCode
* Returns back a markdown string that displays the provided object as code.
* @param  {object} code - The object to be displayed as code. It might be a string, or a number, or ...
* @return {string} The code in markdown code syntax
*/
function styleCode(code) {
    if (defined(code)) {
        // The object might be a string or it might be a number or something else.
        // Let's make sure it's a string first.
        var stringified = code.toString();

        if (stringified.length > 0) {
            return '`' + stringified + '`';
        }
    }

    return '';
}

/**
* @function styleCodeType
* Returns back a markdown string that displays the provided string as code.
* @param  {string} string - The string to be displayed as code
* @param  {string} type - The type of the content in string (if it's a literal string, it will be formatted differently)
* @return {string} The string in markdown code syntax
*/
function styleCodeType(string, type) {
    if (!defined(string) || string.length === 0) {
        return '';
    } else if (type === 'string') {
        return styleCode('"' + string + '"');
    }

    return styleCode(string);
}

/**
 * Convert the given string into the string that will be used for
 * the anchors that serve as link targets in the resulting MD.
 *
 * @param {string} string The string
 * @return {string} The anchor name
 */
function createAnchorName(string) {
    return string.toLowerCase()
        .replace(/ /g, "-")
        .replace(/\./g, "-");
}

/**
* @function linkType
* Finds any occurrence of type in the provided string, and adds a markdown link to it.
* @param  {string} string - The string that might be referencing a type
* @param  {string} type - The type whose reference within string should be linked.
* @param  {string} autoLink - The enum value indicating how the auto-linking should be handled.
* @return {string} The updated string, with any occurrences of the @type string linked via markdown.
*/
function linkType(string, type, autoLink) {
    if (defaultValue(autoLink, enums.autoLinkOption.off) === enums.autoLinkOption.off) {
        return string;
    } else if ((!defined(string) || string.length === 0)) {
        return string;
    } else if ((!defined(type) || type.length === 0)) {
        return string;
    }
    if (type === 'integer' || type === 'string' ||
        type === 'object'  || type === 'number' ||
        type === 'boolean') {
        return string;
    }
    var typeLink = '#' + REFERENCE + createAnchorName(type);

    if (autoLink === enums.autoLinkOption.aggressive) {
        let regExp = new RegExp('([^`\.]|^)' + type + '([ \.]|$)');
        return string.replace(regExp, "$1" + getLinkMarkdown(styleCode(type), typeLink) + "$2");
    }
    let regExp = new RegExp('`' + type + '`');
    return string.replace(regExp, getLinkMarkdown(styleCode(type), typeLink));
}

/**
* @function getTOCLink
* @param  {string} displayString The text to display in the link.
* @param  {string} type          The string to link to.
* @return {string} The markdown for a link with displayString text targeted at type.
*/
function getTOCLink(displayString, type) {
    if ((!defined(displayString) || displayString.length === 0)) {
        return displayString;
    } else if ((!defined(type) || type.length === 0)) {
        return displayString;
    }
    var typeLink = '#' + REFERENCE + createAnchorName(type);
    return getLinkMarkdown(displayString, typeLink);
}