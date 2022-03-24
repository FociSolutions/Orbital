using Xunit;
using Xunit.Abstractions;
using System;
using System.IO;
using System.Reflection;
using Orbital.Mock.Server.Services;
using NSubstitute.ExceptionExtensions;

namespace Orbital.Mock.Server.Tests.Services
{
    public class FileSystemServiceTests
    {
        private readonly ITestOutputHelper output;
        private readonly string ROOT_DIR = Path.Combine(".", "fixtures");
        private const string TARGET_DIR = "file_system_service_test";
        private const string FILE_EXTENSION = ".txt";
        private const string ROOT_FILE_NAME = "fileRoot";
        private const string PATH_TO_FILE = @"Dir1\Dir1.1\file1.1.txt";
        private const string PATH_TO_FILE_LOCATION = @"Dir3\Dir3.1\Dir3.1.1";
        private const string MOCK_DEF_PATH = @"directory_import_test\mock_definition_2.json";
        

        public FileSystemServiceTests(ITestOutputHelper output)
        {
            this.output = output;
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
        [InlineData(ROOT_FILE_NAME + FILE_EXTENSION)]
        [InlineData(PATH_TO_FILE)]
        [InlineData(PATH_TO_FILE_LOCATION + @"\file3.1.1.txt")]
        public void DoesFileExist_ReturnsTrueForSuccess(string fileName)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            var path = Path.Combine(ROOT_DIR, TARGET_DIR, fileName);
            #endregion

            output.WriteLine(path);
            var expected = fileSysService.FileExists(path);
            Assert.True(expected);
        }


        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("fileDoesNotExist.txt")]
        [InlineData("fileReallyDoesNotExist.json")]
        [InlineData(ROOT_FILE_NAME + "json")]
        public void FileDoesNotExistOrEmptyInput_ReturnsFalseForFail(string fileName)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            var path = Path.Combine(ROOT_DIR, TARGET_DIR);
            #endregion

            output.WriteLine(path);
            var expectedFail = fileSysService.FileExists($"{path}{fileName}");
            Assert.False(expectedFail);
        }


        [Theory]
        [InlineData(TARGET_DIR)]
        [InlineData(TARGET_DIR + @"\" + PATH_TO_FILE_LOCATION)]
        [InlineData(TARGET_DIR + @"\DeleteDir")]
        public void DoesDirectoryExist_ReturnsTrueForSuccess(string directory)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            var path = Path.Combine(ROOT_DIR, directory);
            #endregion

            output.WriteLine(path);
            var expected = fileSysService.DirectoryExists(path);
            Assert.True(expected); 
        }


        /// <summary>
        /// FROM MS Docs:
        /// Trailing spaces are removed from the end of the path parameter before
        /// checking whether the directory exists.
        /// https://docs.microsoft.com/en-us/dotnet/api/system.io.directory.exists?view=net-6.0
        /// </summary>
        [Theory]
        [InlineData("ImADirectoryThatDoesNotExist")]
        public void NoDirectoryExist_ReturnsFalseForFail(string directory)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            var path = Path.Combine(ROOT_DIR, directory);
            #endregion

            var expectedFail = fileSysService.DirectoryExists(path);           
            Assert.False(expectedFail);
        }


        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("       ")]
        [InlineData("*<>?\"'/\\[]{}:;|")]
        [InlineData("*  <> ?\"' / \\ [ ] : ; |        ")]
        [InlineData("* <> \"' / \\ [ ] : ; | \\filePath       ")]
        public void CheckGuardClause_ReturnsTrueForInvalidInputs(string invalidPath)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            #endregion

            var expected = fileSysService.IsInvalidPath(invalidPath);
            Assert.True(expected);
        }

        
        [Theory]
        [InlineData(TARGET_DIR + @"\" + PATH_TO_FILE)]
        [InlineData(@"\" + MOCK_DEF_PATH)]
        public void CheckGuardClause_ReturnsFalseForValidInputs(string givenPath)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            var path = Path.Combine(ROOT_DIR, givenPath);
            #endregion

            output.WriteLine(path);
            var expectedFail = fileSysService.IsInvalidPath(path);
            Assert.False(expectedFail);
        }

        [Fact]
        public void DeletingDirectory_ReturnsTrueForSuccess()
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            var path = CreateTempDirectoryName();
            var dirToDelete = CreateTempDirectory(path);
            #endregion

            output.WriteLine(path);
            var expected = fileSysService.DeleteDirectory(dirToDelete.FullName, true);
            
            Assert.False(dirToDelete.Exists);
            Assert.True(expected);
        }

        
        [Theory]
        [InlineData("ImADirectoryThatDoesNotExist", false)]
        public void DeletingDirectory_ThrowsException(string dirPath, bool flag)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            var path = Path.Combine(ROOT_DIR, dirPath);
            #endregion

            output.WriteLine(path);
            Assert.Throws<DirectoryNotFoundException>(() => fileSysService.DeleteDirectory(path, flag));
        }


        [Fact]
        public void CreateDirectory_ReturnsTrueForSuccess()
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            var path = CreateTempDirectoryName(); 
            #endregion

            output.WriteLine(path);
            var newDir = fileSysService.CreateDirectory(path);

            Assert.True(newDir.Exists);
        }


        [Theory]
        [InlineData("")]
        [InlineData("       ")]
        [InlineData("*<>?\"'/\\[]{}:;|")]
        [InlineData("*  <> ?\"' / \\ [ ] : ; |        ")]
        [InlineData("* <> \"' / \\ [ ] : ; | \\filePath       ")]
        public void CreateDirectory_ThrowsException(string path)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            #endregion

            output.WriteLine(path);
            Assert.Throws<IOException>(() => fileSysService.CreateDirectory(path));

        }
    }
}
