using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

namespace FineUI
{
    public static class Notify
    {
        public static void Show(string message, string title = null, 
            NotifyType type = NotifyType.Info,
            Target target = Target.Top)
        {
            PageContext.RegisterStartupScript(GetShowReference(message, title, type, target));
        }

        public static string GetShowReference(string message, string title = null,
            NotifyType type = NotifyType.Info,
            Target target = Target.Top)
        {
            StringBuilder script = new StringBuilder();
            script.Append("F.notify(");

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

            // icon
            script.Append(string.Format("'{0}'", NotifyTypeHelper.GetName(type)));

            script.Append(");");

            return script.ToString();
        }
    }

    public enum NotifyType
    {
        Error,

        Success,

        Info,

        Warn,
    }

    internal static class NotifyTypeHelper
    {
        public static string GetName(NotifyType type)
        {
            string result = String.Empty;

            switch (type)
            {
                case NotifyType.Error:
                    result = "error";
                    break;
                case NotifyType.Success:
                    result = "success";
                    break;
                case NotifyType.Info:
                    result = "info";
                    break;
                case NotifyType.Warn:
                    result = "warn";
                    break;
            }

            return result;
        }
    }
}