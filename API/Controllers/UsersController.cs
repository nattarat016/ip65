using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// [Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    //snipper: ctor
    //inject DataContext
    public UsersController(IUserRepository userRepository, IMapper mapper)
    {
        //putting cursor inside dataContext (ctor parameter) `ctrl+.` then select `create and assign feild`
        _userRepository = userRepository;
        _mapper = mapper;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        // var users = await _userRepository.GetUsersAsync();
        // return Ok(_mapper.Map<IEnumerable<MemberDto>>(users));
        return Ok(await _userRepository.GetMembersAsync());
    }

    [HttpGet("{id}")] //endpoint: /api/users/25         ,when id = 25
    public async Task<ActionResult<MemberDto?>> GetUser(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        return _mapper.Map<MemberDto>(user);
    }
    // public async Task<ActionResult<MemberDto?>> GetUser(int id)
    // {
    //     return await _userRepository.GetUserByIdAsync(id);
    // }
    // public async Task<ActionResult<MemberDto?>> GetUser(int id)
    // {
    //     return await _userRepository.GetUserByIdAsync(id);
    // }

    [HttpGet("username/{username}")]
    public async Task<ActionResult<MemberDto?>> GetUserByUserName(string username)
    {
        // var user = await _userRepository.GetUserByUserNameAsync(username);
        // return _mapper.Map<MemberDto>(user);
        return await _userRepository.GetMemberAsync(username);
    }

}