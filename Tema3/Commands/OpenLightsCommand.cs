namespace ChatbotAPI.Commands
{
    public class OpenLightsCommand : ICommand
    {
        public ResponseModel Execute()
        {
            var db = new Database();
            var model = db.ReadJson();
            model.lightsOpen = true;
            db.Update(model);
            return model;
        }
    }
}