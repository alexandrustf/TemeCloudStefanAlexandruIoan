using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatbotAPI.Commands
{
    public class OpenTvCommand : ICommand
    {
        public ResponseModel Execute()
        {
            var db = new Database();
            var model = db.ReadJson();
            model.tvOpen = true;
            db.Update(model);
            return model;
        }
    }
}
