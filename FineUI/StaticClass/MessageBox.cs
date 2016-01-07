
#region Comment

/*
 * Project：    FineUI
 * 
 * FileName:    MessageBox.cs
 * CreatedOn:   2016-01-07
 * CreatedBy:   wz
 * 
 * 
 * Description：
 *      ->
 *   
 * History：
 * 
 * 
 * 
 */

#endregion

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Drawing;

namespace FineUI
{
    /// <summary>
    /// 自定义对话框帮助类（静态类）
    /// </summary>
    public class MessageBox
    {
        #region public static

        //public static string DefaultTitle = "自定义对话框";

        /// <summary>
        /// 自定义对话框默认图标
        /// </summary>
        public static MessageBoxIcon DefaultMessageBoxIcon = MessageBoxIcon.Question;


        ///// <summary>
        ///// 自定义对话框默认图标
        ///// </summary>
        //public static MessageBoxIcon DefaultIcon = NotifyIcon.Question;


        #endregion

        #region class

        private string _cssClass;

        /// <summary>
        /// 样式类名
        /// </summary>
        public string CssClass
        {
            get { return _cssClass; }
            set { _cssClass = value; }
        }


        private string _message;

        /// <summary>
        /// 对话框消息正文
        /// </summary>
        public string Message
        {
            get { return _message; }
            set { _message = value; }
        }

        private string _title;

        /// <summary>
        /// 对话框标题
        /// </summary>
        public string Title
        {
            get { return _title; }
            set { _title = value; }
        }

        private MessageBoxIcon _messageBoxIcon = DefaultMessageBoxIcon;

        /// <summary>
        /// 对话框图标
        /// </summary>
        public MessageBoxIcon MessageBoxIcon
        {
            get { return _messageBoxIcon; }
            set { _messageBoxIcon = value; }
        }

        private string _okScript;

        /// <summary>
        /// 点击确认按钮执行的JavaScript脚本
        /// </summary>
        public string OkScript
        {
            get { return _okScript; }
            set { _okScript = value; }
        }


        private string _cancelScript;

        /// <summary>
        /// 点击取消按钮执行的JavaScript脚本
        /// </summary>
        public string CancelScript
        {
            get { return _cancelScript; }
            set { _cancelScript = value; }
        }

        private string _yesScript;

        /// <summary>
        /// 点击是按钮执行的JavaScript脚本
        /// </summary>
        public string YesScript
        {
            get { return _yesScript; }
            set { _yesScript = value; }
        }

        private string _noScript;

        /// <summary>
        /// 点击否按钮执行的JavaScript脚本
        /// </summary>
        public string NoScript
        {
            get { return _noScript; }
            set { _noScript = value; }
        }

        private MessageBoxButtons _buttons;

        /// <summary>
        /// 按钮类别
        /// </summary>
        public MessageBoxButtons Buttons
        {
            get { return _buttons; }
            set { _buttons = value; }
        }

        private string _okText;

        /// <summary>
        /// 点击确认按钮显示的文本
        /// </summary>
        public string OkText
        {
            get { return _okText; }
            set { _okText = value; }
        }


        private string _cancelText;

        /// <summary>
        /// 点击取消按钮显示的文本
        /// </summary>
        public string CancelText
        {
            get { return _cancelText; }
            set { _cancelText = value; }
        }

        private string _yesText;

        /// <summary>
        /// 点击是按钮显示的文本
        /// </summary>
        public string YesText
        {
            get { return _yesText; }
            set { _yesText = value; }
        }

        private string _noText;

        /// <summary>
        /// 点击否按钮显示的文本
        /// </summary>
        public string NoText
        {
            get { return _noText; }
            set { _noText = value; }
        }

        private Target _target;

        /// <summary>
        /// 对话框的目标位置
        /// </summary>
        public Target Target
        {
            get { return _target; }
            set { _target = value; }
        }

        //private string _iconUrl;

        ///// <summary>
        ///// 自定义对话框图标地址
        ///// </summary>
        //public string IconUrl
        //{
        //    get { return _iconUrl; }
        //    set { _iconUrl = value; }
        //}

        //private Icon _icon = Icon.None;

        ///// <summary>
        ///// 自定义对话框图标
        ///// </summary>
        //public Icon Icon
        //{
        //    get { return _icon; }
        //    set { _icon = value; }
        //}


        /// <summary>
        /// 显示对话框
        /// </summary>
        public void Show()
        {
            PageContext.RegisterStartupScript(this.GetShowReference());
        }

        /// <summary>
        /// 获取显示对话框的客户端脚本
        /// </summary>
        /// <returns>客户端脚本</returns>
        public string GetShowReference()
        {
            string message = "";
            string title = "";
            string buttonsShortName = "";
            if (!String.IsNullOrEmpty(Message))
            {
                message = Message;
            }
            if (!String.IsNullOrEmpty(Title))
            {
                title = Title;
            }
            buttonsShortName = MessageBoxButtonsHelper.GetShortName(Buttons);

            JsObjectBuilder jsOB = new JsObjectBuilder();

            if (!String.IsNullOrEmpty(NoText))
            {
                jsOB.AddProperty("noText", NoText);
            }

            if (!String.IsNullOrEmpty(YesText))
            {
                jsOB.AddProperty("yesText", YesText);
            }

            if (!String.IsNullOrEmpty(CancelText))
            {
                jsOB.AddProperty("cancelText", CancelText);
            }

            if (!String.IsNullOrEmpty(OkText))
            {
                jsOB.AddProperty("okText", OkText);
            }

            if (!String.IsNullOrEmpty(buttonsShortName))
            {
                jsOB.AddProperty("buttonsShortName", buttonsShortName);
            }

            if (!String.IsNullOrEmpty(NoScript))
            {
                jsOB.AddProperty("noScript", NoScript);
            }

            if (!String.IsNullOrEmpty(YesScript))
            {
                jsOB.AddProperty("yesScript", YesScript);
            }

            if (!String.IsNullOrEmpty(CancelScript))
            {
                jsOB.AddProperty("cancelScript", CancelScript);
            }

            if (!String.IsNullOrEmpty(OkScript))
            {
                jsOB.AddProperty("okScript", OkScript);
            }

            if (Target != Target.Self)
            {
                jsOB.AddProperty("target", TargetHelper.GetName(Target));
            }

            if (MessageBoxIcon != MessageBoxIcon.Warning)
            {
                jsOB.AddProperty("messageIcon", MessageBoxIconHelper.GetShortName(MessageBoxIcon));
            }

            if (!String.IsNullOrEmpty(title))
            {
                jsOB.AddProperty("title", title.Replace("\r\n", "\n").Replace("\n", "<br/>"));
            }

            if (!String.IsNullOrEmpty(message))
            {
                jsOB.AddProperty("message", JsHelper.EnquoteWithScriptTag(message.Replace("\r\n", "\n").Replace("\n", "<br/>")), true);
            }

            return String.Format("F.show({0});", jsOB.ToString());
        }

        #endregion


        #region static Show

        public static void Show(string message, string title = null, MessageBoxIcon icon = MessageBoxIcon.Question,
            MessageBoxButtons buttons = MessageBoxButtons.OK,
            string okScript = null, string cancelScript = null, string yesScript = null, string noScript = null,
            string okText = null, string cancelText = null, string yesText = null, string noText = null,
            Target target = Target.Top)
        {
            PageContext.RegisterStartupScript(GetShowReference(message, title, icon, buttons,
                okScript, cancelScript, yesScript, noScript, okText, cancelText, yesText, noText, target));
        }

        #endregion

        #region GetShowReference

        public static string GetShowReference(string message, string title = null, MessageBoxIcon icon = MessageBoxIcon.Question,
            MessageBoxButtons buttons = MessageBoxButtons.OK,
            string okScript = null, string cancelScript = null, string yesScript = null, string noScript = null,
            string okText = null, string cancelText = null, string yesText = null, string noText = null,
            Target target = Target.Top)
        {
            MessageBox messageBox = new MessageBox();
            messageBox.Message = message;
            messageBox.Title = title;
            messageBox.MessageBoxIcon = icon;
            messageBox.Buttons = buttons;
            messageBox.OkScript = okScript;
            messageBox.CancelScript = cancelScript;
            messageBox.YesScript = yesScript;
            messageBox.NoScript = noScript;
            messageBox.OkText = okText;
            messageBox.CancelText = cancelText;
            messageBox.YesText = yesText;
            messageBox.NoText = noText;
            messageBox.Target = target;

            return messageBox.GetShowReference();
        }

        #endregion
    }

    /// <summary>
    /// 消息框按钮类别
    /// </summary>
    internal static class MessageBoxButtonsHelper
    {
        public static string GetName(MessageBoxButtons type)
        {
            string result = string.Empty;

            switch (type)
            {
                case MessageBoxButtons.CANCEL:
                    result = "Ext.MessageBox.CANCEL";
                    break;
                case MessageBoxButtons.NO:
                    result = "Ext.MessageBox.NO";
                    break;
                case MessageBoxButtons.OK:
                    result = "Ext.MessageBox.OK";
                    break;
                case MessageBoxButtons.OKCANCEL:
                    result = "Ext.MessageBox.OKCANCEL";
                    break;
                case MessageBoxButtons.YES:
                    result = "Ext.MessageBox.YES";
                    break;
                case MessageBoxButtons.YESNO:
                    result = "Ext.MessageBox.YESNO";
                    break;
                case MessageBoxButtons.YESNOCANCEL:
                    result = "Ext.MessageBox.YESNOCANCEL";
                    break;
            }

            return result;
        }

        public static string GetShortName(MessageBoxButtons type)
        {
            string result = string.Empty;

            switch (type)
            {
                case MessageBoxButtons.CANCEL:
                    result = "_cancel";
                    break;
                case MessageBoxButtons.NO:
                    result = "_no";
                    break;
                case MessageBoxButtons.OK:
                    result = "_ok";
                    break;
                case MessageBoxButtons.OKCANCEL:
                    result = "_ok_cancel";
                    break;
                case MessageBoxButtons.YES:
                    result = "_yes";
                    break;
                case MessageBoxButtons.YESNO:
                    result = "_yes_no";
                    break;
                case MessageBoxButtons.YESNOCANCEL:
                    result = "_yes_no_cancel";
                    break;
            }

            return result;
        }
    }

    public enum MessageBoxButtons
    {
        /**
         * @property
         * Button config that displays a single OK button
         */
        OK = 1,
        /**
         * @property
         * Button config that displays a single Yes button
         */
        YES = 2,
        /**
         * @property
         * Button config that displays a single No button
         */
        NO = 4,
        /**
         * @property
         * Button config that displays a single Cancel button
         */
        CANCEL = 8,
        /**
         * @property
         * Button config that displays OK and Cancel buttons
         */
        OKCANCEL = 9,
        /**
         * @property
         * Button config that displays Yes and No buttons
         */
        YESNO = 6,
        /**
         * @property
         * Button config that displays Yes, No and Cancel buttons
         */
        YESNOCANCEL = 14,
    }
}
