using Xunit;
using Xunit.Abstractions;
using System.IO;
using Orbital.Mock.Server.Services;
using Orbital.Mock.Server.Services.Interfaces;

namespace Orbital.Mock.Server.Tests.Services
{
    public class FileSystemServiceTests
    {
        private readonly ITestOutputHelper output;
        private readonly IFileSystemService fss;

        
        public FileSystemServiceTests(ITestOutputHelper output)
        {
            this.output = output;
            fss = BuildFileSystemService();
        }


        static FileSystemService BuildFileSystemService()
        {
            return new FileSystemService();
        }


        static string CreateTempDirectoryName()
        {
            var tempFile = Path.GetTempFileName();
            var tempName = Path.GetFileNameWithoutExtension(tempFile);

            return Path.Combine(Path.GetTempPath(), tempName);
        }


        static DirectoryInfo CreateTempDirectory(string dirName)
        {
            return Directory.CreateDirectory(dirName);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.ExistingFilePaths), 
            MemberType = typeof(FileSystemServiceData))]
        public void DoesFileExist_ReturnsTrueForSuccess(string filePath)
        {
            var expectedTrue = fss.FileExists(filePath);
            Assert.True(expectedTrue);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidFilePaths), 
            MemberType = typeof(FileSystemServiceData))]
        public void FileDoesNotExistOrEmptyInput_ReturnsFalseForFail(string filePath)
        {
            var expectedFalse = fss.FileExists(filePath);
            Assert.False(expectedFalse);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.ExistingDirectoryPaths), 
            MemberType = typeof(FileSystemServiceData))]
        public void DoesDirectoryExist_ReturnsTrueForSuccess(string directory)
        {
            var expectedTrue = fss.DirectoryExists(directory);
            Assert.True(expectedTrue); 
        }


        /// <summary>
        /// FROM MS Docs:
        /// Trailing spaces are removed from the end of the path parameter before
        /// checking whether the directory exists.
        /// https://docs.microsoft.com/en-us/dotnet/api/system.io.directory.exists?view=net-6.0
        /// </summary>
        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidDirectories),
            MemberType = typeof(FileSystemServiceData))]
        public void NoDirectoryExist_ReturnsFalseForFail(string directory)
        {
            var expectedFalse = fss.DirectoryExists(directory);            
            Assert.False(expectedFalse);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidCharPaths),
            MemberType = typeof(FileSystemServiceData))]
        public void CheckGuardClause_ReturnsTrueForInvalidInputs(string invalidPath)
        {
            var expectedTrue = fss.IsInvalidPath(invalidPath);
            Assert.True(expectedTrue);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidFilePaths),
            MemberType = typeof(FileSystemServiceData))]
        public void CheckGuardClause_ReturnsFalseForValidInputs(string path)
        {
            var expectedFail = fss.IsInvalidPath(path);
            Assert.False(expectedFail);
        }


        [Fact]
        public void DeletingDirectory_ReturnsTrueForSuccess()
        {
            #region Test Setup
            var path = CreateTempDirectoryName();
            var dirToDelete = CreateTempDirectory(path);
            #endregion
            
            var isDeleted = fss.DeleteDirectory(dirToDelete.FullName, true);

            Assert.False(dirToDelete.Exists);
            Assert.True(isDeleted);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidDirectories),
            MemberType = typeof(FileSystemServiceData))]
        public void DeletingDirectory_ThrowsException(string dirPath)
        {
            Assert.Throws<DirectoryNotFoundException>(
                () => fss.DeleteDirectory(dirPath, false));
        }


        [Fact]
        public void CreateDirectory_ReturnsTrueForSuccess()
        {
            #region Test Setup
            var path = CreateTempDirectoryName();
            #endregion

            var newDir = fss.CreateDirectory(path);
            Assert.True(newDir.Exists);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidCharPaths),
            MemberType = typeof(FileSystemServiceData))]
        public void CreateDirectory_ThrowsException(string path)
        {
            Assert.Throws<IOException>(() => fss.CreateDirectory(path));
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.ExistingFilePaths),
            MemberType = typeof(FileSystemServiceData))]
        public void GetFile_ReturnsTrueforExistingFile(string filePath)
        {
            var returnedFileObj = fss.GetFileInfo(filePath);
            Assert.True(returnedFileObj.Exists);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidFilePaths),
            MemberType = typeof(FileSystemServiceData))]
        public void GetFile_ReturnsFalseAsNoFile(string filePath)
        {
            var returnedFileObj = fss.GetFileInfo(filePath);
            Assert.False(returnedFileObj.Exists);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.ExistingDirectoryPaths),
            MemberType = typeof(FileSystemServiceData))]
        public void GetDirectory_ReturnsTrueforExistingDirectory(string directory)
        {
            var returnedDirObj = fss.GetDirectoryInfo(directory);
            Assert.True(returnedDirObj.Exists);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidDirectories),
            MemberType = typeof(FileSystemServiceData))]
        public void GetDirectory_ThrowsNotFoundException(string directory)
        {
            Assert.Throws<DirectoryNotFoundException>(
                () => fss.GetDirectoryInfo(directory));
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.ExistingDirectoryPaths),
            MemberType = typeof(FileSystemServiceData))]
        public void GetDirectoryFiles_ReturnsWithListFiles(string directory)
        {
            var returnedFiles = fss.GetDirectoryFiles(directory);
            Assert.NotNull(returnedFiles);

            foreach (string singleFile in returnedFiles)
            {
                if (singleFile.Contains("json"))
                {
                    Assert.Contains("json", singleFile);
                }
                else
                {
                    Assert.Contains("txt", singleFile);
                }
            }
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidDirectories),
            MemberType = typeof(FileSystemServiceData))]
        public void GetDirectoryFiles_ReturnsNoListOfFiles(string directory)
        {
            Assert.Throws<DirectoryNotFoundException>(
                () => fss.GetDirectoryFiles(directory));
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.ExistingDirectoryPathsAndPatterns),
            MemberType = typeof(FileSystemServiceData))]
        public void GetDirectoryFilesWithPattern_ReturnsListofFiles(string directory, string pattern)
        {
            var returnedFiles = fss.GetDirectoryFiles(directory, pattern);
            Assert.NotNull(returnedFiles);

            foreach (string singleFile in returnedFiles)
            {
                Assert.Contains(".txt", singleFile);
            }
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidDirectoryPathsAndPatterns),
            MemberType = typeof(FileSystemServiceData))]
        public void GetDirectoryFilesWithPattern_ReturnsNoListOfFiles(string directory, string pattern)
        {
            var returnedFiles = fss.GetDirectoryFiles(directory, pattern);
            Assert.Empty(returnedFiles);
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.ExistingDirectoryPathsAndSearch),
            MemberType = typeof(FileSystemServiceData))]
        public void GetDirectoryFilesWithSearchOptions_ReturnsListofFiles(
            string directory, string pattern, bool includeSubDir)
        {
            var returnedFiles = fss.GetDirectoryFiles(directory, pattern, includeSubDir);
            Assert.NotNull(returnedFiles);

            foreach (string singleFile in returnedFiles)
            {
                Assert.Contains(".txt", singleFile);
            }
        }


        [Theory]
        [MemberData(nameof(FileSystemServiceData.InvalidDirectoryPathsAndSearch),
            MemberType = typeof(FileSystemServiceData))]
        public void GetDirectoryFilesWithSearchOptions_ReturnsNoListOfFiles(
            string directory, string pattern, bool includeSubDir)
        {
            var returnedFiles = fss.GetDirectoryFiles(directory, pattern, includeSubDir);
            Assert.Empty(returnedFiles);
        }

    }
}
