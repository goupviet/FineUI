using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace FineUI
{
    public enum GridColumnDataType
    {
        Default,

        /// <summary>
        /// booleancolumn
        /// </summary>
        [Description("booleancolumn")]
        Boolean,

        /// <summary>
        /// datecolumn
        /// </summary>
        [Description("datecolumn")]
        Date,

        /// <summary>
        /// numbercolumn
        /// </summary>
        [Description("numbercolumn")]
        Number,
    }

    public class GridColumnDataTypeHelper
    {
        public static string GetName(GridColumnDataType type)
        {
            switch (type)
            {
                case GridColumnDataType.Default:
                    return string.Empty;
                case GridColumnDataType.Boolean:
                    return "booleancolumn";
                case GridColumnDataType.Date:
                    return "datecolumn";
                case GridColumnDataType.Number:
                    return "numbercolumn";
                default:
                    return string.Empty;
            }
        }
    }
}
