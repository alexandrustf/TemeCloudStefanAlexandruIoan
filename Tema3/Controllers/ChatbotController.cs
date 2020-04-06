using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SpeechToText;

namespace ChatbotAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult GetSpeechToText([FromBody] GetModel getModel)
        {
            var bytes = getModel.Bytes;
            var converter = new SpeechConverter();
            // var command = converter.ConvertSpeechToText(bytes);
            var command = " can you close the light please?";
            // return Ok(command);
            var result = CommandHandler.GetCommand(command).Execute();
            // result.BytesResponse = converter.ConvertTextToSpeech(command);
            return Ok(result);
        }

    }
}
