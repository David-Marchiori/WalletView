namespace WalletView.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
public abstract class AuthenticatedControllerBase : ControllerBase
{
    protected int GetUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return int.Parse(userIdClaim!.Value);
    }
}