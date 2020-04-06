using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Google.Cloud.Storage.V1;
using Newtonsoft.Json;

namespace ChatbotAPI
{
    public class WrongCommand : ICommand
    {
        public ResponseModel Execute()
        {
            var db = new Database();
            return db.ReadJson();
        }

        
    }


}
