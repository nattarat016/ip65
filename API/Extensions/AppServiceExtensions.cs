using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Middleware;
using API.Services;
using API.SignalR;
using Microsoft.EntityFrameworkCore;


namespace API.Extensions;

public static class AppServiceExtensions
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration conf)
    {
        services.AddDbContext<DataContext>(opt =>
            {
                // opt.UseSqlite(conf.GetConnectionString("DefaultConnection"));
                opt.UseNpgsql(conf.GetConnectionString("PostgessConnection"));
            });

        services.AddCors();

        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySettings>(conf.GetSection("CloudinarySettings"));
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<LogUserActivity>();
        services.AddScoped<IlikesRepository, LikesRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddSignalR();
        services.AddSingleton<PresenceTracker>();
        // services.AddSingleton<ExceptionMiddleware>();

        return services;
    }

}
