
#region Comment

/*
 * Project：    FineUI
 * 
 * FileName:    Notify.cs
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
    /// 提示框帮助类（静态类）
    /// </summary>
    public class Notify
    {
        #region public static

        //public static string DefaultTitle = "提示框";

        /// <summary>
        /// 提示框框默认图标
        /// </summary>
        public static NotifyIcon DefaultNotifyIcon = FineUI.NotifyIcon.Info;

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

        private NotifyIcon _notifyIcon = DefaultNotifyIcon;

        /// <summary>
        /// 对话框图标
        /// </summary>
        public NotifyIcon NotifyIcon
        {
            get { return _notifyIcon; }
            set { _notifyIcon = value; }
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
            if (!String.IsNullOrEmpty(Message))
            {
                message = Message;
            }
            if (!String.IsNullOrEmpty(Title))
            {
                title = Title;
            }

            JsObjectBuilder jsOB = new JsObjectBuilder();

            if (Target != Target.Self)
            {
                jsOB.AddProperty("target", TargetHelper.GetName(Target));
            }

            if (NotifyIcon != NotifyIcon.Info)
            {
                jsOB.AddProperty("notifyIcon", NotifyIconHelper.GetName(NotifyIcon));
            }

            if (!String.IsNullOrEmpty(title))
            {
                jsOB.AddProperty("title", title.Replace("\r\n", "\n").Replace("\n", "<br/>"));
            }

            if (!String.IsNullOrEmpty(message))
            {
                jsOB.AddProperty("message", JsHelper.EnquoteWithScriptTag(message.Replace("\r\n", "\n").Replace("\n", "<br/>")), true);
            }

            return String.Format("F.notify({0});", jsOB.ToString());
        }

        #endregion


        #region static Show

        public static void Show(string message, string title = null, NotifyIcon icon = NotifyIcon.Info, Target target = Target.Top)
        {
            PageContext.RegisterStartupScript(GetShowReference(message, title, icon, target));
        }

        #endregion

        #region GetShowReference

        public static string GetShowReference(string message, string title = null, NotifyIcon icon = NotifyIcon.Info, Target target = Target.Top)
        {
            Notify notify = new Notify();
            notify.Message = message;
            notify.Title = title;
            notify.NotifyIcon = icon;
            notify.Target = target;

            return notify.GetShowReference();
        }

        #endregion
    }

    public enum NotifyIcon
    {
        Error,

        Success,

        Info,

        Warn,
    }

    internal static class NotifyIconHelper
    {
        public static string GetName(NotifyIcon icon)
        {
            string result = String.Empty;

            switch (icon)
            {
                case NotifyIcon.Error:
                    result = "error";
                    break;
                case NotifyIcon.Success:
                    result = "success";
                    break;
                case NotifyIcon.Info:
                    result = "info";
                    break;
                case NotifyIcon.Warn:
                    result = "warn";
                    break;
            }

            return result;
        }
    }
}
