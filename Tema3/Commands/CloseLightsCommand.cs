namespace ChatbotAPI.Commands
{
    public class CloseLightsCommand : ICommand
    {
        public ResponseModel Execute()
        {
            var db = new Database();
            var model = db.ReadJson();
            model.lightsOpen = false;
            db.Update(model);
            return model;
        }
    }
}