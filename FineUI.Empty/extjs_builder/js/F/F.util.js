
// FineUI应用程序域
var F = function (cmpName) {
    return Ext.getCmp(cmpName);
};

F.target = function (target) {
    return F.util.getTargetWindow(target);
};

F.alert = function () {
    F.util.alert.apply(window, arguments);
};

F.init = function () {
    F.util.init.apply(window, arguments);
};

F.load = function () {
    F.util.load.apply(window, arguments);
};

F.ready = function () {
    F.util.ready.apply(window, arguments);
};

F.ajaxReady = function () {
    F.util.ajaxReady.apply(window, arguments);
    //if (typeof (onAjaxReady) == 'function') {
    //    onAjaxReady();
    //}
};

F.beforeAjax = function () {
    F.util.beforeAjax.apply(window, arguments);
};
F.beforeAjaxSuccess = function () {
    F.util.beforeAjaxSuccess.apply(window, arguments);
};


F.stop = function () {
    var event = arguments.callee.caller.arguments[0] || window.event;
    F.util.stopEventPropagation(event);
};

F.confirm = function () {
    F.util.confirm.apply(null, arguments);
};

// add by wz
F.show = function () {
    F.util.show.apply(null, arguments);
};

// add by wz
F.notify = function () {
    F.util.notify.apply(null, arguments);
};

F.toggle = function (el, className) {
    Ext.get(el).toggleCls(className);
};

F.fieldValue = function (cmp) {
    return F.util.getFormFieldValue(cmp);
};

F.getHidden = function () {
    return F.util.getHiddenFieldValue.apply(window, arguments);
};
F.setHidden = function () {
    return F.util.setHiddenFieldValue.apply(window, arguments);
};

F.addCSS = function () {
    F.util.addCSS.apply(window, arguments);
};

F.initTreeTabStrip = function () {
    F.util.initTreeTabStrip.apply(window, arguments);
};


F.addMainTab = function () {
    F.util.addMainTab.apply(window, arguments);
};

F.getActiveWindow = function () {
    return F.wnd.getActiveWindow.apply(window, arguments);
};


// 记录最后一个控件的序号
F.f_objectIndex = 0;


// 为了兼容保留函数签名：F.customEvent
F.f_customEvent = F.customEvent = function (argument, validate) {
    //var pmv = F.f_pagemanager.validate;
    //if (validate && pmv) {
    //    if (!F.util.validForms(pmv.forms, pmv.target, pmv.messagebox)) {
    //        return false;
    //    }
    //}
    //__doPostBack(F.f_pagemanager.name, argument);

    var enableAjax;
    if (typeof(argument) === 'boolean') {
        enableAjax = argument;
        argument = validate;
        validate = arguments[2];
    }

    var pmv = F.f_pagemanager.validate;
    if (validate && pmv) {
        if (!F.util.validateForms(pmv.forms, pmv.target, pmv.messagebox)) {
            return false;
        }
    }

    if (typeof (enableAjax) === 'boolean') {
        __doPostBack(enableAjax, F.f_pagemanager.name, argument);
    } else {
        __doPostBack(F.f_pagemanager.name, argument);
    }
};


// 更新EventValidation的值
F.f_eventValidation = function (newValue) {
    F.setHidden("__EVENTVALIDATION", newValue);
};

F.f_state = function (cmp, state) {
    F.util.setFState(cmp, state);
};

// 为了兼容保留函数签名：F.enable
F.f_enable = F.enable = function (id) {
    F.util.enableSubmitControl(id);
};

// 为了兼容保留函数签名：F.disable
F.f_disable = F.disable = function (id) {
    F.util.disableSubmitControl(id);
};

// 更新ViewState的值
F.f_viewState = function (viewStateBeforeAJAX, newValue, startIndex) {
    var viewStateHiddenFiledId = '__VIEWSTATE';

    var oldValue = F.getHidden(viewStateHiddenFiledId);
    var viewStateChanged = false;
    if (oldValue !== viewStateBeforeAJAX) {
        viewStateChanged = true;
    }

    if (typeof (newValue) === 'undefined') {
        // AJAX过程中ViewState值没变化
        if (viewStateChanged) {
            F.setHidden(viewStateHiddenFiledId, viewStateBeforeAJAX);
        }
    } else {
        // AJAX过程中ViewState值有变化
        if (Ext.type(startIndex) === 'number' && startIndex > 0) {
            // 只返回startIndex之后的内容
            if (viewStateChanged) {
                // 无法处理！
                return false;
            } else {
                F.setHidden(viewStateHiddenFiledId, oldValue.substr(0, startIndex) + newValue);
            }
        } else {
            // 返回完整的ViewState
            F.setHidden(viewStateHiddenFiledId, newValue);
        }
    }

    // 更新成功！
    return true;
};

// cookie('theme');
// cookie('theme', 'gray');
// cookie('theme', 'gray', { 'expires': 3 });
// expires: 天
// 新增 或者 修改Cookie
F.cookie = function (key, value, options) {
    if (typeof (value) === 'undefined') {
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var result = key ? '' : {};
        Ext.Array.each(cookies, function (cookie, index) {
            var parts = cookie.split('=');
            var partName = decodeURIComponent(Ext.String.trim(parts[0]));
            var partValue = decodeURIComponent(Ext.String.trim(parts[1]));

            if (key) {
                if (key === partName) {
                    result = partValue;
                    return false;
                }
            } else {
                result[partName] = partValue;
            }
        });
        return result;
    } else {
        // Set cookie
        options = Ext.apply(options || {}, {
            path: '/'
        });

        var expTime;
        if (typeof (options.expires) === 'number') {
            expTime = new Date();
            expTime.setTime(expTime.getTime() + options.expires * 24 * 60 * 60 * 1000);
        }

        document.cookie = [
            encodeURIComponent(key), '=', encodeURIComponent(value),
            options.expires ? '; expires=' + expTime.toUTCString() : '',
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join('');
    }
};

// 删除Cookie
F.removeCookie = function (key, options) {
    options = Ext.apply(options || {}, {
        path: '/',
        'expires': -1
    });

    F.cookie(key, '', options);
};


// 能否访问 iframe 中的 window.F 对象
F.canAccess = function (iframeWnd) {

    // 访问 iframeWnd.F 时，可能出现错误 Blocked a frame with origin "http://fineui.com/" from accessing a cross-origin frame.
    // Blocked：这个问题出现在 http://fineui.com/ 页面加载一个 http://baidu.com/ 的 iframe 页面
    try {
        iframeWnd.F;
        iframeWnd.window;
    } catch (e) {
        return false;
    }

    if (!iframeWnd.F || !iframeWnd.window) {
        return false;
    }

    return true;
};


Ext.onReady(function () {

    // 加延迟，以保证在 zh_CN 中通过 Ext.onReady 注册的脚本先执行（其中对 Ext.Date 进行了初始化）
    window.setTimeout(function () {
        F.util.triggerLoad();
        F.util.triggerReady();
        F.util.hidePageLoading();
    }, 0);
    
});

(function () {

    // 遍历定义了 renderTo 属性的对象
    // callback: 'return false' to prevent loop continue
    function resolveRenderToObj(callback) {
        Ext.ComponentManager.each(function (key, cmp) {
            if (cmp.isXType && cmp.renderTo) {

                var result = callback.apply(cmp, [cmp]);
                if (result === false) {
                    return false; // break
                }

            }
        });
    }

    /*
    // 能否访问 iframe 中的 window.F 对象
    function canIFrameWindowAccessed(iframeWnd) {

        // 访问 iframeWnd.F 时，可能出现错误 Blocked a frame with origin "http://fineui.com/" from accessing a cross-origin frame.
        // Blocked：这个问题出现在 http://fineui.com/ 页面加载一个 http://baidu.com/ 的 iframe 页面
        try {
            iframeWnd.F;
        } catch (e) {
            return false;
        }

        if (!iframeWnd.F) {
            return false;
        }

        return true;
    }
    */


    // FineUI常用函数域（Utility）
    F.util = {

        alertTitle: "Alert Dialog",
        confirmTitle: "Confirm Dialog",
        formAlertMsg: "Please provide valid value for {0}!",
        formAlertTitle: "Form Invalid",
        loading: "Loading...",

        // 下拉列表的模板
        ddlTPL: '<tpl for="."><div class="x-boundlist-item<tpl if="!enabled"> x-boundlist-item-disabled</tpl>">{prefix}{text}</div></tpl>',

        // 初始化
        init: function (options) { // msgTarget, labelWidth, labelSeparator, blankImageUrl, enableAjaxLoading, ajaxLoadingType, enableAjax, themeName, formChangeConfirm) {

            Ext.apply(F, options, {
                language: 'zh_CN',
                msgTarget: 'side',
                labelWidth: 100,
                labelSeparator: '：',
                //blankImageUrl: '', 
                enableAjaxLoading: true,
                ajaxLoadingType: 'default',
                enableAjax: true,
                theme: 'neptune',
                formChangeConfirm: false,
                ajaxTimeout: 120
            });


            // Ext.QuickTips.init(true); 在原生的IE7（非IE8下的IE7模式）会有问题
            // 表现为iframe中的页面出现滚动条时，页面上的所有按钮都不能点击了。
            // 测试例子在：aspnet/test.aspx
            //Ext.QuickTips.init(false);
            Ext.tip.QuickTipManager.init();

            F.ajax.hookPostBack();

            //F.global_enable_ajax = F.enableAjax;
            //F.global_enable_ajax_loading = F.enableAjaxLoading;
            //F.global_ajax_loading_type = F.ajaxLoadingType;

            // 添加Ajax Loading提示节点
            F.ajaxLoadingDefault = Ext.get(F.util.appendLoadingNode());
            F.ajaxLoadingMask = Ext.create('Ext.LoadMask', Ext.getBody(), { msg: F.util.loading });


            //F.form_upload_file = false;
            //F.global_disable_ajax = false;
            //F.x_window_manager = new Ext.WindowManager();
            //F.x_window_manager.zseed = 6000;

            F.util.setHiddenFieldValue('F_CHANGED', 'false');
            document.forms[0].autocomplete = 'off';

            Ext.getBody().addCls('f-body');

            Ext.Ajax.timeout = F.ajaxTimeout * 1000;

            // 向document.body添加主题类
            if (F.theme) {
                Ext.getBody().addCls('f-theme-' + F.theme);
            }

            if (Ext.form.field) {
                var fieldPro = Ext.form.field.Base.prototype;
                fieldPro.msgTarget = F.msgTarget;
                fieldPro.labelWidth = F.labelWidth;
                fieldPro.labelSeparator = F.labelSeparator;
                fieldPro.autoFitErrors = true;
            }
            if (Ext.form.CheckboxGroup) {
                var checkboxgroupPro = Ext.form.CheckboxGroup.prototype;
                checkboxgroupPro.msgTarget = F.msgTarget;
                checkboxgroupPro.labelWidth = F.labelWidth;
                checkboxgroupPro.labelSeparator = F.labelSeparator;
                checkboxgroupPro.autoFitErrors = true;
            }

            F.beforeunloadCheck = true;
            // 启用表单改变确认对话框
            if (F.formChangeConfirm) {
                // 下面这个方法在 Chrome、 Firefox下无效
                //Ext.EventManager.on(window, 'beforeunload', function (event) {
                window.onbeforeunload = function () {
                    // 允许关闭页面前提示，并且表单改变
                    if (F.beforeunloadCheck && F.util.formChanged()) {
                        return F.wnd.formChangeConfirmMsg;
                    }
                };
            }

            //if (enableBigFont) {
            //    Ext.getBody().addCls('bigfont');
            //}

            /*
            // IE6&7不支持，IE8以上支持"data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            if (Ext.isIE6 || Ext.isIE7) {
                Ext.BLANK_IMAGE_URL = F.blankImageUrl;
            }
			*/

            // Submit
            F.ready(function () {
                if (F.submitbutton) {
                    Ext.ComponentManager.each(function (key, cmp) {
                        if (cmp.isXType && cmp.renderTo) {
                            if (cmp.isXType('tooltip')) {
                                return true; // continue
                            }

                            if (cmp.isXType('panel') || cmp.isXType('formviewport')) {
                                F.util.registerPanelEnterKey(cmp);
                            }
                        }
                    });
                }

            });



            // 为了防止【页面中只有一个input[type=text]，则回车会提交表单】的问题，现在页面上创建一个input[type=text]的空元素
            F.util.appendFormNode('<input type="text" class="f-input-text-hidden">');

        },

        _readyList: [],
        _ajaxReadyList: [],
        _beforeAjaxList: [],
        _beforeAjaxSuccessList: [],
        _loadList: [],

        ready: function (callback) {
            F.util._readyList.push(callback);
        },
        triggerReady: function () {
            Ext.Array.each(F.util._readyList, function (item, index) {
                item.apply(window);
            });
        },


        ajaxReady: function (callback) {
            F.util._ajaxReadyList.push(callback);
        },
        triggerAjaxReady: function () {
            Ext.Array.each(F.util._ajaxReadyList, function (item, index) {
                item.apply(window);
            });
        },

        beforeAjax: function (callback) {
            F.util._beforeAjaxList.push(callback);
        },
        triggerBeforeAjax: function () {
            var result = true, args = arguments;
            Ext.Array.each(F.util._beforeAjaxList, function (item, index) {
                if (item.apply(window, args) === false) {
                    result = false;
                }
            });
            return result;
        },

        beforeAjaxSuccess: function (callback) {
            F.util._beforeAjaxSuccessList.push(callback);
        },
        triggerBeforeAjaxSuccess: function () {
            var result = true, args = arguments;
            Ext.Array.each(F.util._beforeAjaxSuccessList, function (item, index) {
                if (item.apply(window, args) === false) {
                    result = false;
                }
            });
            return result;
        },


        load: function (callback) {
            F.util._loadList.push(callback);
        },
        triggerLoad: function () {
            Ext.Array.each(F.util._loadList, function (item, index) {
                item.apply(window);
            });
        },

        setFState: function (cmp, state) {
            if (!cmp || !cmp['f_state']) {
                return;
            }

            var oldValue, newValue, el;
            // 如果state中包含CssClass，也就是在服务器端修改了CssClass属性，则需要首先删除原来的CssClass属性。
            if (typeof (state['CssClass']) !== 'undefined') {
                newValue = state['CssClass'];
                oldValue = cmp['f_state']['CssClass'];
                if (!oldValue) {
                    oldValue = cmp.initialConfig.cls;
                }
                el = cmp.el;
                el.removeCls(oldValue);
                el.addCls(newValue);
            }

            //if (typeof (state['FormItemClass']) !== 'undefined') {
            //    newValue = state['FormItemClass'];
            //    oldValue = cmp['f_state']['FormItemClass'];
            //    if (!oldValue) {
            //        oldValue = cmp.initialConfig.itemCls;
            //    }
            //    // Search for max 10 depth.
            //    el = cmp.el.findParent('.x-form-item', 10, true);
            //    el.removeCls(oldValue);
            //    el.addCls(newValue);
            //}

            Ext.apply(cmp['f_state'], state);

        },

        stopEventPropagation: function (event) {
            event = event || window.event;
            if (typeof (event.cancelBubble) === 'boolean') {
                event.cancelBubble = true;
            } else {
                event.stopPropagation();
            }
        },

        // 绑定函数的上下文
        bind: function (fn, scope) {
            return function () {
                return fn.apply(scope, arguments);
            };
        },

        // 在页面上查找id为findId的节点，替换成replaceHtml
        replace: function (findId, replaceHtml) {
            // 在findId外面添加一个DIV层，然后更新此wrapper的InnerHTML
            var findedControl = Ext.get(findId);
            if (findedControl) {
                var wrapper = findedControl.wrap().update(replaceHtml);
                // 将新增的节点移到wrapper上面
                wrapper.first().insertBefore(wrapper);
                // 然后删除wrapper
                wrapper.remove();
            }
        },

        // 隐藏PageLoading节点
        hidePageLoading: function () {
            /*
            if (fadeOut) {
                Ext.get("loading").remove();
                Ext.get("loading-mask").fadeOut({ remove: true });
            }
            else {
                Ext.get("loading").remove();
                Ext.get("loading-mask").remove();
            }
            */

            Ext.get("loading").hide();
            Ext.get("loading-mask").hide();
        },


        // 去掉字符串中的html标签
        stripHtmlTags: function (str) {
            return str.replace(/<[^>]*>/g, "");
        },




        // 向页面添加Loading...节点
        appendLoadingNode: function () {
            return F.util.appendFormNode({ tag: 'div', id: 'f_ajax_loading', cls: 'f-ajax-loading', html: F.util.loading });
        },

        // 向页面的 form 节点最后添加新的节点
        appendFormNode: function (htmlOrObj) {
            return Ext.DomHelper.append(document.forms[0], htmlOrObj);
        },

        // 向页面添加一个隐藏字段，如果已经存在则更新值
        setHiddenFieldValue: function (fieldId, fieldValue) {
            var itemNode = Ext.get(fieldId);
            if (!itemNode) {
                // Ext.DomHelper.append 有问题，例如下面这个例子得到的结果是错的；变通一下，先插入节点，在设置节点的值。
                // Ext.DomHelper.append(document.forms[0], { tag: "input", type: "hidden", value: '{"X_Items":[["Value1","可选项1",1],["Value2","可选项2（不可选择）",0],["Value3","可选项3（不可选择）",0],["Value4","可选项4",1],["Value5","可选项5",1],["Value6","可选项6",1],["Value7","可选择项7",1],["Value8","可选择项8",1],["Value9","可选择项9",1]],"SelectedValue":"Value1"}'});
                // 上面的这个字符串，在IETest的IE8模式下会变成：
                // {"DropDownList1":{"X_Items":[["Value1","\u9009\u9879 1",1],["Value2","\u9009\u9879 2\uff08\u4e0d\u53ef\u9009\u62e9\uff09",0],["Value3","\u9009\u9879 3\uff08\u4e0d\u53ef\u9009\u62e9\uff09",0],["Value4","\u9009\u9879 4",1],["Value5","\u9009\u9879 5",1],["Value6","\u9009\u9879 6",1],["Value7","\u9009\u9879 7",1],["Value8","\u9009\u9879 8",1],["Value9","\u9009\u9879 9",1]],"SelectedValue":"Value1"}}

                F.util.appendFormNode({ tag: "input", type: "hidden", id: fieldId, name: fieldId });
                Ext.get(fieldId).dom.value = fieldValue;
            }
            else {
                itemNode.dom.value = fieldValue;
            }
        },
        // 从表单中删除隐藏字段
        removeHiddenField: function (fieldId) {
            var itemNode = Ext.get(fieldId);
            if (itemNode) {
                itemNode.remove();
            }
        },
        // 获取页面中一个隐藏字段的值
        getHiddenFieldValue: function (fieldId) {
            var itemNode = Ext.get(fieldId);
            if (itemNode) {
                return itemNode.getValue();
            }
            return null;
        },

        // 禁用提交按钮（在回发之前禁用以防止重复提交）
        disableSubmitControl: function (controlClientID) {
            F(controlClientID).disable();
            F.util.setHiddenFieldValue('F_TARGET', controlClientID);
        },
        // 启用提交按钮（在回发之后启用提交按钮）
        enableSubmitControl: function (controlClientID) {
            F(controlClientID).enable();
            F.util.setHiddenFieldValue('F_TARGET', '');
        },



        /*
        // 更新ViewState的值
        updateViewState: function (newValue, startIndex, gzipped) {
            if (typeof (startIndex) === 'boolean') {
                gzipped = startIndex;
                startIndex = -1;
            }

            var viewStateHiddenFiledID = "__VIEWSTATE";
            if (gzipped) {
                viewStateHiddenFiledID = "__VIEWSTATE_GZ";
            }

            var oldValue = F.util.getHiddenFieldValue(viewStateHiddenFiledID);
            if (Ext.type(startIndex) == "number" && startIndex > 0) {
                if (startIndex < oldValue.length) {
                    oldValue = oldValue.substr(0, startIndex);
                }
            } else {
                // Added on 2011-5-2, this is a horrible mistake.
                oldValue = '';
            }
            F.util.setHiddenFieldValue(viewStateHiddenFiledID, oldValue + newValue);
        },

        // 更新EventValidation的值
        updateEventValidation: function (newValue) {
            F.util.setHiddenFieldValue("__EVENTVALIDATION", newValue);
        },
        */

        // 设置页面状态是否改变
        setPageStateChanged: function (changed) {
            var pageState = Ext.get("F_CHANGED");
            if (pageState) {
                pageState.dom.value = changed;
            }
        },

        // 页面状态是否改变
        isPageStateChanged: function () {
            var pageState = Ext.get("F_CHANGED");
            if (pageState && pageState.getValue() == "true") {
                return true;
            }
            return false;
        },


        // 阻止页面关闭（页面中iframe内的表单已改变，或者页面中iframe定义了beforeunload）
        preventPageClose: function (el) {
            var me = this;

            // 是否阻止关闭
            var preventClose = false;

            var iframeEls;
            if (el) {
                iframeEls = el.select('iframe');
            } else {
                iframeEls = Ext.select('iframe');
            }

            iframeEls.each(function (iframeEl) {
                var iframeWnd = iframeEl.dom.contentWindow;

                if (!F.canAccess(iframeWnd)) {
                    return true; // continue
                }

                if (iframeWnd && iframeWnd.F) {
                    var iframeF = iframeWnd.F;

                    // 启用表单改变确认对话框 并且 表单已改变
                    if (iframeF.formChangeConfirm && iframeF.util.formChanged()) {
                        // 阻止关闭当前面板
                        if (!window.confirm(F.wnd.formChangeConfirmMsg)) {
                            preventClose = true;
                            return false; // break
                        } else {
                            // 没有阻止，不要在触发 $(window).beforeunload 事件了
                            iframeF.beforeunloadCheck = false;
                        }
                    }

                    /*
                    // 是否自定义了 beforeunload 事件
                    var beforeunloadCallbacks = iframeF.util._fjs_getEvent('beforeunload');
                    if (beforeunloadCallbacks) {
                        for (var i = 0, count = beforeunloadCallbacks.length; i < count; i++) {
                            var beforeunloadCallback = beforeunloadCallbacks[i];

                            var confirmMsg = beforeunloadCallback.apply(iframeWnd);
                            if (confirmMsg) {
                                // 阻止关闭当前面板
                                if (!window.confirm(confirmMsg)) {
                                    preventClose = true;
                                    return false; // break
                                } else {
                                    // 没有阻止，不要在触发 $(window).beforeunload 事件了
                                    iframeF.beforeunloadCheck = false;
                                }
                            }
                        }
                    }
                    */

                    // 子页面是否阻止关闭
                    var childrenPreventClose = iframeF.util.preventPageClose();
                    if (childrenPreventClose) {

                        // 被子页面阻止了，则恢复父页面的 beforeunloadCheck 标识
                        iframeF.beforeunloadCheck = true;

                        preventClose = true;
                        return false; // break
                    }
                }

            });

            return preventClose;
        },

        // 页面中表单字段是否改变
        formChanged: function () {
            var changed = false;
            resolveRenderToObj(function (obj) {
                if (obj.isXType('container') && obj.f_isDirty()) {
                    changed = true;
                    return false; // break
                }
            });

            return changed;
        },


        // 验证多个表单，返回数组[是否验证通过，第一个不通过的表单字段]
        validForms: function (forms, targetName, showBox) {
            var target = F.util.getTargetWindow(targetName);
            var valid = true;
            var firstInvalidField = null;
            for (var i = 0; i < forms.length; i++) {
                var result = F(forms[i]).f_isValid();
                if (!result[0]) {
                    valid = false;
                    if (firstInvalidField == null) {
                        firstInvalidField = result[1];
                    }
                }
            }

            if (!valid) {
                if (showBox) {
                    var alertMsg = Ext.String.format(F.util.formAlertMsg, firstInvalidField.fieldLabel);
                    target.F.util.alert(alertMsg, F.util.formAlertTitle, Ext.MessageBox.INFO);
                }
                return false;
            }
            return true;
        },


        // 判断隐藏字段值（数组）是否包含value
        isHiddenFieldContains: function (domId, testValue) {
            testValue += "";
            var domValue = Ext.get(domId).dom.value;
            if (domValue === "") {
                //console.log(domId);
                return false;
            }
            else {
                var sourceArray = domValue.split(",");
                return Ext.Array.indexOf(sourceArray, testValue) >= 0 ? true : false;
            }
        },


        // 将一个字符添加到字符列表中，将2添加到[5,3,4]
        addValueToHiddenField: function (domId, addValue) {
            addValue += "";
            var domValue = Ext.get(domId).dom.value;
            if (domValue == "") {
                Ext.get(domId).dom.value = addValue + "";
            }
            else {
                var sourceArray = domValue.split(",");
                if (Ext.Array.indexOf(sourceArray, addValue) < 0) {
                    sourceArray.push(addValue);
                    Ext.get(domId).dom.value = sourceArray.join(",");
                }
            }
        },


        // 从字符列表中移除一个字符，将2从dom的值"5,3,4,2"移除
        removeValueFromHiddenField: function (domId, addValue) {
            addValue += "";
            var domValue = Ext.get(domId).dom.value;
            if (domValue != "") {
                var sourceArray = domValue.split(",");
                if (Ext.Array.indexOf(sourceArray, addValue) >= 0) {
                    sourceArray = sourceArray.remove(addValue);
                    Ext.get(domId).dom.value = sourceArray.join(",");
                }
            }
        },


        // 取得隐藏字段的值
        getHiddenFieldValue: function (fieldId) {
            var itemNode = Ext.get(fieldId);
            if (!itemNode) {
                return "";
            }
            else {
                return itemNode.dom.value;
            }
        },


        // 取得表单字段的值
        getFormFieldValue: function (cmp) {
            if (typeof (cmp) === 'string') {
                cmp = F(cmp);
            }
            var value = cmp.getValue();
            if (cmp.isXType('displayfield')) {
                value = value.replace(/<\/?span[^>]*>/ig, '');
            }
            return value;
        },


        // 由target获取window对象
        getTargetWindow: function (target) {
            var wnd = window;
            if (target === '_self') {
                wnd = window;
            } else if (target === '_parent') {
                wnd = parent;
            } else if (target === '_top') {
                wnd = top;
            }
            return wnd;
        },


        // 预加载图片
        preloadImages: function (images) {
            var imageInstance = [];
            for (var i = 0; i < images.length; i++) {
                imageInstance[i] = new Image();
                imageInstance[i].src = images[i];
            }
        },

        hasCSS: function (id) {
            return !!Ext.get(id);
        },

        addCSS: function (id, content, isCSSFile) {

            // 如果此节点已经存在，则先删除此节点
            var node = Ext.get(id);
            if (node) {
                Ext.removeNode(node.dom);
            }

			/*
            var ss1;

            if (isCSSFile) {
                ss1 = document.createElement('link');
                ss1.setAttribute('type', 'text/css');
                ss1.setAttribute('rel', 'stylesheet');
                ss1.setAttribute('id', id);
                ss1.setAttribute('href', content);
            } else {
                // Tricks From: http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
                ss1 = document.createElement("style");
                ss1.setAttribute("type", "text/css");
                ss1.setAttribute("id", id);
                if (ss1.styleSheet) {   // IE
                    ss1.styleSheet.cssText = content;
                } else {                // the world
                    var tt1 = document.createTextNode(content);
                    ss1.appendChild(tt1);
                }
            }

            var hh1 = document.getElementsByTagName("head")[0];
            hh1.appendChild(ss1);
			*/
			
			var ss1;
			var hh1 = document.getElementsByTagName('head')[0];
			if (isCSSFile) {
				ss1 = document.createElement('link');
				//ss1.setAttribute('type', 'text/css');
				ss1.setAttribute('rel', 'stylesheet');
				ss1.setAttribute('id', id);
				ss1.setAttribute('href', content);
				hh1.appendChild(ss1);
			} else {
				// Tricks From: http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
				ss1 = document.createElement('style');
				//ss1.setAttribute('type', 'text/css');
				ss1.setAttribute('id', id);
				// Update: note that it's important for IE that you append the style to the head *before* setting its content. Otherwise IE678 will *crash* is the css string contains an @import. 
				hh1.appendChild(ss1); 
				if (ss1.styleSheet) {   // IE
					ss1.styleSheet.cssText = content;
				} else {                // the world
					var tt1 = document.createTextNode(content);
					ss1.appendChild(tt1);
				}
			}
			
        },

        /*
        // 在启用AJAX的情况下，使所有的Asp.net的提交按钮（type="submit"）不要响应默认的submit行为，而是自定义的AJAX
        makeAspnetSubmitButtonAjax: function (buttonId) {
        
        // 低版本IE浏览器不允许使用JS修改input标签的type属性，导致此函数无效
        function resetButton(button) {
        button.set({ "type": "button" });
        button.addListener("click", function (event, el) {
        __doPostBack(el.getAttribute("name"), "");
        event.stopEvent();
        });
        }
        
        if (typeof (buttonId) === "undefined") {
        Ext.Array.each(Ext.DomQuery.select("input[type=submit]"), function (item, index) {
        resetButton(Ext.get(item));
        });
        } else {
        var button = Ext.get(buttonId);
        if (button.getAttribute("type") === "submit") {
        resetButton(button);
        }
        }
        
        },
        
        */

        htmlEncode: function (str) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        },

        htmlDecode: function (str) {
            var div = document.createElement("div");
            div.innerHTML = str;
            return div.innerHTML;
        },


        // Whether a object is empty (With no property) or not.
        // 可以使用 Ext.Object.isEmpty
        isObjectEmpty: function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        },

        // Convert an array to object.
        // ['Text', 'Icon']  -> {'Text':true, 'Icon': true}
        arrayToObject: function (arr) {
            var obj = {};
            Ext.Array.each(arr, function (item, index) {
                obj[item] = true;
            });
            return obj;
        },

        hideScrollbar: function () {
            if (Ext.isIE) {
                window.document.body.scroll = 'no';
            } else {
                window.document.body.style.overflow = 'hidden';
            }
        },


        // 动态添加一个标签页
        // mainTabStrip： 选项卡实例
        // id： 选项卡ID
        // url: 选项卡IFrame地址 
        // text： 选项卡标题
        // icon： 选项卡图标
        // addTabCallback： 创建选项卡前的回调函数（接受tabConfig参数）
        // refreshWhenExist： 添加选项卡时，如果选项卡已经存在，是否刷新内部IFrame
        addMainTab: function (mainTabStrip, id, url, text, icon, createToolbar, refreshWhenExist) {
            var iconId, iconCss, tabId, currentTab, tabConfig;

            // 兼容 addMainTab(mainTabStrip, treeNode, addTabCallback, refreshWhenExist) 调用方式
            if (typeof (id) !== 'string') {
                refreshWhenExist = text;
                createToolbar = url;
                url = id.data.href;
                icon = id.data.icon;
                text = id.data.text;

                id = id.getId();
            }

            //var href = node.attributes.href;
            if (icon) {
                iconId = icon.replace(/\W/ig, '_');
                if (!F.util.hasCSS(iconId)) {
                    iconCss = [];
                    iconCss.push('.');
                    iconCss.push(iconId);
                    iconCss.push('{background-image:url("');
                    iconCss.push(icon);
                    iconCss.push('")}');
                    F.util.addCSS(iconId, iconCss.join(''));
                }
            }
            // 动态添加一个带工具栏的标签页
            //tabId = 'dynamic_added_tab' + id.replace('__', '-');
            currentTab = mainTabStrip.getTab(id);
            if (!currentTab) {
                tabConfig = {
                    'id': id,
                    'url': url,
                    'title': text,
                    'closable': true,
                    'bodyStyle': 'padding:0px;'
                };
                if (icon) {
                    tabConfig['iconCls'] = iconId;
                }

                if (createToolbar) {
                    var addTabCallbackResult = createToolbar.apply(window, [tabConfig]);
                    // 兼容之前的方法，函数返回值如果不为空，则将返回值作为顶部工具条实例
                    if (addTabCallbackResult) {
                        tabConfig['tbar'] = addTabCallbackResult;
                    }
                }
                mainTabStrip.addTab(tabConfig);
            } else {
                mainTabStrip.setActiveTab(currentTab);
                currentTab.setTitle(text);
                if (icon) {
                    currentTab.setIconCls(iconId);
                }
                if (refreshWhenExist) {
                    var iframeNode = currentTab.body.query('iframe')[0];
                    if (iframeNode) {
                        if (url) {
                            iframeNode.contentWindow.location.href = url;
                        } else {
                            iframeNode.contentWindow.location.reload();
                        }
                    }
                }

            }
        },

        // 初始化左侧树（或者手风琴+树）与右侧选项卡控件的交互
        // treeMenu： 主框架中的树控件实例，或者内嵌树控件的手风琴控件实例
        // mainTabStrip： 选项卡实例
        // createToolbar： 创建选项卡前的回调函数（接受tabConfig参数）
        // updateLocationHash: 切换Tab时，是否更新地址栏Hash值
        // refreshWhenExist： 添加选项卡时，如果选项卡已经存在，是否刷新内部IFrame
        // refreshWhenTabChange: 切换选项卡时，是否刷新内部IFrame
        // hashWindow：需要更新Hash值的窗口对象，默认为当前window
        initTreeTabStrip: function (treeMenu, mainTabStrip, createToolbar, updateLocationHash, refreshWhenExist, refreshWhenTabChange, hashWindow) {
            if (!hashWindow) {
                hashWindow = window;
            }

            // 注册树的节点点击事件
            function registerTreeClickEvent(treeInstance) {
                treeInstance.on('itemclick', function (view, record, item, index, event) {
                    var href = record.data.href;

                    // record.isLeaf()
                    // 不管当前节点是否子节点，只要有 href 属性，都需要打开一个新Tab
                    if (href) {
                        // 阻止事件传播
                        event.stopEvent();

                        if (updateLocationHash) {
                            // 修改地址栏
                            hashWindow.location.hash = '#' + href;
                        }

                        // 新增Tab节点
                        F.util.addMainTab(mainTabStrip, record, createToolbar, refreshWhenExist);
                    }
                });
            }

            // treeMenu可能是Accordion或者Tree
            if (treeMenu.getXType() === 'panel') {
                treeMenu.items.each(function (item) {
                    var tree = item.items.getAt(0);
                    if (tree && tree.getXType() === 'treepanel') {
                        registerTreeClickEvent(tree);
                    }
                });
            } else if (treeMenu.getXType() === 'treepanel') {
                registerTreeClickEvent(treeMenu);
            }

            // 切换主窗口的Tab
            mainTabStrip.on('tabchange', function (tabStrip, tab) {
                var tabHash = '#' + (tab.url || '');

                // 只有当浏览器地址栏的Hash值和将要改变的不一样时，才进行如下两步处理：
                // 1. 更新地址栏Hash值
                // 2. 刷新Tab内的IFrame
                if (tabHash !== hashWindow.location.hash) {

                    if (updateLocationHash) {
                        hashWindow.location.hash = tabHash;
                    }

                    if (refreshWhenTabChange) {
                        var iframeNode = tab.body.query('iframe')[0];
                        if (iframeNode) {
                            var currentLocationHref = iframeNode.contentWindow.location.href;
                            if (/^http(s?):\/\//.test(currentLocationHref)) {
                                iframeNode.contentWindow.location.reload();
                            }
                        }
                    }
                }

            });


            // 页面第一次加载时，根据URL地址在主窗口加载页面
            var HASH = hashWindow.location.hash.substr(1);
            if (HASH) {
                var FOUND = false;

                function initTreeMenu(treeInstance, node) {
                    var i, currentNode, nodes, node, path;
                    if (!FOUND && node.hasChildNodes()) {
                        nodes = node.childNodes;
                        for (i = 0; i < nodes.length; i++) {
                            currentNode = nodes[i];
                            if (currentNode.isLeaf()) {
                                if (currentNode.data.href === HASH) {
                                    path = currentNode.getPath();
                                    treeInstance.expandPath(path); //node.expand();
                                    treeInstance.selectPath(path); // currentNode.select();
                                    F.util.addMainTab(mainTabStrip, currentNode, createToolbar);
                                    FOUND = true;
                                    return;
                                }
                            } else {
                                arguments.callee(treeInstance, currentNode);
                            }
                        }
                    }
                }

                if (treeMenu.getXType() === 'panel') {
                    treeMenu.items.each(function (item) {
                        var tree = item.items.getAt(0);
                        if (tree && tree.getXType() === 'treepanel') {
                            initTreeMenu(tree, tree.getRootNode());

                            // 找到树节点
                            if (FOUND) {
                                item.expand();
                                return false;
                            }
                        }
                    });
                } else if (treeMenu.getXType() === 'treepanel') {
                    initTreeMenu(treeMenu, treeMenu.getRootNode());
                }
            }

        },

        // 复选框分组处理
        resolveCheckBoxGroup: function (name, xstateContainer, isradiogroup) {
            var items = [], i, count, xitem, xitemvalue, xitems, xselectedarray, xselected, xchecked, xitemname;

            xitems = xstateContainer.F_Items;
            xselectedarray = xstateContainer.SelectedValueArray;
            xselected = xstateContainer.SelectedValue;

            if (xitems && xitems.length > 0) {
                for (i = 0, count = xitems.length; i < count; i++) {
                    xitem = xitems[i];
                    xitemvalue = xitem[1];
                    xchecked = false;
                    if (!isradiogroup) {
                        // xselectedarray 可能是undefined, [], ["value1", "value2"]
                        if (xselectedarray) {
                            xchecked = (Ext.Array.indexOf(xselectedarray, xitemvalue) >= 0) ? true : false;
                        }
                        xitemname = name + '_' + i;
                    } else {
                        xchecked = (xselected === xitemvalue) ? true : false;
                        xitemname = name;
                    }
                    items.push({
                        'inputValue': xitemvalue,
                        'boxLabel': xitem[0],
                        'name': xitemname,
                        'checked': xchecked
                    });
                }
            }
            /*
            else {
                items.push({
                    'inputValue': "tobedeleted",
                    'boxLabel': "&nbsp;",
                    'name': "tobedeleted"
                });
            }
            */
            return items;

        },

        // 防止在短时间内，同一GroupName的单选框触发两次事件
        // 用于 MenuCheckBox 和 RadioButton
        checkGroupLastTime: function (groupName) {
            var checkName = groupName + '_lastupdatetime';
            var checkValue = F.util[checkName];
            F.util[checkName] = new Date();
            if (typeof (checkValue) === 'undefined') {
                return true;
            } else {
                if ((new Date() - checkValue) < 100) {
                    return false;
                } else {
                    return true;
                }
            }
        },

        // 对话框图标
        getMessageBoxIcon: function (iconShortName) {
            var icon = iconShortName || Ext.MessageBox.WARNING;
            if (iconShortName === 'info') {
                icon = Ext.MessageBox.INFO;
            } else if (iconShortName === 'warning') {
                icon = Ext.MessageBox.WARNING;
            } else if (iconShortName === 'question') {
                icon = Ext.MessageBox.QUESTION;
            } else if (iconShortName === 'error') {
                icon = Ext.MessageBox.ERROR;
            }
            return icon;
        },

        // 提示框图标
        getNotifyIcon: function (iconShortName) {
            var icon = 'ux-notification-icon-info';
            if (iconShortName === 'error') {
                icon = 'ux-notification-icon-error';
            } else if (iconShortName === 'success') {
                icon = 'ux-notification-icon-success';
            } else if (iconShortName === 'info') {
                icon = 'ux-notification-icon-information';
            } else if (iconShortName === 'warn') {
                icon = 'ux-notification-icon-warn';
            }
            return icon;
        },

        // 消息框文字
        // add by wz
        getButtonText: function (buttonsShortName, okText, cancelText, yesText, noText) {
            var buttonText = Ext.MessageBox.buttonText.ok;
            if (buttonsShortName === '_cancel') {
                buttonText = { cancel: cancelText || Ext.MessageBox.buttonText.cancel };
            } else if (buttonsShortName === '_no') {
                buttonText = { no: noText || Ext.MessageBox.buttonText.no };
            } else if (buttonsShortName === '_ok') {
                buttonText = { ok: okText || Ext.MessageBox.buttonText.ok };
            } else if (buttonsShortName === '_ok_cancel') {
                buttonText = { cancel: cancelText || Ext.MessageBox.buttonText.cancel, ok: okText || Ext.MessageBox.buttonText.ok };
            } else if (buttonsShortName === '_yes') {
                buttonText = { yes: yesText || Ext.MessageBox.buttonText.yes };
            } else if (buttonsShortName === '_yes_no') {
                buttonText = { yes: yesText || Ext.MessageBox.buttonText.yes, no: noText || Ext.MessageBox.buttonText.no };
            } else if (buttonsShortName === '_yes_no_cancel') {
                buttonText = { yes: yesText || Ext.MessageBox.buttonText.yes, no: noText || Ext.MessageBox.buttonText.no, cancel: cancelText || Ext.MessageBox.buttonText.cancel };
            }
            return buttonText;
        },

        // 消息框按钮样式
        // add by wz
        getMessageBoxButtons: function (buttonsShortName) {
            var buttons = Ext.MessageBox.OK;
            if (buttonsShortName === '_cancel') {
                buttons = Ext.MessageBox.CANCEL;
            } else if (buttonsShortName === '_no') {
                buttons = Ext.MessageBox.NO;
            } else if (buttonsShortName === '_ok') {
                buttons = Ext.MessageBox.OK;
            } else if (buttonsShortName === '_ok_cancel') {
                buttons = Ext.MessageBox.OKCANCEL;
            } else if (buttonsShortName === '_yes') {
                buttons = Ext.MessageBox.YES;
            } else if (buttonsShortName === '_yes_no') {
                buttons = Ext.MessageBox.YESNO;
            } else if (buttonsShortName === '_yes_no_cancel') {
                buttons = Ext.MessageBox.YESNOCANCEL;
            }
            return buttons;
        },

        // 弹出Alert对话框
        alert: function (target, message, title, messageIcon, ok) { // 老的顺序：msg, title, icon, okscript
            var args = [].slice.call(arguments, 0);

            var options = args[0];
            if (typeof (options) === 'string') {
                if (!/^_self|_parent|_top$/.test(args[0])) {
                    args.splice(0, 0, '_self');
                }
                options = {
                    target: args[0],
                    message: args[1],
                    title: args[2],
                    messageIcon: args[3],
                    ok: args[4]
                };
            }

            var wnd = F.util.getTargetWindow(options.target);
            if (!F.canAccess(wnd)) {
                return; // return
            }

            var icon = Ext.MessageBox.INFO;
            if (options.messageIcon) {
                icon = F.util.getMessageBoxIcon(options.messageIcon);
            }

            wnd.Ext.MessageBox.show({
                cls: options.cls || '',
                title: options.title || F.util.alertTitle,
                msg: options.message,
                buttons: Ext.MessageBox.OK,
                icon: icon,
                fn: function (buttonId) {
                    if (buttonId === "ok") {
                        if (typeof (options.ok) === "function") {
                            options.ok.call(window);
                        }
                    }
                }
            });
        },



        // 确认对话框
        confirm: function (target, message, title, messageIcon, ok, cancel) { // 老的顺序：targetName, title, msg, okScript, cancelScript, iconShortName) 

            var args = [].slice.call(arguments, 0); //$.makeArray(arguments);

            var options = args[0];
            if (typeof (options) === 'string') {
                if (!/^_self|_parent|_top$/.test(args[0])) {
                    args.splice(0, 0, '_self');
                }
                options = {
                    target: args[0],
                    message: args[1],
                    title: args[2],
                    messageIcon: args[3],
                    ok: args[4],
                    cancel: args[5]
                };
            }


            var wnd = F.util.getTargetWindow(options.target);
            if (!F.canAccess(wnd)) {
                return; // return
            }

            var icon = F.util.getMessageBoxIcon(options.messageIcon);
            wnd.Ext.MessageBox.show({
                cls: options.cls || '',
                title: options.title || F.util.confirmTitle,
                msg: options.message,
                buttons: Ext.MessageBox.OKCANCEL,
                icon: icon,
                fn: function (btn) {
                    if (btn == 'cancel') {
                        if (options.cancel) {
                            if (typeof (options.cancel) === 'string') {
                                new Function(options.cancel)();
                            } else {
                                options.cancel.apply(wnd);
                            }
                        } else {
                            return false;
                        }
                    } else {
                        if (options.ok) {
                            if (typeof (options.ok) === 'string') {
                                new Function(options.ok)();
                            } else {
                                options.ok.apply(wnd);
                            }
                        } else {
                            return false;
                        }
                    }
                }
            });
        },

        // 提示框
        // add by wz
        notify: function (target, message, title, notifyIcon) {
            var args = [].slice.call(arguments, 0); //$.makeArray(arguments);

            var options = args[0];
            if (typeof (options) === 'string') {
                if (!/^_self|_parent|_top$/.test(args[0])) {
                    args.splice(0, 0, '_self');
                }
                options = {
                    target: args[0],
                    message: args[1],
                    title: args[2],
                    type: args[3]
                };
            }

            var wnd = F.util.getTargetWindow(options.target);
            if (!F.canAccess(wnd)) {
                return; // return
            }

            var icon = F.util.getNotifyIcon(options.notifyIcon);
            wnd.Ext.create('widget.uxNotification', {
                title: options.title,
                position: 'br',
                cls: 'ux-notification-light',
                iconCls: icon,
                spacing: 20,
                html: options.message,
                slideInDuration: 800,
                slideBackDuration: 1500,
                autoCloseDelay: 4000,
                slideInAnimation: 'elasticIn',
                slideBackAnimation: 'elasticIn'
            }).show();
        },

        // 自定义对话框
        // add by wz
        show: function (target, message, title, messageIcon,
            okScript, cancelScript, yesScript, noScript,
            buttonsShortName,
            okText, cancelText, yesText, noText) {

            var args = [].slice.call(arguments, 0); //$.makeArray(arguments);

            var options = args[0];
            if (typeof (options) === 'string') {
                if (!/^_self|_parent|_top$/.test(args[0])) {
                    args.splice(0, 0, '_self');
                }
                options = {
                    target: args[0],
                    message: args[1],
                    title: args[2],
                    messageIcon: args[3],
                    okScript: args[4],
                    cancelScript: args[5],
                    yesScript: args[6],
                    noScript: args[7],
                    buttonsShortName: args[8],
                    okText: args[9],
                    cancelText: args[10],
                    yesText: args[11],
                    noText: args[12]
                };
            }

            var wnd = F.util.getTargetWindow(options.target);
            if (!F.canAccess(wnd)) {
                return; // return
            }

            var icon = F.util.getMessageBoxIcon(options.messageIcon);
            var buttonText = F.util.getButtonText(options.buttonsShortName, options.okText, options.cancelText, options.yesText, options.noText);
            var buttons = F.util.getMessageBoxButtons(options.buttonsShortName);
            wnd.Ext.MessageBox.show({
                cls: options.cls || '',
                title: options.title || F.util.confirmTitle,
                minWidth: 260,
                msg: options.message,
                buttons: buttons,
                buttonText: buttonText,
                icon: icon,
                fn: function (btn) {
                    if (btn == 'cancel') {
                        if (options.cancelScript) {
                            if (typeof (options.cancelScript) === 'string') {
                                new Function(options.cancelScript)();
                            } else {
                                options.cancelScript.apply(wnd);
                            }
                        } else {
                            return false;
                        }
                    } else if (btn == 'ok') {
                        if (options.okScript) {
                            if (typeof (options.okScript) === 'string') {
                                new Function(options.okScript)();
                            } else {
                                options.okScript.apply(wnd);
                            }
                        } else {
                            return false;
                        }
                    } else if (btn == 'yes') {
                        if (options.yesScript) {
                            if (typeof (options.yesScript) === 'string') {
                                new Function(options.yesScript)();
                            } else {
                                options.yesScript.apply(wnd);
                            }
                        } else {
                            return false;
                        }
                    } else if (btn == 'no') {
                        if (options.noScript) {
                            if (typeof (options.noScript) === 'string') {
                                new Function(options.noScript)();
                            } else {
                                options.noScript.apply(wnd);
                            }
                        } else {
                            return false;
                        }
                    } else return false;
                }
            });
        },

        summaryType: function (gridId) {
            return function (records, dataIndex) {
                var summary = F(gridId).f_state['SummaryData'];
                if (summary) {
                    var value = summary[dataIndex];
                    if (typeof (value) !== 'undefined') {
                        return value;
                    }
                }
                return '';
            };
        },

        // 表单字段内按回车键触发提交按钮
        registerPanelEnterKey: function (panel) {
            if (F.submitbutton) {
                Ext.create('Ext.util.KeyNav', panel.el, {
                    enter: function (e) {
                        var el = Ext.Element.getActiveElement();
                        if (el.type !== 'textarea') {
                            F(F.submitbutton).el.dom.click();
                        }
                    },
                    scope: panel
                });
            }
        },

        reset: function () {
            Ext.ComponentManager.each(function (key, cmp) {
                if (cmp.isXType && cmp.isXType('panel') && cmp.renderTo) {
                    cmp.f_reset();
                }
            });
        },


        isDate: function (value) {
            return Object.prototype.toString.call(value) === '[object Date]';
        },

        resolveGridDateToString: function (fields, fieldName, fieldValue) {
            var i, fieldConfig, result = fieldValue;
            for (i = 0, count = fields.length; i < count; i++) {
                fieldConfig = fields[i];
                if (fieldConfig.name === fieldName && fieldConfig.type === 'date' && fieldConfig.dateFormat) {
                    result = Ext.util.Format.date(fieldValue, fieldConfig.dateFormat);
                }
            }
            return result;
        },


        

        noop: function () { }

    };




})();