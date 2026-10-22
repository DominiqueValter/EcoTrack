namespace EcoTrack.Application.Interfaces;

public interface IDropboxService
{
    Task<(string path, string? fileId)> UploadFileAsync(Stream fileStream, string fileName, string folderPath);
    Task<bool> DeleteFileAsync(string dropboxPath);
}