using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Orbital.Mock.Server.Tests.Services
{
    internal class FileSystemServiceData
    {
        private static readonly string ROOT_DIR = Path.Combine(".", "fixtures", "file_system_service_test");

        private const string FILE_EXTENSION = "txt";
        private const string ROOT_FILE_NAME = "fileRoot";
        private static readonly string PATH_TO_FILE = Path.Combine("Dir1", "Dir1.1", "file1.1.txt");
        private static readonly string PATH_TO_FILE_LOCATION = Path.Combine("Dir3", "Dir3.1", "Dir3.1.1");
        private static readonly string MOCK_DEF_PATH = Path.Combine(".", "fixtures", "directory_import_test");

        public static IEnumerable<object[]> ExistingFilePaths =>
            new List<object[]>
            {
                new object[] { Path.Combine(ROOT_DIR, $"{ROOT_FILE_NAME}.{FILE_EXTENSION}") },
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE) },
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE_LOCATION, "file3.1.1.txt") }
            };

        public static IEnumerable<object[]> InvalidFilePaths =>
            new List<object[]>
            {
                new object[] { Path.Combine(ROOT_DIR, "") },
                new object[] { Path.Combine(ROOT_DIR, "fileDoesNotExist.txt") },
                new object[] { Path.Combine(ROOT_DIR, "fileReallyDoesNotExist.json") },
                new object[] { Path.Combine(ROOT_DIR, $"{ROOT_FILE_NAME}.json") }
            };

        public static IEnumerable<object[]> ExistingDirectoryPaths =>
            new List<object[]>
            {
                new object[] { Path.Combine(ROOT_DIR) },
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE_LOCATION) },
                new object[] { Path.Combine(ROOT_DIR, "DeleteDir") },
                new object[] { MOCK_DEF_PATH}
            };

        public static IEnumerable<object[]> InvalidDirectories =>
           new List<object[]>
           {
                new object[] { Path.Combine(ROOT_DIR, "ImADirectoryThatDoesNotExist") },
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE_LOCATION, "Dir3.1.2") }
           };

        public static IEnumerable<object[]> InvalidCharPaths =>
           new List<object[]>
           {
                new object[] { null },
                new object[] { "" },
                new object[] { "     " },
                new object[] { "*<>?\"'/\\[]{}:;|" },
                new object[] { "*  <> ?\"' / \\ [ ] : ; |  \\filepath      " }
           };

        public static IEnumerable<object[]> ExistingDirectoryPathsAndPatterns =>
            new List<object[]>
            {
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE_LOCATION), null },
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE_LOCATION), "" },
                new object[] { Path.Combine(ROOT_DIR, "DeleteDir"), $".{FILE_EXTENSION}" }
            };

        public static IEnumerable<object[]> InvalidDirectoryPathsAndPatterns =>
            new List<object[]>
            {
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE_LOCATION), ".json" },
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE_LOCATION), "#($_<>)" }
            };

        public static IEnumerable<object[]> ExistingDirectoryPathsAndSearch =>
            new List<object[]>
            {
                new object[] { Path.Combine(ROOT_DIR), null, true },
                new object[] { Path.Combine(ROOT_DIR), "*.txt", false },
                new object[] { Path.Combine(ROOT_DIR), "*.txt", true }
            };

        public static IEnumerable<object[]> InvalidDirectoryPathsAndSearch =>
            new List<object[]>
            {
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE_LOCATION), ".json", true },
                new object[] { Path.Combine(ROOT_DIR, PATH_TO_FILE_LOCATION), "#($_<>)", false }
            };
    }
}
