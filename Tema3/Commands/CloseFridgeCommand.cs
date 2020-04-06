
using System;

namespace ChatbotAPI
{
    public class CloseFridgeCommand : ICommand
    {

        ResponseModel ICommand.Execute()
        {
            var db = new Database();
            var model = db.ReadJson();
            model.fridgeOpen = false;
            db.Update(model);
            return model;
        }
    }
}