﻿import {SurveyPropertyEditorBase} from "../src/propertyEditors/propertyEditorBase";
import {SurveyPropertyItemValuesEditor} from "../src/propertyEditors/propertyItemValuesEditor";
import {SurveyPropertyDropdownColumnsEditor} from "../src/propertyEditors/propertyMatrixDropdownColumnsEditor";
import {SurveyObjectProperty} from "../src/objectProperty";
import {SurveyPropertyTextEditor} from "../src/propertyEditors/propertyModalEditor";
import {SurveyPropertyResultfullEditor} from "../src/propertyEditors/propertyRestfullEditor";
import * as Survey from "survey-knockout";
import "../src/propertyEditors/propertyTextItemsEditor";

export default QUnit.module("PropertyEditorsTests");

QUnit.test("Create correct property editor", function (assert) {
    var propertyEditor = SurveyPropertyEditorBase.createEditor("unknown", null);
    assert.equal(propertyEditor.editorType, "string", "The default property editor is 'string'");

    var propertyTypes = ["string", "boolean", "number", "dropdown", "text", "html", "itemvalues",
        "matrixdropdowncolumns", "textitems", "triggers", "validators", "restfull"];
    for (var i = 0; i < propertyTypes.length; i++) {
        var propType = propertyTypes[i];
        propertyEditor = SurveyPropertyEditorBase.createEditor(propType, null);
        assert.equal(propertyEditor.editorType, propType, "Create '" + propType  + "' property editor");
    }
});
QUnit.test("SurveyPropertyItemValue", function (assert) {
    var choices = [{ value: 1, text: "item1" }, { value: 2, text: "item2" }, { value: 3, text: "item3" }];
    var itemValueProperty = new SurveyPropertyItemValuesEditor();
    itemValueProperty.onChanged = (newValue: Array<Survey.ItemValue>) => {  choices = newValue; };
    itemValueProperty.value = choices;
    assert.equal(itemValueProperty.koItems().length, 3, "there are three elements");
    assert.equal(itemValueProperty.koItems()[1].koValue(), 2, "check value of the second element");
    assert.equal(itemValueProperty.koItems()[1].koText(), "item2", "check text of the second element");

    itemValueProperty.onDeleteClick(itemValueProperty.koItems()[1]);
    assert.equal(itemValueProperty.koItems().length, 2, "there are two elements after deleting");
    assert.equal(itemValueProperty.koItems()[1].koValue(), 3, "check value of the second element");
    assert.equal(itemValueProperty.koItems()[1].koText(), "item3", "check text of the second element");

    itemValueProperty.onAddClick();
    assert.equal(itemValueProperty.koItems().length, 3, "there are three elements after adding");
    itemValueProperty.koItems()[2].koValue(4);
    itemValueProperty.koItems()[2].koText("item4")
    assert.equal(itemValueProperty.koItems()[2].koValue(), 4, "check value of the last element");
    assert.equal(itemValueProperty.koItems()[2].koText(), "item4", "check text of the last element");

    itemValueProperty.onApplyClick();
    assert.equal(choices.length, 3, "there are three elements after adding");
    assert.equal(choices[2].value, 4, "check value of the last element");
    assert.equal(choices[2].text, "item4", "check text of the last element");

    itemValueProperty.onMoveDownClick(itemValueProperty.koItems()[0]);
    assert.equal(itemValueProperty.koItems()[0].koValue(), 3, "check the first element");
    assert.equal(itemValueProperty.koItems()[1].koValue(), 1, "check the second element");
    itemValueProperty.onMoveUpClick(itemValueProperty.koItems()[1]);
    assert.equal(itemValueProperty.koItems()[0].koValue(), 1, "check the first element");
    assert.equal(itemValueProperty.koItems()[1].koValue(), 3, "check the second element");

    itemValueProperty.onAddClick();
    itemValueProperty.onAddClick();
    itemValueProperty.onResetClick();
    assert.equal(itemValueProperty.koItems().length, 3, "there are three elements");
});
QUnit.test("SurveyPropertyItemValue different view type", function (assert) {
    var choices = [{ value: 1, text: "item1" }, { value: 2 } ];
    var editor = new SurveyPropertyItemValuesEditor();
    editor.value = choices;
    editor.onChanged = (newValue: Array<Survey.ItemValue>) => { choices = newValue; };
    assert.equal(editor.koItemsText(), "", "It is empty by default");
    editor.koActiveView("text");
    assert.equal(editor.koItemsText(), "1|item1\n2", "It is empty by default");
    editor.koItemsText("1|item1\n\n2|item2\n3\ni4");
    editor.koActiveView("form");
    assert.equal(editor.koItems().length, 4, "There are 4 items");
    assert.equal(editor.koItems()[1].koValue(), 2, "Value of second item is 2");
    assert.equal(editor.koItems()[1].koText(), "item2", "Text of second item is item2");
    assert.equal(editor.koItems()[2].koValue(), 3, "Value of 3-th item is 3");
    assert.equal(editor.koItems()[2].koText(), "", "Text of 3-th item is empty");
    assert.equal(editor.koItems()[3].koValue(), "i4", "Value of 4-th item is i4");
    assert.equal(editor.koItems()[3].koText(), "", "Text of 4-th item is empty");
    editor.koActiveView("text");
    editor.koItemsText("1|item1");
    editor.onApplyClick();
    assert.equal(choices.length, 1, "The value is still applied");
});
QUnit.test("SurveyPropertyItemValue: Value and Text are same", function (assert) {
    var choices = [{ value: 1, text: "1" }, { value: "item 2", text: "item 2" }];
    var itemValueProperty = new SurveyPropertyItemValuesEditor();
    itemValueProperty.onChanged = (newValue: Array<Survey.ItemValue>) => { choices = newValue; };
    itemValueProperty.value = choices;
    assert.equal(itemValueProperty.koItems().length, 2, "there are three elements");
    itemValueProperty.onApplyClick();
    assert.equal(choices.length, 2, "there are two items");
    assert.equal(choices[0].value, 1, "the first value is 1");
    assert.equal(choices[0].text, null, "the first text is null");
    assert.equal(choices[1].value, "item 2", "the second value is 'item 2'");
    assert.equal(choices[1].text, null, "the second text is null");
});
QUnit.test("SurveyPropertyItemValue: Value and Text are same and editor.alwaySaveTextInPropertyEditors = true", function (assert) {
    var choices = [{ value: 1, text: "1" }, { value: "item 2", text: "item 2" }];
    var itemValueProperty = new SurveyPropertyItemValuesEditor();
    itemValueProperty.onChanged = (newValue: Array<Survey.ItemValue>) => { choices = newValue; };
    itemValueProperty.value = choices;
    itemValueProperty.options = { alwaySaveTextInPropertyEditors: true };
    assert.equal(itemValueProperty.koItems().length, 2, "there are three elements");
    itemValueProperty.onApplyClick();
    assert.equal(choices.length, 2, "there are two items");
    assert.equal(choices[0].value, 1, "the first value is 1");
    assert.equal(choices[0].text, "1", "the first text is '1'");
    assert.equal(choices[1].value, "item 2", "the second value is 'item 2'");
    assert.equal(choices[1].text, "item 2", "the second text is 'item 2'");
});

QUnit.test("SurveyPropertyItemValue_PureValue", function (assert) {
    var choices = [1, "item2", { value: 3, text: "item3" }];
    var itemValueProperty = new SurveyPropertyItemValuesEditor();
    itemValueProperty.onChanged = (newValue: Array<Survey.ItemValue>) => { choices = newValue; };
    itemValueProperty.value = choices;
    assert.equal(itemValueProperty.koItems().length, 3, "there are three elements");
    assert.equal(itemValueProperty.koItems()[0].koValue(), 1, "check value of the first element");
    assert.equal(itemValueProperty.koItems()[1].koValue(), "item2", "check value of the second element");
    assert.equal(itemValueProperty.koItems()[2].koValue(), 3, "check value of the third element");
    assert.equal(itemValueProperty.koItems()[2].koText(), "item3", "check text of the third element");
});
QUnit.test("SurveyPropertyMatrixDropdownColumns set properties", function (assert) {
    var columns: Array<Survey.MatrixDropdownColumn> = [];
    columns.push(new Survey.MatrixDropdownColumn("column 1"));
    columns.push(new Survey.MatrixDropdownColumn("column 2"));
    columns[0].choices = [1, 2, "three"];
    var itemValueProperty = new SurveyPropertyDropdownColumnsEditor();
    itemValueProperty.onChanged = (newValue: Array<Survey.MatrixDropdownColumn>) => { columns = newValue; };
    itemValueProperty.value = columns;
    assert.equal(itemValueProperty.koItems().length, 2, "there are two elements");
    assert.equal(itemValueProperty.koItems()[0].koName(), "column 1", "the first column name");
    assert.equal(itemValueProperty.koItems()[0].editColumn.choices.length, 3, "there are two elements");
    itemValueProperty.onAddClick();
    itemValueProperty.koItems()[2].koCellType("checkbox");
    itemValueProperty.koItems()[2].koName("column 3");
    assert.equal(itemValueProperty.koItems().length, 3, "There are 3 columns un editor");
    itemValueProperty.onApplyClick();
    assert.equal(columns.length, 3, "There are 3 columns");
    assert.equal(columns[2]["cellType"], "checkbox", "the last column has checkbox cells");
});
/* TODO uncomment it after release. The test requires non-released surveyjs version.
QUnit.test("SurveyPropertyMatrixDropdownColumns use question editor", function (assert) {
    var columns: Array<Survey.MatrixDropdownColumn> = [];
    columns.push(new Survey.MatrixDropdownColumn("column 1"));
    columns.push(new Survey.MatrixDropdownColumn("column 2"));
    var itemValueProperty = new SurveyPropertyDropdownColumnsEditor();
    itemValueProperty.onChanged = (newValue: Array<Survey.MatrixDropdownColumn>) => { columns = newValue; };
    itemValueProperty.value = columns;

    assert.equal(itemValueProperty.columnEditor, null, "It is null by default");
    itemValueProperty.koEditItem(itemValueProperty.koItems()[1]);
    assert.notEqual(itemValueProperty.columnEditor.obj, null, "The question editor obj is not null");
    assert.equal(itemValueProperty.columnEditor.obj.getType(), "matrixdropdowncolumn", "columnEditor edit the second item");
    assert.ok(itemValueProperty.columnEditor.koTabs().length > 1, "There are more than one tab");
});
*/
QUnit.test("Text property test - two way binding", function (assert) {
    var property = new Survey.JsonObjectProperty("text");
    property.type = "text";
    var propertyEditor = new SurveyObjectProperty(property);
    var editor = <SurveyPropertyTextEditor>(propertyEditor.editor);
    editor.koValue("1");
    editor.onApplyClick();
    assert.equal(propertyEditor.koValue(), "1", "the value is set correctly from the editor");
    propertyEditor.koValue("2");
    assert.equal(editor.koValue(), "2", "the value is set correctly from text input");
});
QUnit.test("SurveyPropertyResultfullEditor test", function (assert) {
    var editor = new SurveyPropertyResultfullEditor();
    editor.value = new Survey.ChoicesRestfull();
    editor.koPath("path1");
    editor.koValueName("name2");
    editor.koTitleName("title3");
    assert.equal(editor.question.choicesByUrl.path, "path1", "test path is set");
    assert.equal(editor.question.choicesByUrl.valueName, "name2", "test name is set");
    assert.equal(editor.question.choicesByUrl.titleName, "title3", "test title is set");
});