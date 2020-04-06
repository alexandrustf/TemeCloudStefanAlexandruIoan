namespace ChatbotAPI.Commands
{
    public class CloseDoorCommand : ICommand
    {
        public ResponseModel Execute()
        {
            var db = new Database();
            var model = db.ReadJson();
            model.doorOpen = false;
            db.Update(model);
            return model;
        }
    }
}