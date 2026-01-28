using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api_for_code.Services;
namespace api_for_code.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ControllerOne : ControllerBase
    {
        [HttpGet("cpu")]
        public IActionResult GetCpuMove()
        {
            var cpuMove = ServiceOne.GetCpuMove();
            return Ok(new { cpuMove });
        }

        [HttpGet("cpu-simulate")]
        public IActionResult CpuSimulateRound()
        {
            var result = ServiceOne.PlayCpuVsRandomPlayer();
            return Ok(result);
        }
    }
}