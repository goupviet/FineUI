
F.originalComponentHide = Ext.Component.prototype.hide;
Ext.override(Ext.Component, {

    // override
    hide: function () {
        var me = this;

        if (me.tab && me.tab.isXType('tab')) {
            // tabpanel 单独处理
        } else {
            // 除了 tabpanel 的其他面板
            if (me.body) {
                // 检查当前组件内的表单是否改变（包含组件内 iframe 页面，递归查找所有 iframe）
                if (F.util.preventPageClose(me.body)) {
                    return false;
                }
            }
        }

        return F.originalComponentHide.apply(me, arguments);
    },

    f_setDisabled: function () {
        this.setDisabled(!this.f_state['Enabled']);
    },

    f_setVisible: function () {
        this.setVisible(!this.f_state['Hidden']);
    },

    f_setWidth: function () {
        this.setWidth(this.f_state['Width']);
    },

    f_setHeight: function () {
        this.setHeight(this.f_state['Height']);
    }




});

// 1. tabpanel 单独处理，选项卡右上角的关闭按钮
F.originalTabBarCloseTab = Ext.tab.Bar.prototype.closeTab;
Ext.override(Ext.tab.Bar, {
    // override
    closeTab: function (toClose) {
        var me = this, card = toClose.card;

        if (card.body) {
            // 检查当前组件内的表单是否改变（包含组件内 iframe 页面，递归查找所有 iframe）
            if (F.util.preventPageClose(card.body)) {
                return false;
            }
        }

        return F.originalTabBarCloseTab.apply(me, arguments);
    }

});

// 2. tabpanel 单独处理，选项卡的右键菜单
F.originalTabPanelRemove = Ext.tab.Panel.prototype.remove;
Ext.override(Ext.tab.Panel, {

    // override
    remove: function (comp) {
        var me = this, c = me.getComponent(comp);

        if (c && c.body) {
            // 检查当前组件内的表单是否改变（包含组件内 iframe 页面，递归查找所有 iframe）
            if (F.util.preventPageClose(c.body)) {
                return false;
            }
        }

        return F.originalTabPanelRemove.apply(me, arguments);
    }

});


// 验证一个表单是否有效，会递归查询表单中每个字段
// 如果表单隐藏或者字段隐藏，则不进行有效性校验
Ext.override(Ext.container.Container, {

    f_isValid: function () {
        var valid = true;
        var firstInvalidField = null;
        if (!this.hidden) {
            this.items.each(function (f) {
                if (!f.hidden) {
                    if (f.isXType('field') || f.isXType('checkboxgroup')) {
                        if (!f.validate()) {
                            valid = false;
                            if (firstInvalidField == null) {
                                firstInvalidField = f;
                            }
                        }
                    } else if (f.isXType('container') && f.items.length) {
                        var validResult = f.f_isValid();
                        if (!validResult[0]) {
                            valid = false;
                            if (firstInvalidField == null) {
                                firstInvalidField = validResult[1];
                            }
                        }
                    }
                }
            });
        }
        return [valid, firstInvalidField];
    },

    f_reset: function () {
        var me = this;
        if (me.items && me.items.length) {
            me.items.each(function (item) {
                if (item.isXType('field')) {
                    item.reset();
                } else if (item.isXType('container') && item.items.length) {
                    item.f_reset();
                }
            });
        }
    },

    // 当前面板内的表单字段是否改变
    f_isDirty: function () {
        var me = this, dirty = false;

        if (me.items && me.items.length) {
            me.items.each(function (item) {
                if (item.isXType('field')) {
                    if (item.isDirty()) {
                        dirty = true;
                        return false;
                    }
                } else if (item.isXType('container') && item.items.length) {
                    if (item.f_isDirty()) {
                        dirty = true;
                        return false;
                    }
                }
            });
        }

        return dirty;
    },


    // 当前面板内的表单字段
    f_clearDirty: function () {
        var me = this;

        if (me.items && me.items.length) {
            me.items.each(function (item) {
                if (item.isXType('field')) {
                    item.resetOriginalValue();
                } else if (item.isXType('container') && item.items.length) {
                    item.f_clearDirty()
                }
            });
        }
    }

});

//F.originalPanelClose = Ext.panel.Panel.prototype.close;

Ext.override(Ext.panel.Panel, {

    //// override
    //close: function () {

    //    // 检查当前组件内的表单是否改变（包含组件内 iframe 页面，递归查找所有 iframe）
    //    if (F.util.preventPageClose(this.body)) {
    //        return false;
    //    }


    //    return F.originalPanelClose.apply(this, arguments);
    //},


    f_setCollapse: function () {
        var collapsed = this.f_state['Collapsed'];
        if (collapsed) {
            this.collapse();
        } else {
            this.expand();
        }
    },

    f_isCollapsed: function () {
        /*
        var collapsed = false;
        var state = this.getState();
        if (state && state.collapsed) {
            collapsed = true;
        }
        return collapsed;
        */
        return !!this.getCollapsed();
    },

    f_setTitle: function () {
        this.setTitle(this.f_state['Title']);
    },

    f_getActiveIndex: function () {
        var activeIndex = -1;
        this.items.each(function (item, index) {
            if (item.f_isCollapsed && !item.f_isCollapsed()) {
                activeIndex = index;
                return false;
            }
        });
        return activeIndex;
    }


});

Ext.override(Ext.form.FieldSet, {
    f_setCollapse: function () {
        var collapsed = this.f_state['Collapsed'];
        if (collapsed) {
            this.collapse();
        } else {
            this.expand();
        }
    },

    f_isCollapsed: function () {
        /*
        var collapsed = false;
        var state = this.getState();
        if (state && state.collapsed) {
            collapsed = true;
        }
        return collapsed;
        */
        return !!this.getCollapsed();
    },

    f_setTitle: function () {
        this.setTitle(this.f_state['Title']);
    }

});

if (Ext.menu.CheckItem) {
    Ext.override(Ext.menu.CheckItem, {

        f_setChecked: function () {
            this.setChecked(this.f_state['Checked'], true);
        }

    });
}

if (Ext.form.field.Base) {
    Ext.override(Ext.form.field.Base, {

        //  Add functionality to Field's initComponent to enable the change event to bubble
        /*
        initComponent: Ext.form.Field.prototype.initComponent.createSequence(function () {
            this.enableBubble('change');
        }),
        */

        /* 这会导致在文本输入框中按回车键，无法触发type=submit的表单回发事件
        listeners: {
        specialkey: function (field, e) {
        if (e.getKey() == e.ENTER) {
        e.stopEvent();
        }
        }
        },
        */

        /*
        // When show or hide the field, also hide the label.
        hide: function () {
        Ext.form.Field.superclass.hide.call(this);
        //this.callOverridden();

        //var label = Ext.get(this.el.findParent('div[class=x-form-item]')).first('label[for=' + this.id + ']');
        var labelAndField = this.el.findParentNode('div[class*=x-form-item]', 10, true);
        if (labelAndField) {
        if (this.hideMode == 'display') {
        labelAndField.setVisibilityMode(Ext.Element.DISPLAY);
        } else {
        labelAndField.setVisibilityMode(Ext.Element.VISIBILITY);
        }
        labelAndField.hide();
        }
        },

        show: function () {
        Ext.form.Field.superclass.show.call(this);
        //this.callOverridden();

        //var label = Ext.get(this.el.findParent('div[class=x-form-item]')).first('label[for=' + this.id + ']');
        var labelAndField = this.el.findParentNode('div[class*=x-form-item]', 10, true);
        if (labelAndField) {
        if (this.hideMode == 'display') {
        labelAndField.setVisibilityMode(Ext.Element.DISPLAY);
        } else {
        labelAndField.setVisibilityMode(Ext.Element.VISIBILITY);
        }
        labelAndField.show();
        }
        },
        */

        f_setValue: function (value) {
            if (typeof (value) === 'undefined') {
                value = this.f_state['Text'];
            }
            this.setValue(value);
        },

        f_setLabel: function (text) {
            /*
            if (this.label && this.label.update) {
                this.label.update(text || this.f_state['Label']);
            }
			*/
            var text = text || this.f_state['Label'];
            if (this.setFieldLabel) {
                this.setFieldLabel(text);
            }
        },

        f_setReadOnly: function (readonly) {
            var me = this;

            if (typeof (readonly) === 'undefined') {
                readonly = me.f_state['Readonly'];
            }

            if (me.setReadOnly) {
                me.setReadOnly(readonly);
            }

            if (readonly) {
                me.el.addCls('f-readonly');
            } else {
                me.el.removeCls('f-readonly');
            }
        }

    });
}


if (Ext.form.Label) {
    Ext.override(Ext.form.Label, {

        f_setReadOnly: function (readonly) {
            var me = this;

            if (typeof (readonly) === 'undefined') {
                readonly = me.f_state['Readonly'];
            }

            if (me.setReadOnly) {
                me.setReadOnly(readonly);
            }

            if (readonly) {
                me.el.addCls('f-readonly');
            } else {
                me.el.removeCls('f-readonly');
            }
        }

    });

}



if (Ext.form.CheckboxGroup) {
    Ext.override(Ext.form.CheckboxGroup, {

        f_setReadOnly: function (readonly) {
            var me = this;

            if (typeof (readonly) === 'undefined') {
                readonly = me.f_state['Readonly'];
            }

            if (me.setReadOnly) {
                me.setReadOnly(readonly);
            }

            if (readonly) {
                me.el.addCls('f-readonly');
            } else {
                me.el.removeCls('f-readonly');
            }
        },

        f_reloadData: function (name, isradiogroup) {
            var container = this.ownerCt;
            var newConfig = Ext.apply(this.initialConfig, {
                "f_state": this.f_state,
                "items": F.util.resolveCheckBoxGroup(name, this.f_state, isradiogroup)
            });

            if (container) {
                var originalIndex = container.items.indexOf(this);
                container.remove(this, true);

                if (isradiogroup) {
                    container.insert(originalIndex, Ext.create('Ext.form.RadioGroup', newConfig));
                } else {
                    container.insert(originalIndex, Ext.create('Ext.form.CheckboxGroup', newConfig));
                }
                container.doLayout();
            } else {
                this.destroy();
                if (isradiogroup) {
                    Ext.create('Ext.form.RadioGroup', newConfig);
                } else {
                    Ext.create('Ext.form.CheckboxGroup', newConfig);
                }

            }
        },

        /*
        f_toBeDeleted: function () {
            var tobedeleted = this.items.items[0];
            if (tobedeleted && tobedeleted.inputValue === 'tobedeleted') {
                tobedeleted.destroy();
                this.items.remove(tobedeleted);
            }
        },
        */

        // 选中项
        f_setValue: function (values) {
            // valueArray：["value1", "value2", "value3"]
            var values = values || this.f_state['SelectedValueArray'];

            var selectedObj = {};
            this.items.each(function (item) {
                var itemSelected = false;
                if (Ext.Array.indexOf(values, item.inputValue) >= 0) {
                    itemSelected = true;
                }
                selectedObj[item.name] = itemSelected;
            });

            this.setValue(selectedObj);
        },

        // 返回 ["value1", "value2", "value3"]
        f_getSelectedValues: function () {
            var selectedValues = [];
            var values = this.getValue();
            Ext.Object.each(values, function (key, value) {
                selectedValues.push(value);
            });
            return selectedValues;
        }

    });
}



if (Ext.form.field.Time) {
    Ext.override(Ext.form.field.Time, {

        // Time 继承自 ComboBox，这个函数被覆盖了，因此需要重新定义
        f_setValue: function (value) {
            if (typeof (value) === 'undefined') {
                value = this.f_state['Text'];
            }
            this.setValue(value);
        }

    });
}


if (Ext.form.field.HtmlEditor) {
    Ext.override(Ext.form.field.HtmlEditor, {

        f_setValue: function (text) {
            if (typeof (text) === 'undefined') {
                text = this.f_state['Text'];
            }
            this.setValue(text);
        }

    });
}


if (Ext.form.field.Checkbox) {
    Ext.override(Ext.form.field.Checkbox, {

        f_setValue: function () {
            this.setValue(this.f_state['Checked']);
        }

    });
}


if (Ext.form.RadioGroup) {
    Ext.override(Ext.form.RadioGroup, {

        f_setValue: function (value) {
            value = value || this.f_state['SelectedValue'];
            var selectedObj = {};
            selectedObj[this.name] = value;
            this.setValue(selectedObj);
            //Ext.form.CheckboxGroup.prototype.f_setValue.apply(this, [value]);
        }

    });
}


if (Ext.form.field.ComboBox) {
    Ext.override(Ext.form.field.ComboBox, {
        // Load data from local cache.
        //        mode: "local",
        //        triggerAction: "all",
        displayField: "text",
        valueField: "value",
        //tpl: "<tpl for=\".\"><div class=\"x-combo-list-item <tpl if=\"!enabled\">x-combo-list-item-disable</tpl>\">{prefix}{text}</div></tpl>",

        // These variables are in the Ext.form.ComboBox.prototype, therefore all instance will refer to the same store instance.
        //store: new Ext.data.ArrayStore({ fields: ['value', 'text', 'enabled', 'prefix'] }),

        f_setValue: function (value) {
            // value 可以是空字符串
            if (typeof (value) === 'undefined') {
                if (this.multiSelect) {
                    value = this.f_state['SelectedValueArray'];
                } else {
                    value = this.f_state['SelectedValue'];
                }
                //value = this.f_state['SelectedValue'];
            }
            this.setValue(value);
        },

        f_loadData: function (data) {
            data = data || this.f_state['F_Items'];
            if (data) {
                this.store.loadData(F.simulateTree.transform(data));
            }
        },


        f_getTextByValue: function (value, data) {
            data = data || this.f_state['F_Items'];
            value += ''; // 把Value转换为字符串
            for (var i = 0, count = data.length; i < count; i++) {
                var item = data[i];
                if (item[0] === value) {
                    return item[1];
                }
            }
            return '';
        }

    });
}


if (Ext.button.Button) {
    Ext.override(Ext.button.Button, {

        f_setTooltip: function () {
            this.setTooltip(this.f_state['ToolTip']);
        },

        f_toggle: function () {
            this.toggle(this.f_state['Pressed']);
        },

        f_setText: function () {
            this.setText(this.f_state['Text']);
        }


    });
}


if (Ext.grid.column.RowNumberer) {

    F.originalRowNumbererRenderer = Ext.grid.column.RowNumberer.prototype.renderer;
    Ext.override(Ext.grid.column.RowNumberer, {

        renderer: function () {

            var number = F.originalRowNumbererRenderer.apply(this, arguments);

            if (this.f_paging) {
                var pagingBar = F(this.f_paging_grid).f_getPaging();
                if (pagingBar) {
                    number += pagingBar.f_pageIndex * pagingBar.f_pageSize;
                }
            }

            return number;
        }
    });

}

if (Ext.grid.Panel) {
    Ext.override(Ext.grid.Panel, {

        f_getData: function () {
            var $this = this, rows = this.f_state['F_Rows'];

            //////////////////////////////////////////////////
            var tpls = this.f_getTpls(this.f_tpls);

            // 将Grid1_ctl37与对应的outHTML放在哈希表中
            var tplsHash = {};
            var e = document.createElement('div');
            e.innerHTML = tpls;
            Ext.Array.each(e.childNodes, function (item, index) {
                tplsHash[item.id] = item.outerHTML.replace(/\r?\n\s*/ig, '');
            });

            /*
            // 将服务器返回的字符串转换为实际的JavaScript类型
            function resolveActualDataItem(fieldValue, fieldIndex) {
                var fieldType = $this.f_fields[fieldIndex].type;
                if (fieldType) {
                    if (fieldType === 'date') {
                        fieldValue = new Date(fieldValue);
                    } else if (fieldType === 'boolean') {
                        if (fieldValue == 'true' || fieldValue == '1') {
                            fieldValue = true;
                        } else {
                            fieldValue = false;
                        }
                    } else if (fieldType === 'float') {
                        fieldValue = parseFloat(fieldValue);
                    } else if (fieldType === 'int') {
                        fieldValue = parseInt(fieldValue, 10);
                    }
                }
                return fieldValue;
            }
            */

            // 不要改变 F_Rows.Values 的原始数据，因为这个值会被POST到后台
            /*
            var newdata = [], newdataitem;
            Ext.Array.each(data, function (row, rowIndex) {
                newdataitem = [];
                Ext.Array.each(row, function (item, index) {
                    if (typeof (item) === 'string' && item.substr(0, 7) === "#@TPL@#") {
                        var clientId = $this.id + '_' + item.substr(7);
                        newdataitem.push('<div id="' + clientId + '_container">' + tplsHash[clientId] + '</div>');
                    } else {
                        //newdataitem.push(resolveActualDataItem(item, index));
                        newdataitem.push(item);
                    }
                });
                newdata.push(newdataitem);
            });
            */

            var newdata = [];
            Ext.Array.each(rows, function (row, rowIndex) {
                var newdataitem = [];

                // row['0'] -> Values
                Ext.Array.each(row['0'], function (item, cellIndex) {
                    var newcellvalue = item;
                    if (typeof (item) === 'string' && item.substr(0, 7) === "#@TPL@#") {
                        var clientId = $this.id + '_' + item.substr(7);
                        newcellvalue = '<div id="' + clientId + '_container">' + tplsHash[clientId] + '</div>';
                    }

                    newdataitem.push(newcellvalue);
                });

                // idProperty
                var rowId = row['6'];
                if (typeof (rowId) === 'undefined') {
                    // 如果未定义 id，要生成一个 id，用来记录选中的行（否则在行调整顺序后，选中的行就乱了）
                    rowId = 'fineui_row_' + rowIndex;
                }
                newdataitem.push(rowId);


                newdata.push(newdataitem);
            });
            //////////////////////////////////////////////////

            return newdata;
        },

        f_getTpls: function (paramTpls) {
            var tpls;
            if (typeof (paramTpls) !== 'undefined') {
                // 1. 如果Tpls存在于函数参数中
                tpls = paramTpls;
                this['data-last-tpls'] = tpls;
            } else {
                var tplsNode = Ext.get(this.id + '_tpls');
                if (tplsNode) {
                    // 2. 如果Tpls存在于页面节点中
                    tpls = tplsNode.dom.innerHTML;
                    // 获取模板列的内容之后，必须要删除原有的节点，因为会在表格中创建完全相同的新节点
                    tplsNode.remove();

                    // 将模板列内容保存到表格实例中
                    this['data-last-tpls'] = tpls;
                } else {
                    // 3. 从缓存中读取
                    // 从表格实例中读取模板列内容
                    tpls = this['data-last-tpls'];
                }
            }

            return tpls;
        },


        f_updateTpls: function (tpls) {
            tpls = this.f_getTpls(tpls);

            var e = document.createElement('div');
            e.innerHTML = tpls;
            Ext.Array.each(e.childNodes, function (item, index) {
                var nodeId = item.id;
                var tplContainer = Ext.get(nodeId + '_container');

                // 对于内存分页，模板列的内容可能还没有渲染到页面中
                if (tplContainer) {
                    tplContainer.dom.innerHTML = item.outerHTML;
                }
            });
        },

        f_getPaging: function () {
            var toolbar = this.getDockedItems('toolbar[dock="bottom"][xtype="simplepagingtoolbar"]');
            return toolbar.length ? toolbar[0] : undefined;
        },

        f_loadData: function () {
            var datas = this.f_getData();
            var pagingBar = this.f_getPaging();
            if (pagingBar) {
                var pagingDatas = [];
                if (pagingBar.f_databasePaging) {
                    pagingDatas = datas;
                } else {
                    for (var i = pagingBar.f_startRowIndex; i <= pagingBar.f_endRowIndex; i++) {
                        pagingDatas.push(datas[i]);
                    }
                }
                datas = pagingDatas;
            }


            var store = this.getStore();

            // 已经设置 Ext.data.Store 的 pruneModifiedRecords ，在重新加载数据时都会清除所有已经改变的数据
            // 所以无需 rejectChanges
            // 拒绝之前对表格的编辑，因为接下来就要重新加载数据
            //store.rejectChanges();

            // 重新加载数据前清空之前的改变
            //this.f_newAddedRows = [];
            //this.f_deletedRows = [];

            store.loadData(datas);


            if (this.f_cellEditing) {
                this.f_cellEditing.cancelEdit();
                store.commitChanges();
                this.f_initRecordIDs();
            }
        },

        // 初始化所有记录的ID列表
        f_initRecordIDs: function () {
            var $this = this;
            this.f_recordIDs = [];
            this.getStore().each(function (record, index) {
                $this.f_recordIDs.push(record.id);
            });
        },

        // 展开所有的行扩展列
        f_expandAllRows: function () {
            var expander = this.getPlugin(this.id + '_rowexpander');
            if (expander) {
                var store = this.getStore();
                for (var i = 0, count = store.getCount() ; i < count; i++) {
                    var record = store.getAt(i);
                    if (!expander.recordsExpanded[record.internalId]) {
                        expander.toggleRow(i, record);
                    }
                }
            }
        },

        // 隐藏所有的行扩展列
        f_collapseAllRows: function () {
            var expander = this.getPlugin(this.id + '_rowexpander');
            if (expander) {
                var store = this.getStore();
                for (var i = 0, count = store.getCount() ; i < count; i++) {
                    var record = store.getAt(i);
                    if (expander.recordsExpanded[record.internalId]) {
                        expander.toggleRow(i, record);
                    }
                }
            }
        },

        // http://evilcroco.name/2010/10/making-extjs-grid-content-selectable/
        // IE下允许选中表格中的文本
        /*
        f_enableTextSelection: function () {
            var elems = Ext.DomQuery.select("div[unselectable=on]", this.el.dom);
            for (var i = 0, len = elems.length; i < len; i++) {
                Ext.get(elems[i]).set({ 'unselectable': 'off' }).removeCls('x-unselectable');
            }
        },
        */

        // 获取选中的行数，或者单元格数（单元格编辑模式）
        f_getSelectedCount: function () {
            var selectedCount = 0;
            var sm = this.getSelectionModel();
            if (sm.hasSelection()) {
                if (sm.getCount) {
                    selectedCount = sm.getCount();
                } else {
                    // 单元格编辑模式，只可能选中一个单元格
                    selectedCount = 1;
                }
            }
            return selectedCount;
        },

        // 选中某些行
        f_selectRows: function (rows) {
            var me = this;
            rows = rows || me.f_state['SelectedRowIDArray'] || [];

            var sm = me.getSelectionModel();
            var store = me.getStore();

            if (rows.length && sm.select) {
                sm.deselectAll(true);
                Ext.Array.each(rows, function (row, index) {
                    // select( records, [keepExisting], [suppressEvent] )
                    sm.select(store.getById(row), true, true);
                });
            }
        },

        // 选中全部行
        f_selectAllRows: function () {
            var sm = this.getSelectionModel();
            if (sm.selectAll) {
                sm.selectAll(true);
            }
        },

        // 获取选中的行
        f_getSelectedRows: function () {
            var me = this, selectedRows = [];

            var sm = me.getSelectionModel();
            if (sm.getSelection) {
                var selection = sm.getSelection();
                var store = me.getStore();

                Ext.Array.each(selection, function (record, index) {
                    selectedRows.push(record.getId());
                });
            }

            return selectedRows;
        },


        // 选中单元格（AllowCellEditing）
        f_selectCell: function (rowId, columnId) {
			var me = this;
			
			var cell = rowId;
			if(typeof(cell) === 'undefined') {
				cell = me.f_state['SelectedCell'] || [];
			} else if(!Ext.isArray(cell)) {
				cell = [rowId, columnId];
			}
			
            var sm = me.getSelectionModel();
			if (cell.length === 2) {
				// 支持[行索引,列索引]，也支持[行Id,列Id]
				var row = cell[0];
				var column = cell[1];
				
				if(typeof(row) === 'string') {
					row = me.f_getRow(row);
				}
				
				if(typeof(column) === 'string') {
					column = me.f_getColumn(column);
				}
				
				sm.setCurrentPosition({
					row: row,
					column: column
				});
			}
        },

        // 获取选中的单元格（AllowCellEditing）
        f_getSelectedCell: function () {
            var me = this, selectedCell = [], currentPos;
            var sm = me.getSelectionModel();
            if (sm.getCurrentPosition) {
                currentPos = sm.getCurrentPosition();
                if (currentPos) {
                    selectedCell = [currentPos.record.getId(), currentPos.columnHeader.id];
                }
            }
            return selectedCell;
        },


        // 获取隐藏列的名称列表
        f_getHiddenColumns: function () {
            var hiddens = [], columns = this.f_getColumns();
            Ext.Array.each(columns, function (column, index) {
                var columnId = column.id;

                // 行扩展列需要单独处理，id属性不是 expander
                if (!column.dataIndex && column.innerCls && column.innerCls.indexOf('row-expander') > 0) {
                    columnId = 'expander';

                }

                if (column.isHidden()) {
                    hiddens.push(columnId);
                }
            });
            return hiddens;
        },

        // 隐藏需要隐藏的列，显示不需要隐藏的列
        f_updateColumnsHiddenStatus: function (hiddens) {
            hiddens = hiddens || this.f_state['HiddenColumns'] || [];
            var columns = this.f_getColumns();
            Ext.Array.each(columns, function (column, index) {
                var columnId = column.id;

                // 行扩展列需要单独处理，id属性不是 expander
                if (!column.dataIndex && column.innerCls && column.innerCls.indexOf('row-expander') > 0) {
                    columnId = 'expander';
                }

                if (Ext.Array.indexOf(hiddens, columnId) !== -1) {
                    column.setVisible(false);
                } else {
                    column.setVisible(true);
                }
            });
        },

        // 初始化排序列头
        f_initSortHeaders: function () {
            var gridEl = Ext.get(this.id), columns = this.f_getColumns();

            // 为所有可排序列添加手型光标
            Ext.Array.each(columns, function (item, index) {
                if (item['sortable']) {
                    Ext.get(item.id).addCls('cursor-pointer');
                }
            });
        },

        // 设置表格标题栏的排序图标
        f_setSortIcon: function (sortColumnID, sortDirection) {
            var gridEl = Ext.get(this.id), columns = this.f_getColumns(), headers = gridEl.select('.x-column-header');

            // 清空所有可排序列的排序箭头
            headers.removeCls(['x-column-header-sort-DESC', 'x-column-header-sort-ASC']);

            // 为所有可排序列添加手型光标
            Ext.Array.each(columns, function (item, index) {
                if (item['sortable']) {
                    Ext.get(item.id).addCls('cursor-pointer');
                }
            });

            // 设置当前列的排序箭头
            if (sortColumnID) {
                Ext.get(sortColumnID).addCls('x-column-header-sort-' + sortDirection.toUpperCase());
            }

        },

        // 获取表格列
        f_getColumns: function () {
            /*
            var columns = [];
            var configColumns = this.getColumnModel().config;
            Ext.Array.each(configColumns, function (item, index) {
                // expander也属于表格列的一种类型，否则设置f_setSortIcon会出错
                if (item.id !== 'numberer' && item.id !== 'checker') { // && item.id !== 'expander'
                    columns.push(item);
                }
            });
            */

            // columns 属性不包含行扩展列
            //return this.columns;

            // this.columnManager.columns 返回相同内容
            return this.headerCt.getGridColumns();
        },

        // 这个方法用不到了，现在对States的更新会导致Values的改变，进而促使表格的重新加载
        /*
        f_setRowStates: function (states) {
        var gridEl = Ext.get(this.id), columns = this.f_getColumns(), states = states || this.f_state['f_states'] || [];

        function setCheckBoxStates(columnIndex, stateColumnIndex) {
        var checkboxRows = gridEl.select('.x-grid-body .x-grid-row .x-grid-td-' + columns[columnIndex].id + ' .f-grid-checkbox');
        checkboxRows.each(function (row, rows, index) {
        if (states[index][stateColumnIndex]) {
        if (row.hasCls('box-grid-checkbox-unchecked-disabled')) {
        row.removeCls('box-grid-checkbox-unchecked-disabled');
        } else {
        row.removeCls('box-grid-checkbox-unchecked');
        }
        } else {
        if (row.hasCls('box-grid-checkbox-disabled')) {
        row.addCls('box-grid-checkbox-unchecked-disabled')
        } else {
        row.addCls('box-grid-checkbox-unchecked')
        }
        }
        });
        }

        var stateColumnIndex = 0;
        Ext.Array.each(columns, function (column, index) {
        if (column['f_persistState']) {
        if (column['f_persistStateType'] === 'checkbox') {
        setCheckBoxStates(index, stateColumnIndex);
        stateColumnIndex++;
        }
        }
        });
        },
        */

        // 获取列状态（目前只有CheckBoxField用到）
        f_getStates: function () {
            var gridEl = Ext.get(this.id), columns = this.f_getColumns(), states = [];

            function getCheckBoxStates(columnIndex) {
                var checkboxRows = gridEl.select('.x-grid-row .x-grid-cell-' + columns[columnIndex].id + ' .f-grid-checkbox');
                var columnStates = [];
                checkboxRows.each(function (row, index) {
                    if (row.hasCls('unchecked')) {
                        columnStates.push(false);
                    } else {
                        columnStates.push(true);
                    }
                });
                return columnStates;
            }

            Ext.Array.each(columns, function (column, index) {
                if (column['f_persistState']) {
                    if (column['f_persistStateType'] === 'checkbox') {
                        states.push(getCheckBoxStates(index));
                    }
                }
            });

            // 把列状态列表转换为行状态列表，与后台数据保持一致
            var i, resolvedStates = [], rowState, rowCount;
            if (states.length > 0) {
                rowCount = states[0].length;
                for (i = 0; i < rowCount; i++) {
                    rowState = [];
                    Ext.Array.each(states, function (state, index) {
                        rowState.push(state[i]);
                    });
                    resolvedStates.push(rowState);
                }
            }

            return resolvedStates;
        },

        // 提交客户端改变
        f_commitChanges: function () {

            if (this.f_cellEditing) {
                this.f_cellEditing.cancelEdit();
                this.getStore().commitChanges();
                this.f_initRecordIDs();
            }

        },


        // 从Store中删除选中的行（或者单元格）
        f_deleteSelectedRows: function () {
            var me = this;
            var store = me.getStore();

            var sm = me.getSelectionModel();
            if (sm.getSelection) {
                var rows = me.f_getSelectedRows();
                Ext.Array.each(rows, function (rowId, index) {
                    store.remove(store.getById(rowId));
                });
            } else if (sm.getSelectedCell) {
                var selectedCell = me.f_getSelectedCell();
                if (selectedCell.length) {
                    store.remove(store.getById(selectedCell[0]));
                }
            }
        },
		
		f_generateNewId: function () {
            var newid = 'fineui_' + F.f_objectIndex;

            F.f_objectIndex++;

            return newid;
        },

        // 添加一条新纪录
		f_addNewRecord: function (defaultObj, appendToEnd, editColumnId) {
		    var me = this, store = me.getStore();
            var newRecord = defaultObj; //new Ext.data.Model(defaultObj);
			

		    // 如果设置了 id，则 extjs 认为这不是一个 phantom（幻影），而是一个真实存在的数据，rejectChanges 就不能去除这条数据了
            /*
            // 自动生成ID
			if(typeof(newRecord.__id) === 'undefined') {
			    newRecord.__id = me.f_generateNewId();
			}
            */
            

			me.f_cellEditing.cancelEdit();

			var newAddedRecords;
            //var rowIndex = 0;
            if (appendToEnd) {
                newAddedRecords = store.add(newRecord);
                //rowIndex = store.getCount() - 1;
            } else {
                newAddedRecords = store.insert(0, newRecord);
                //rowIndex = 0;
            }

            var newAddedRecord = newAddedRecords[0];

		    
		    // phantom: True when the record does not yet exist in a server-side database (see setDirty). Any record which has a real database pk set as its id property is NOT a phantom -- it's real.
		    // 如果设置了 id 属性，则 extjs 认为这不是一个 phantom（幻影），而是一个真实存在的数据，然后通过 getStore().getModifiedRecords() 就得不到这条记录了。
		    // 所以需要设置 setDirty
            //newAddedRecord.setDirty(true);

            var column;
            if (typeof (editColumnId) === 'undefined') {
                column = me.f_firstEditableColumn();
            } else {
                column = me.f_getColumn(editColumnId);
            }

            me.f_cellEditing.startEdit(newAddedRecord, column);
		},


		f_startEdit: function(rowId, columnId) {
		    var me = this;

		    me.f_cellEditing.startEdit(me.f_getRow(rowId), me.f_getColumn(columnId));
		},

        //// 获取新增的行索引（在修改后的列表中）
        //f_getNewAddedRows: function () {
        //    var $this = this;
        //    var newAddedRows = [];
        //    this.getStore().each(function (record, index) {
        //        if (Ext.Array.indexOf($this.f_recordIDs, record.id) < 0) {
        //            newAddedRows.push(index);
        //        }
        //    });
        //    return newAddedRows;
        //},

		/*
        // 获取删除的行索引（在原始的列表中）
        f_getDeletedRows: function () {
            var me = this, currentRecordIDs = [], deletedRows = [];
            me.getStore().each(function (record, index) {
                currentRecordIDs.push(record.id);
            });

            // 快速判断是否存在行被删除的情况
            if (currentRecordIDs.join('') === me.f_recordIDs.join('')) {
                return []; // 没有行被删除
            }


            // 内存分页，特殊处理
            var originalIndexPlus = 0;
            var pagingBar = me.f_getPaging();
            if (pagingBar && !pagingBar.f_databasePaging) {
                originalIndexPlus = pagingBar.f_pageIndex * pagingBar.f_pageSize;
            }


            Ext.Array.each(me.f_recordIDs, function (recordID, index) {
                if (Ext.Array.indexOf(currentRecordIDs, recordID) < 0) {
                    //deletedRows.push(index + originalIndexPlus);
					deletedRows.push({
						index: -1,
						originalIndex: index + originalIndexPlus,
						id: recordID,
						status: 'deleted'
					});
                }
            });
            return deletedRows;
        },
		*/

        f_firstEditableColumn: function () {
            var me = this, columns = me.f_getColumns();

            for (var i = 0, count = columns.length; i < count; i++) {
                var column = columns[i];
                if (me.f_columnEditable(column)) {
                    return column;
                }
            }

            return undefined;
        },

        f_columnEditable: function (columnID) {
            var me = this, columns = me.f_getColumns();

            var column = columnID;
            if (typeof (columnID) === 'string') {
                column = me.f_getColumn(column);
            }

            if (column && column.f_editable) {
                return true;
                /*
                if((column.getEditor && column.getEditor()) || column.xtype === 'checkcolumn') {
                    return true;
                }
                */
            }

            return false;
        },


        f_getColumn: function (columnID) {
            var me = this, columns = me.f_getColumns();

            for (var i=0, count = columns.length; i < count; i++) {
                var column = columns[i];
                if (column.id === columnID) {
                    return column;
                }
            }
            return undefined;
        },

        f_getRow: function(rowId) {
            var me = this, store = me.getStore();
            return store.getById(rowId);
        },
		
		f_getCellValue: function(rowId, columnId) {
			var me = this;
			
			var row = me.f_getRow(rowId);
			if(row && row.data) {
				return row.data[columnId];
			}
			
			return undefined;
		},
		
		f_updateCellValue: function(rowId, columnId, newvalue) {
			var me = this;
			
			var row = me.f_getRow(rowId);
			if(row && row.set) {
				row.set(columnId, newvalue);
			}
		},
		

		/*
        // 获取用户修改的单元格值
        f_getModifiedData: function () {
            var me = this, i, j, count, columns = this.f_getColumns();

            // 内存分页，特殊处理
            var originalIndexPlus = 0;
            var pagingBar = me.f_getPaging();
            if (pagingBar && !pagingBar.f_databasePaging) {
                originalIndexPlus = pagingBar.f_pageIndex * pagingBar.f_pageSize;
            }

            var modifiedRows = [];
            var store = this.getStore();
            var modifiedRecords = store.getModifiedRecords();
            var rowIndex, rowData, newData, modifiedRecord, recordID, rowIndexOriginal;
            for (i = 0, count = modifiedRecords.length; i < count; i++) {
                modifiedRecord = modifiedRecords[i];
                recordID = modifiedRecord.id;
                rowIndex = store.indexOf(modifiedRecord);
                rowData = modifiedRecord.data;
                if (rowIndex < 0) {
                    continue;
                }

                // 本行数据在原始数据集合中的行索引
                rowIndexOriginal = Ext.Array.indexOf(this.f_recordIDs, recordID);
                if (rowIndexOriginal < 0) {
                    var newRowData = {};
                    // 删除那些不能编辑的列
                    for (var columnID in rowData) {
                        if (this.f_columnEditable(columnID)) {
                            //delete rowData[columnID];
                            var rowDataColumn = rowData[columnID];
                            // 如果是日期对象，则转化为字符串
                            if (F.util.isDate(rowDataColumn)) {
                                rowDataColumn = F.util.resolveGridDateToString(me.f_fields, columnID, rowDataColumn);
                            }
                            newRowData[columnID] = rowDataColumn;
                        }
                    }
                    // 新增数据行
                    modifiedRows.push([rowIndex, -1, newRowData]);
                } else {
                    var rowModifiedObj = {};
                    for (var columnID in modifiedRecord.modified) {
                        if (this.f_columnEditable(columnID)) {
                            newData = rowData[columnID];
                            // 如果是日期对象，则转化为字符串
                            if (F.util.isDate(newData)) {
                                newData = F.util.resolveGridDateToString(me.f_fields, columnID, newData);
                            }
                            rowModifiedObj[columnID] = newData;
                        }
                    }
                    // 修改现有数据行
                    modifiedRows.push([rowIndex, rowIndexOriginal + originalIndexPlus, rowModifiedObj]);
                }
            }

            // 结果按照 rowIndex 升序排序
            return modifiedRows.sort(function (a, b) { return a[0] - b[0]; });
        },
		*/
		
		// 获取用户修改的单元格值
        f_getModifiedData: function () {
            var me = this, i, j, count, columns = me.f_getColumns();

            // 内存分页，特殊处理
            var originalIndexPlus = 0;
            var pagingBar = me.f_getPaging();
            if (pagingBar && !pagingBar.f_databasePaging) {
                originalIndexPlus = pagingBar.f_pageIndex * pagingBar.f_pageSize;
            }

            var modifiedRows = [];
            var store = me.getStore();
            var modifiedRecords = store.getModifiedRecords();
            for (i = 0, count = modifiedRecords.length; i < count; i++) {
                var modifiedRecord = modifiedRecords[i];
                var recordID = modifiedRecord.id;
				var rowId = modifiedRecord.getId(); // getId() is not the same as id property
                var rowIndex = store.indexOf(modifiedRecord);
                var rowData = modifiedRecord.data;
                if (rowIndex < 0) {
                    continue;
                }

                // 本行数据在原始数据集合中的行索引
                var rowIndexOriginal = Ext.Array.indexOf(me.f_recordIDs, recordID);
                if (rowIndexOriginal < 0) {
                    var newRowData = {};
                    //for (var columnID in rowData) {
                    Ext.Object.each(rowData, function (columnID, value) {
                        //if (me.f_columnEditable(columnID)) {
                        //delete rowData[columnID];
                        var column = me.f_getColumn(columnID);
                        if (column && (column.f_columnType === 'rendercheckfield' || column.f_columnType === 'renderfield')) {
                            var newData = rowData[columnID];
                            // 如果是日期对象，则转化为字符串
                            if (F.util.isDate(newData)) {
                                newData = F.util.resolveGridDateToString(me.f_fields, columnID, newData);
                            }
                            newRowData[columnID] = newData;
                        }
                        //}
                    });
                    // 新增数据行
                    //modifiedRows.push([rowIndex, -1, newRowData]);
					modifiedRows.push({
						index: rowIndex,
						originalIndex: -1,
						id: rowId,
						values: newRowData,
						status: 'newadded'
					});
                } else {
                    var rowModifiedObj = {};
                    Ext.Object.each(modifiedRecord.modified, function(columnID, value) {
                        //for (var columnID in modifiedRecord.modified) {
                        // 不删除非可编辑列，比如[总成绩（不可编辑）]列不可编辑，但是可以通过代码更改
                        //if (me.f_columnEditable(columnID)) {
                        var newData = rowData[columnID];
                        // 如果是日期对象，则转化为字符串
                        if (F.util.isDate(newData)) {
                            newData = F.util.resolveGridDateToString(me.f_fields, columnID, newData);
                        }
                        rowModifiedObj[columnID] = newData;
                        //}
                    });
                    // 修改现有数据行
                    //modifiedRows.push([rowIndex, rowIndexOriginal + originalIndexPlus, rowModifiedObj]);
					modifiedRows.push({
						index: rowIndex,
						originalIndex: rowIndexOriginal + originalIndexPlus,
						id: rowId,
						values: rowModifiedObj,
						status: 'modified'
					});
                }
            }
			
			// 删除的行
			//modifiedRows = modifiedRows.concat(me.f_getDeletedRows());
			var removedRecords = store.getRemovedRecords();
			Ext.Array.each(removedRecords, function (record, index) {
				var recordOriginalIndex = Ext.Array.indexOf(me.f_recordIDs, record.id);
				modifiedRows.push({
					index: -1,
					originalIndex: recordOriginalIndex + originalIndexPlus,
					id: record.getId(),
					status: 'deleted'
				});
			});

            // 结果按照 originalIndex 升序排序
            return modifiedRows.sort(function (a, b) { return a.originalIndex - b.originalIndex; });
        }

    });
}


if (Ext.tree.Panel) {
    Ext.override(Ext.tree.Panel, {

        f_loadData: function () {
            var datas = this.f_state['F_Nodes'];
            var nodes = this.f_tranformData(datas);
            var root = this.getRootNode();
            if (root) {
                root.removeAll();
            }
            this.setRootNode({
                //id: this.id + '_root',
                expanded: true,
                children: nodes
            });
        },

        f_tranformData: function (datas) {
            var that = this, i = 0, nodes = [];
            for (i = 0; i < datas.length; i++) {
                var data = datas[i], node = {};

                // 0 - Text
                // 1 - Leaf
                // 2 - NodeID
                // 3 - Enabled
                // 4 - EnableCheckBox
                // 5 - Checked
                // 6 - Expanded
                // 7 - NavigateUrl
                // 8 - Target
                // 9 - href
                // 10 - Icon
                // 11 - IconUrl
                // 12 - iconUrl
                // 13 - ToolTip
                // 14 - OnClientClick
                // 15 - EnableClickEvent
                // 16 - CommandName
                // 17 - CommandArgument

                // 18 - EnableCheckEvent
                // 19 - EnableExpandEvent
                // 20 - EnableCollapseEvent

                // 21 - CssClass

                // 22 - Nodes
                node.text = data[0];
                node.leaf = !!data[1];
                node.id = data[2];
                node.disabled = !data[3];
                if (!!data[4]) {
                    // node.checked === undefined, no checkbox
                    node.checked = !!data[5];
                }
                if (!data[1]) {
                    node.expanded = !!data[6];
                }
                if (data[9]) {
                    node.href = data[9];
                    node.hrefTarget = data[8];
                }
                if (data[12]) {
                    node.icon = data[12];
                }
                node.qtip = data[13];

                if (data[14]) {
                    node.f_clientclick = data[14];
                }
                node.f_enableclickevent = !!data[15];
                node.f_commandname = data[16];
                node.f_commandargument = data[17];

                node.f_enablecheckevent = !!data[18];

                node.f_enableexpandevent = !!data[19];
                node.f_enablecollapseevent = !!data[20];

                if (data[21]) {
                    node.cls = data[21];
                }

                if (data[22] && data[22].length > 0) {
                    node.children = that.f_tranformData(data[22]);
                }

                nodes.push(node);
            }
            return nodes;
        },

        f_getExpandedNodes: function (nodes) {
            var i = 0, that = this, expandedNodes = [];

            for (; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.isExpanded()) {
                    expandedNodes.push(node.getId());
                }
                if (node.hasChildNodes()) {
                    expandedNodes = expandedNodes.concat(that.f_getExpandedNodes(node.childNodes));
                }
            }

            return expandedNodes;
        },

        f_getCheckedNodes: function () {
            var checkedIDs = [], checkedArray = this.getChecked();
            Ext.Array.each(checkedArray, function (node, index) {
                checkedIDs.push(node.getId());
            });
            return checkedIDs;
        },

        f_getSelectedNodes: function () {
            var selectedNodeIDs = [];
            var sm = this.getSelectionModel();
            if (sm.getSelection) {
                var selection = sm.getSelection();

                Ext.Array.each(selection, function (node, index) {
                    selectedNodeIDs.push(node.getId());
                });
            }

            return selectedNodeIDs;
        },

        f_selectNodes: function () {
            var nodeIDs = this.f_state['SelectedNodeIDArray'] || [];
            var model = this.getSelectionModel(), store = this.getStore(), nodes = [], node;
            Ext.Array.each(nodeIDs, function (nodeID, index) {
                node = store.getNodeById(nodeID);
                if (node) {
                    nodes.push(node);
                }
            });
            model.deselectAll(true);
            model.select(nodes);
        }


    });
}


if (Ext.PagingToolbar) {
    // We don't use this Class in current version.
    Ext.override(Ext.PagingToolbar, {

        f_hideRefresh: function () {
            var index = this.items.indexOf(this.refresh);
            this.items.get(index - 1).hide();
            this.refresh.hide();
        }

    });
}


if (Ext.tab.Panel) {
    Ext.override(Ext.tab.Panel, {

        f_autoPostBackTabsContains: function (tabId) {
            var tabs = this.f_state['F_AutoPostBackTabs'];
            return tabs.indexOf(tabId) !== -1;
        },

        f_setActiveTab: function () {
            var tabIndex = this.f_state['ActiveTabIndex'];
            this.setActiveTab(tabIndex);
        },

        f_getActiveTabIndex: function () {
            return this.items.indexOf(this.getActiveTab());
        },

        /*
        activateNextTab: function (c) {
            if (c == this.activeTab) {
                var next = this.stack.next();
                if (next) {
                    this.setActiveTab(next);
                }
                if (next = this.items.find(function (t) { return t.tabEl.style.display !== 'none'; })) {
                    // Find the first visible tab and set it active tab. 
                    this.setActiveTab(next);
                } else {
                    this.setActiveTab(null);
                }
            }
        },
        */

        hideTab: function (tabId) {
            var tab = F(tabId).tab;
            if (tab) {
                tab.hide();
            }
        },

        showTab: function (tabId) {
            var tab = F(tabId).tab;
            if (tab) {
                tab.show();
            }
        },

        addTab: function (id, url, title, closable) {
            var options = {
                'cls': 'f-tab'
            }, tab;
            if (typeof (id) === 'string') {
                Ext.apply(options, {
                    'id': id,
                    'title': title,
                    'closable': closable,
                    'url': url
                });
            } else {
                // 如果id不是字符串，则id为对象并且只有一个参数
                Ext.apply(options, id);
            }

            tab = this.getTab(options.id);
            if (!tab) {
                Ext.apply(options, {
                    'f_dynamic_added_tab': true,
                    'html': '<iframe id="' + options.id + '" name="' + options.id + '" src="' + options.url + '" frameborder="0" style="height:100%;width:100%;overflow:auto;"\></iframe\>'
                });
                tab = this.add(options);
            }

            this.setActiveTab(tab);

            return tab;
        },

        getTab: function (tabId) {
            return F(tabId);
        },

        removeTab: function (tabId) {
            this.remove(tabId);
        }

    });
}

if (Ext.WindowManager) {

    Ext.override(Ext.WindowManager, {

        // 确保窗体的遮罩层覆盖整个窗口
        getMaskBox: function () {
            this.mask.maskTarget = Ext.getBody();
            return this.callParent(arguments);
        }

    });
}

if (Ext.window.Window) {

    Ext.override(Ext.window.Window, {
        /*
        hide: function () {
            this.callParent(arguments);
            if (this.modal) {
                Ext.select('.x-mask').setStyle({ top: 0, left: 0, width: '100%', height: '100%' });
            }
        },

        show: function(){
            this.callParent(arguments);
            if (this.modal) {
                Ext.select('.x-mask').setStyle({ top: 0, left: 0, width: '100%', height: '100%' });
            }
        },
        */

        // @private
        onWindowResize: function () {
            var me = this;
            if (me.maximized) {
                // 改变浏览器大小可以自动调整窗体控件的大小（窗体控件最大化时）
                F.wnd.fixMaximize(me);
            } else {
                me.callParent();
            }
        },

        /*
        bof_hide: function () {
            this.f_hide();
        },
        bof_hide_refresh: function () {
            this.f_hide_refresh();
        },
        bof_hide_postback: function (argument) {
            this.f_hide_postback(argument);
        },
        bof_show: function (iframeUrl, windowTitle) {
            this.f_show(iframeUrl, windowTitle);
        },
        */

        f_setWidth: function () {
            var panel = F.wnd.getGhostPanel(this);
            panel.setWidth(this.f_state['Width']);
        },

        f_setHeight: function () {
            var panel = F.wnd.getGhostPanel(this);
            panel.setHeight(this.f_state['Height']);
        },

        f_setTitle: function () {
            var panel = F.wnd.getGhostPanel(this);
            panel.setTitle(this.f_state['Title']);
        },

        f_hide: function () {
            F.wnd.hide(this, this.f_iframe, this.id + '_Hidden');
        },
        f_hide_refresh: function () {
            this.f_hide();
            window.location.reload();
        },
        f_hide_postback: function (argument) {
            var me = this;
            me.f_hide();

            if (me.f_property_enable_ajax === false) {
                F.controlEnableAjax = false;
            }

            // 如果argument为undefined，则传入 __doPostBack 的 argument 应该为空字符串
            argument = argument || '';
            __doPostBack(me.name, 'Close$' + argument);
        },
        f_hide_executescript: function (scripts) {
            var me = this;
            me.f_hide();

            if (scripts) {
                with (window) {
                    new Function(scripts)();
                }
            }
        },
        f_show: function (iframeUrl, windowTitle, width, height) {
            var me = this;
            if (typeof (iframeUrl) === 'undefined') {
                iframeUrl = me.f_iframe_url;
            }
            if (typeof (windowTitle) === 'undefined') {
                windowTitle = me.title;
            }
            F.wnd.show(me, iframeUrl, windowTitle, me.f_property_left, me.f_property_top, me.f_property_position, me.id + '_Hidden', width, height);
        },

        f_maximize: function () {
            F.wnd.maximize(this);
        },
        f_minimize: function () {
            F.wnd.minimize(this);
        },
        f_restore: function () {
            F.wnd.restore(this);
        }



    });
}



if (Ext.grid.plugin.RowExpander) {
    Ext.override(Ext.grid.plugin.RowExpander, {

        // 将行扩展列的 td CSS类改为 x-grid-cell-row-expander
        getHeaderConfig: function () {
            var config = this.callParent(arguments);
            config.tdCls = Ext.baseCSSPrefix + 'grid-cell-row-expander';
            return config;
        }

    });
}

// 修正IE7下，窗口出现滚动条时，点击Window控件标题栏有时node为null的问题
/*
if (Ext.dd.DragDrop) {
    F.originalIsValidHandleChild = Ext.dd.DragDrop.prototype.isValidHandleChild;
    Ext.dd.DragDrop.prototype.isValidHandleChild = function (node) {
        if (!node || !node.nodeName) {
            return false;
        }
        return F.originalIsValidHandleChild.apply(this, [node]);
    };
}
*/


// 修正在IE下，Grid的模版列中出现文本输入框或者下拉列表时，第一次不能选中的问题
// 已经有网友发现这个问题：http://www.sencha.com/forum/archive/index.php/t-49653.html
// This is what caused my self-rendered-Html-Elements to "flicker" as described in my other thread. 
// The Dropdown receives the Click, opens and stays open for the Millisecond until
// Ext calls back and gives focus to the Cell, causing my Drop-Down to close again.
/*
if (Ext.grid.GridPanel) {
    Ext.grid.GridView.prototype.focusCell = function (row, col, hscroll) {
        this.syncFocusEl(this.ensureVisible(row, col, hscroll));

        var focusEl = this.focusEl;

        focusEl.focus();
    };
}
*/

// 修正Chrome下多表头样式错位
// 增加 !Ext.isChrome 的判断，在Chrome下DIV的宽度不包括边框的宽度
/*
if (Ext.ux.grid && Ext.ux.grid.ColumnHeaderGroup) {
    Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupStyle = function (group, gcol) {
        var width = 0, hidden = true;
        for (var i = gcol, len = gcol + group.colspan; i < len; i++) {
            if (!this.cm.isHidden(i)) {
                var cw = this.cm.getColumnWidth(i);
                if (typeof cw == 'number') {
                    width += cw;
                }
                hidden = false;
            }
        }
        return {
            width: (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2 && !Ext.isChrome) ? width : Math.max(width - this.borderWidth, 0)) + 'px',
            hidden: hidden
        };
    };
}
*/




(function () {

    // 修正IE7/IE8下Date.parse('2015-10-01')出错的问题
    // http://jibbering.com/faq/#parseDate
    function parseISO8601(dateStr) {
        var isoExp = /(\d{2,4})-(\d\d?)-(\d\d?)/,
       date = new Date(NaN), month,
       parts = isoExp.exec(dateStr);

        if (parts) {
            month = +parts[2];
            date.setFullYear(parts[1], month - 1, parts[3]);
            if (month != date.getMonth() + 1) {
                date.setTime(NaN);
            }
        }
        return date;
    }

    var originalParse = Date.parse;
    Date.parse = function (dateStr) {
        var date = originalParse(dateStr);
        if (isNaN(date)) {
            date = parseISO8601(dateStr);
        }
        return date;
    }




    if (Ext.form.field.ComboBox) {
        var originalComboSetValue = Ext.form.field.ComboBox.prototype.setValue;
        Ext.form.field.ComboBox.prototype.setValue = function (value, doSelect) {
            // value可能是数字（可编辑单元格，列的FieldType可能是Int）
            if (typeof (value) === 'number' || typeof (value) === 'boolean') {
                value += '';
            }
            return originalComboSetValue.apply(this, [value, doSelect]);
        };
    }


    

})();






