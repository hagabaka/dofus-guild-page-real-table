// ==UserScript==
// @id             dofus-guild-page-real-table
// @name           Dofus Guild Page Real Table
// @version        1.0
// @author         hagabaka
// @namespace      https://github.com/hagabaka/dofus-guild-page-real-table
// @copyright      2014, Yaohan Chen
// @description    Converts the Dofus guild member list into a real table
// @match          http://www.dofus.com/*/guild/*/miembros
// @run-at         document-end
// ==/UserScript==

(function() {
    var forEach = Array.prototype.forEach;

    // create an element with the given tag name, and the same class attribute as
    // the given element
    function createReplacement(element, tagName) {
        var replacement = document.createElement(tagName);
        replacement.className = element.className;
        return replacement;
    }

    // move the contents of origin to target
    function moveContents(origin, target) {
        while(origin.childNodes.length > 0) {
            target.appendChild(origin.childNodes[0]);
        }
    }

    // create a tr with the content of the original fake table row
    function createReplacementRow(row, cellTagName, parent) {
        var replacementRow = createReplacement(row, 'tr');
        parent.appendChild(replacementRow);
        var tableCellClasses = /nom_guilde|niveau2|serveur|nb_membre/;
        forEach.call(row.childNodes, function (child) {
            if (tableCellClasses.test(child.className)) {
                var replacementChild = createReplacement(child, cellTagName);
                moveContents(child, replacementChild);
                replacementRow.appendChild(replacementChild);
            }
        });
        return replacementRow;
    }

    // remove the node from tree
    function removeNode(node) {
        node.parentNode.removeChild(node);
    }

    var table = document.querySelector('.table_result2');
    if (table) {
        var replacementTable = createReplacement(table, 'table');
        table.parentNode.insertBefore(replacementTable, table);
        var thead = document.createElement('thead');
        replacementTable.appendChild(thead);
        var tbody = document.createElement('tbody');
        replacementTable.appendChild(tbody);
        var headerRow = table.querySelector('.titre_colonne2');
        if (headerRow) {
            createReplacementRow(headerRow, 'th', thead);
            removeNode(headerRow);
        }
        var rows = table.querySelectorAll('.ligne_style0, .ligne_style1');
        forEach.call(rows, function (row) {
            createReplacementRow(row, 'td', tbody);
            removeNode(row);
        });
    }
} () );
