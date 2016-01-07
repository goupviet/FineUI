using System;

namespace FineUI
{
    /// <summary>
    /// 表格分组事件参数
    /// </summary>
    public class GridGroupEventArgs : EventArgs
    {
        /// <summary>
        /// 分组内容
        /// </summary>
        public string Group { get; set; }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="group">分组内容</param>
        public GridGroupEventArgs(string group)
        {
            Group = group;
        }

    }
}



