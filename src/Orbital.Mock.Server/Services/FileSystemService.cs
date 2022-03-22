﻿using System;
using Serilog;
using System.IO;
using System.Collections.Generic;
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

        public bool DeleteDirectory(string path, bool recurse = false)
        {
            if (!IsValidPath(path)) { throw new DirectoryNotFoundException(
                $"Unable to locate DIR: {path}"); }

            try
            {
                Directory.Delete(path, recurse);
                return true;
            }
            catch (Exception e)
            {
                Log.Error(e, "Failed to delete directory from PATH: {Path}", path);
                return false;
            }
        }

        public FileInfo GetFileInfo(string path)
        {
            if (!IsValidPath(path)) { throw new FileNotFoundException(
                $"No file found at PATH: {path}"); }

            return new FileInfo(path);
        }

        public DirectoryInfo GetDirectoryInfo(string path)
        {
            if (!IsValidPath(path)) { throw new DirectoryNotFoundException(
                $"Unable to locate DIR: {path}"); }

            return new DirectoryInfo(path);
        }

        public DirectoryInfo CreateDirectory(string path)
        {
            if (!IsValidPath(path)) { throw new IOException(
                $"Unable to create directory at PATH: {path}"); }

            return Directory.CreateDirectory(path);
        }

        public IEnumerable<string> GetDirectoryFiles(string path)
        {
            if (!DirectoryExists(path)) throw new DirectoryNotFoundException(
                $"Unable to locate DIR: {path}");

            return Directory.GetFiles(path);
        }

        public IEnumerable<string> GetDirectoryFiles(string path, string? searchPattern = null)
        {
            if (!DirectoryExists(path)) throw new DirectoryNotFoundException(
                $"Unable to locate DIR: {path}");

            return Directory.GetFiles(path, searchPattern ?? "*");
        }

        public IEnumerable<string> GetDirectoryFiles(string path, string? searchPattern = null,
            bool includesubDirectories = false)
        {
            if (!DirectoryExists(path)) throw new DirectoryNotFoundException(
                $"Unable to locate DIR: {path}");

            return Directory.GetFiles(path, searchPattern ?? "*", 
                includesubDirectories ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly);
        }
    }
}
