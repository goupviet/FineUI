#Update Log


##20150722

####MessageBox
+ 根据Extjs增加的更强大的MessageBox类，取代Alert
+ F.util.js中增加的F.show方法

####Notify
+ 增加的浮动/自动消失的通知类
+ F.util.js中增加的F.notify方法
+ ux中增加的Ext.ux.window.Notification插件
+ build.bat以及build_only_css.bat增加Notification.js的引用

####Group&Summary
+ Grid.cs增加的EnableGroup选项
+ Grid.cs增加的Group相关事件
+ 增加的GridGroupEventArgs事件类型
+ GridColumn中增加的SummaryType和SummaryRenderer选项

####GridColumn数据类型
+ GridColumn增加的DataType属性
+ 增加的GridColumnDataType枚举
+ BoundField在DataType设置的情况下不将数值转为string类型以便于数值计算

####EnableColumnHide
+ 是否允许显示/隐藏列

####Sort
+ 禁止排序时隐藏表头中正序/倒序的下拉菜单