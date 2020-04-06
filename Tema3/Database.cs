using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Api.Gax;
using Google.Cloud.Datastore.V1;
using Google.Cloud.Storage.V1;
using Newtonsoft.Json;


namespace ChatbotAPI
{
    public  class Database
    {
        const string bucketName = "picturecommandsbucket";
        const string downloadPath = "downloaded.json";
        const string objectName = "MyUtilities";


        internal void Update(ResponseModel response)
        {
            string jsonString = JsonConvert.SerializeObject(response);
            var uploadPath = ".\\Upload\\" + Guid.NewGuid();
            using (FileStream fs = File.OpenWrite(uploadPath))
            {
                fs.Write(Encoding.ASCII.GetBytes(jsonString));
            }
            var storage = StorageClient.Create();
            storage.UploadObject(bucketName, objectName, null, File.OpenRead(uploadPath));
        }


        internal ResponseModel ReadJson()
        {
            var storage = StorageClient.Create();
            File.Delete(downloadPath);
            using (var outputFile = File.OpenWrite(downloadPath))
            {
                storage.DownloadObject(bucketName, objectName, outputFile);
            }
            ResponseModel item;
            using (StreamReader r = new StreamReader(downloadPath))
            {
                string json = r.ReadToEnd();
                item = JsonConvert.DeserializeObject<ResponseModel>(json);
            }
            return item;
        }

    }
}
