using Xunit;
using Xunit.Abstractions;
using System;
using System.IO;
using Orbital.Mock.Server.Services;

namespace Orbital.Mock.Server.Tests.Services
{
    public class FileSystemServiceTests
    {
        
        private readonly string ROOT_DIR = Path.Combine(".", "fixtures");
        private const string TARGET_DIR = "file_system_service_test";
        private const string FILE_EXTENSION = ".txt";
        private const string FILE_NAME = "fileRoot";
        private readonly ITestOutputHelper output;


        public FileSystemServiceTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        public FileSystemService BuildFileSystemService()
        {
            return new FileSystemService();
        }


        [Theory]
        [InlineData(FILE_NAME + FILE_EXTENSION)]
        public void DoesFileExist_ReturnsTrue(string fileName)
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
        public void FileDoesNotExistorEmptyInput_ReturnsFalse(string fileName)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            var path = Path.Combine(ROOT_DIR, TARGET_DIR);
            #endregion


            output.WriteLine(path);
            var expected = fileSysService.FileExists($"{path}{fileName}");
            Assert.False(expected);
        }


        [Theory]
        [InlineData(TARGET_DIR)]
        public void DoesDirectoryExist_ReturnsTrue(string directory)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            #endregion

            var expected = fileSysService.DirectoryExists($"{ROOT_DIR}\\{directory}");
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
        public void NoDirectoryExist_ReturnsFalse(string directory)
        {
            #region Test Setup
            var fileSysService = BuildFileSystemService();
            #endregion

            var expectedFail = fileSysService.DirectoryExists($"{ROOT_DIR}\\{directory}");           
            Assert.False(expectedFail);

        }

    }
}
