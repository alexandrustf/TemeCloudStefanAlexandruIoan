using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace ChatbotAPI
{
    public interface ICommand
    {
        ResponseModel Execute();
    }
}