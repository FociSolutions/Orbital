using System;
using System.IO;

using Microsoft.Extensions.Options;
using Orbital.Mock.Server.Services.Interfaces;

namespace Orbital.Mock.Server.Services
{

    public class FileSystemService : IFileSystemService
    {

        
        public bool FileExists(string path)
        {
            return File.Exists(path);
        }

        public bool DirectoryExists(string path)
        {
            return Directory.Exists(path);
        }

        public bool IsValidPath(string path)
        {
            if (string.IsNullOrWhiteSpace(path)
                || !FileExists(path)
                || !DirectoryExists(path)) return false;

            return true;
        }

        public FileInfo GetFileInfo(string path) 
        {
            if (!IsValidPath(path)) throw new FileNotFoundException(path);

            return new FileInfo(path);
        }

        public DirectoryInfo GetDirectoryInfo(string path) 
        {
            if (!IsValidPath(path)) throw new DirectoryNotFoundException(path);

            return new DirectoryInfo(path);
        }

        public bool DeleteDirectory(string path, bool recurse)
        {
            if (!IsValidPath(path)) throw new DirectoryNotFoundException(path);
            if (recurse)
            {
                Directory.Delete(path, true);
                return true;
            }
            else if (!recurse)
            {
                Directory.Delete(path);
                return true;
            }
            return false;
        }
    }
}
