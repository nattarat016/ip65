﻿

using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMessageRepository
{
    void AddMessage(Message message);
    void DeleteMessage(Message message);
    Task<Message?> GetMessage(int id);
    Task<PageList<MessageDto>> GetUserMessages(int id);
    Task<PageList<MessageDto>> GetUserMessages(MessageParams messageParams);
    Task<IEnumerable<MessageDto>> GetMessageThread(string thisUserName, string recipientUserName);
    Task<bool> SaveAllAsync();
    void AddGroup(MessageGroup group);
    void RemoveConnection(Connection connection);
    Task<Connection> GetConnection(string connectionId);
    Task<MessageGroup> GetMessageGroup(string groupName);
}
