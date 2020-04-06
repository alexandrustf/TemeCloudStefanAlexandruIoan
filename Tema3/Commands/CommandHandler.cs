using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatbotAPI.Commands;

namespace ChatbotAPI
{
    public static class CommandHandler
    {
        public static ICommand GetCommand(string command)
        {
            command = command.ToLower();
            if (command.Contains("open"))
            {
                if (command.Contains("fridge"))
                {
                    return new OpenFridgeCommand();
                }
                if (command.Contains("tv"))
                {
                    return new OpenTvCommand();
                }
                if (command.Contains("light"))
                {
                    return new OpenLightsCommand();
                }
                if (command.Contains("door"))
                {
                    return new OpenDoorCommand();
                }
            }
            if (command.Contains("close"))
            {
                if (command.Contains("fridge"))
                {
                    return new CloseFridgeCommand();
                }
                if (command.Contains("tv"))
                {
                    return new CloseTvCommand();
                }
                if (command.Contains("light"))
                {
                    return new CloseLightsCommand();
                }
                if (command.Contains("door"))
                {
                    return new CloseDoorCommand();
                }
            }

            return new WrongCommand();
        }
    }
}
