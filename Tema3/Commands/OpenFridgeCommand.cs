using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatbotAPI
{
    public class OpenFridgeCommand : ICommand
    {
        ResponseModel ICommand.Execute()
        {
            var db = new Database();
            var model = db.ReadJson();
            model.fridgeOpen = true;
            db.Update(model);
            return model;
        }
    }
}
