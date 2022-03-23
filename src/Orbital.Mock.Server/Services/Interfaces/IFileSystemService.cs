using System.IO;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Services.Interfaces
{
    public interface IFileSystemService
    {
        
        /// <summary>
        /// Checks if the file exists for a given path.
        /// </summary>
        /// <param name="path">Input file path</param>
        /// <returns>true if filename matches, false if invalid name match</returns>
        bool FileExists(string path);

        /// <summary>
        /// Checks if the directory exists for a given path.
        /// </summary>
        /// <param name="path">Input directory path</param>
        /// <returns>true if the directory name matches, false if invalid name match</returns>
        bool DirectoryExists(string path);

        /// <summary>
        /// Ensures the string path given is valid for future method executions
        /// Contains built-in executions of string validators.
        /// </summary>
        /// <param name="path">Input path</param>
        /// <returns>true if valid useable path or false if invalid</returns>
        bool IsInvalidPath(string path);

        /// <summary>
        /// Deletes a directory for a given path.
        /// </summary>
        /// <param name="path">Input destination to directory path</param>
        /// <param name="recurse">Flag that checks if method should also delete subdirectories/files 
        /// within the specificed directory</param>
        /// <returns>true if directory was deleted successfully, false if unsuccessful</returns>
        bool DeleteDirectory(string path, bool recurse);

        /// <summary>
        /// Creates a default FileInfo object, 
        /// corresponding to methods within the System.IO.FileInfo class.
        /// </summary>
        /// <param name="path">Input file path</param>
        /// <returns>A FileInfo object with default methods</returns>
        FileInfo GetFileInfo(string path);

        /// <summary>
        /// Creates a default DirectoryInfo object, 
        /// corresponding to methods within the System.IO.Directory class.
        /// </summary>
        /// <param name="path">Input directory path</param>
        /// <returns>A DirectoryInfo object with default methods</returns>
        DirectoryInfo GetDirectoryInfo(string path);

        /// <summary>
        /// Creates a Directory at the specified path.
        /// </summary>
        /// <param name="path">Input destination path</param>
        /// <returns>DirectoryInfo object of the newly created directory</returns>
        DirectoryInfo CreateDirectory(string path);

        /// <summary>
        /// Returns file names (including their paths) for the specified path
        /// </summary>
        /// <param name="path">Input file path</param>
        /// <returns>Iterable object of string filepaths</returns>
        IEnumerable<string> GetDirectoryFiles(string path);

        /// <summary>
        /// Returns file names (including their paths) for the specified path 
        /// that match the specified search pattern in the specified directory.
        /// </summary>
        /// <param name="path">Input file path</param>
        /// <param name="searchPattern">String pattern as a file search filter</param>
        /// <returns>Iterable object of string filepaths</returns>
        IEnumerable<string> GetDirectoryFiles(string path, string searchPattern);
        
        /// <summary>
        /// Returns file names (including their paths) that match the specified search
        /// pattern in the specified directory. Includes a flag whether to search the current directory, 
        /// or the current directory and all subdirectories.
        /// </summary>
        /// <param name="path">Input file path</param>
        /// <param name="searchPattern">String pattern as a file search filter</param>
        /// <param name="includesubDirectories">Performs retrieval on subdirectories/files in selected directory</param>
        /// <returns>Iterable object of string filepaths</returns>
        IEnumerable<string> GetDirectoryFiles(string path, string searchPattern, bool includesubDirectories);
    }
}
