namespace ChatbotAPI.Commands
{
    public class CloseTvCommand : ICommand
    {
        public ResponseModel Execute()
        {
            var db = new Database();
            var model = db.ReadJson();
            model.tvOpen = false;
            db.Update(model);
            return model;
        }
    }
}