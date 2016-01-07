
#region Comment

/*
 * Project：    FineUI
 * 
 * FileName:    MessageBox.cs
 * CreatedOn:   2014-09-20
 * CreatedBy:   bOAT
 * 
 * 
 * Description：
 *      -> 需要更新ext-part2.js文件
 *   
 * History：
 * 
 * 
 * 
 */

#endregion

using System;
using System.Text;

namespace FineUI
{
    /// <summary>
    /// 确认对话框帮助类（静态类）
    /// </summary>
    public static class MessageBox
    {
        /// <summary>
        /// 显示消息框
        /// </summary>
        /// <param name="message"></param>
        /// <param name="title"></param>
        /// <param name="icon"></param>
        /// <param name="buttons"></param>
        /// <param name="target"></param>
        /// <param name="okScript"></param>
        /// <param name="cancelScript"></param>
        /// <param name="yesScript"></param>
        /// <param name="noScript"></param>
        /// <param name="okText"></param>
        /// <param name="cancelText"></param>
        /// <param name="yesText"></param>
        /// <param name="noText"></param>
        public static void Show(string message, string title = null,
            MessageBoxIcon icon = MessageBoxIcon.Information,
            MessageBoxButtons buttons = MessageBoxButtons.OK,
            Target target = Target.Top,
            string okScript = null, string cancelScript = null, string yesScript = null, string noScript = null,
            string okText = null, string cancelText = null, string yesText = null, string noText = null)
        {
            PageContext.RegisterStartupScript(GetShowReference(message, title, icon, buttons, target, okScript, cancelScript, yesScript, noScript, okText, cancelText, yesText, noText));
        }


        /// <summary>
        /// 获取显示对话框的客户端脚本
        /// </summary>
        /// <param name="message"></param>
        /// <param name="title"></param>
        /// <param name="icon"></param>
        /// <param name="buttons"></param>
        /// <param name="target"></param>
        /// <param name="okScript"></param>
        /// <param name="cancelScript"></param>
        /// <param name="yesScript"></param>
        /// <param name="noScript"></param>
        /// <param name="okText"></param>
        /// <param name="cancelText"></param>
        /// <param name="yesText"></param>
        /// <param name="noText"></param>
        /// <returns></returns>
        public static string GetShowReference(string message, string title = null,
            MessageBoxIcon icon = MessageBoxIcon.Information,
            MessageBoxButtons buttons = MessageBoxButtons.OK,
            Target target = Target.Top,
            string okScript = null, string cancelScript = null, string yesScript = null, string noScript = null,
            string okText = null, string cancelText = null, string yesText = null, string noText = null)
        {
            StringBuilder script = new StringBuilder();
            script.Append("F.show(");

            // target
            script.Append(string.Format("'{0}'", TargetHelper.GetName(target)));
            script.Append(",");

            // title
            if (!string.IsNullOrEmpty(title))
            {
                script.Append(JsHelper.Enquote(title.Replace("\r\n", "\n").Replace("\n", "<br/>")));
                script.Append(",");
            }
            else
            {
                script.Append("''");
                script.Append(",");
            }

            // message
            script.Append(JsHelper.EnquoteWithScriptTag(message.Replace("\r\n", "\n").Replace("\n", "<br/>")));
            script.Append(",");

            // buttons
            script.Append(string.Format("'{0}'", MessageBoxButtonsHelper.GetShortName(buttons)));
            script.Append(",");

            // scripts
            script.Append(JsHelper.Enquote(okScript));
            script.Append(",");

            script.Append(JsHelper.Enquote(cancelScript));
            script.Append(",");

            script.Append(JsHelper.Enquote(yesScript));
            script.Append(",");

            script.Append(JsHelper.Enquote(noScript));
            script.Append(",");

            // icon
            script.Append(string.Format("'{0}'", MessageBoxIconHelper.GetShortName(icon)));
            script.Append(",");

            // button text
            if (!string.IsNullOrEmpty(okText))
            {
                script.Append(JsHelper.Enquote(okText));
                script.Append(",");
            }
            else
            {
                script.Append("''");
                script.Append(",");
            }
            if (!string.IsNullOrEmpty(cancelText))
            {
                script.Append(JsHelper.Enquote(cancelText));
                script.Append(",");
            }
            else
            {
                script.Append("''");
                script.Append(",");
            }
            if (!string.IsNullOrEmpty(yesText))
            {
                script.Append(JsHelper.Enquote(yesText));
                script.Append(",");
            }
            else
            {
                script.Append("''");
                script.Append(",");
            }
            // 最后一个对象没有逗号
            script.Append(!string.IsNullOrEmpty(noText) ? JsHelper.Enquote(noText) : "''");

            script.Append(");");

            return script.ToString();
        }
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