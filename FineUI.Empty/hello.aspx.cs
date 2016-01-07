using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using FineUI;

namespace EmptyProjectNet20
{
    public partial class hello : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btnHello_Click(object sender, EventArgs e)
        {
            MessageBox.Show("你好", icon: MessageBoxIcon.Error, buttons: MessageBoxButtons.YESNOCANCEL, yesText: "as", yesScript: "alert('haha')");
            //Notify.Show("你好!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", "test", NotifyIcon.Error, Target.Self);
        }

    }
}
