namespace ChatbotAPI.Commands
{
    public class OpenDoorCommand : ICommand
    {
        public ResponseModel Execute()
        {
            var db = new Database();
            var model = db.ReadJson();
            model.doorOpen = true;
            db.Update(model);
            return model;
        }
    }
}