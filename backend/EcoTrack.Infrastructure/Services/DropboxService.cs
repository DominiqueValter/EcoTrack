using Dropbox.Api;
using Dropbox.Api.Files;
using EcoTrack.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace EcoTrack.Infrastructure.Services;

public class DropboxService : IDropboxService
{
    private readonly string? _accessToken;

    public DropboxService(IConfiguration configuration)
    {
        _accessToken = configuration["Dropbox:AccessToken"];
    }

    public async Task<(string path, string? fileId)> UploadFileAsync(Stream fileStream, string fileName, string folderPath)
    {
        var targetPath = $"{folderPath}/{fileName}".Replace("//", "/");

        // Se o token do Dropbox não estiver configurado no appsettings.json, simula a gravação com caminho relativo
        if (string.IsNullOrWhiteSpace(_accessToken))
        {
            return (targetPath, $"simulated_id_{Guid.NewGuid()}");
        }

        using var dbx = new DropboxClient(_accessToken);
        var updated = await dbx.Files.UploadAsync(
            targetPath,
            WriteMode.Overwrite.Instance,
            body: fileStream);

        return (updated.PathDisplay, updated.Id);
    }

    public async Task<bool> DeleteFileAsync(string dropboxPath)
    {
        if (string.IsNullOrWhiteSpace(_accessToken))
        {
            return true;
        }

        try
        {
            using var dbx = new DropboxClient(_accessToken);
            await dbx.Files.DeleteV2Async(dropboxPath);
            return true;
        }
        catch
        {
            return false;
        }
    }
}