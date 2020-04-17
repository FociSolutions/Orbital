using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class SystemFunctions : ScriptObject
    {
        public static Faker faker;

        public SystemFunctions()
        {
            faker = new Faker();
        }

        /// <summary>
        /// Returns an Android Id.
        /// </summary>
        public static string AndroidId()
        {
            return faker.System.AndroidId();
        }

        /// <summary>
        /// Returns a Apple Push Token.
        /// </summary>
        public static string ApplePushToken()
        {
            return faker.System.ApplePushToken();
        }

        /// <summary>
        /// Returns a BlackBerryPin
        /// </summary>
        public static string BlackBerryPin()
        {
            return faker.System.BlackBerryPin();
        }

        /// <summary>
        /// Returns a Common File Extension
        /// </summary>
        public static string CommonFileExt()
        {
            return faker.System.CommonFileExt();
        }

        /// <summary>
        /// Returns a Common File Name
        /// </summary>
        public static string CommonFileName()
        {
            return faker.System.CommonFileName();
        }

        /// <summary>
        /// Returns a Common File Type.
        /// </summary>
        public static string CommonFileType()
        {
            return faker.System.CommonFileType();
        }

        /// <summary>
        /// Returns a Directory Path
        /// </summary>
        public static string DirectoryPath()
        {
            return faker.System.DirectoryPath();
        }

        /// <summary>
        /// Returns an Exception with a fake stack trace
        /// </summary>
        public static string FullName()
        {
            return faker.System.Exception().ToString();
        }

        /// <summary>
        /// Returns a File Extension for given mime type.
        /// </summary>
        public static string FileExtension()
        {
            return faker.System.FileExt();
        }

        /// <summary>
        /// Returns a File Name.
        /// </summary>
        public static string FileName()
        {
            return faker.System.FileName();
        }

        /// <summary>
        /// Returns a File Path (Unix)
        /// </summary>
        public static string FilePath()
        {
            return faker.System.FilePath();
        }

        /// <summary>
        /// Returns a File Type available as a mime type.
        /// </summary>
        public static string FileType()
        {
            return faker.System.FileType();
        }

        /// <summary>
        /// Returns a Mime Type
        /// </summary>
        public static string MimeType()
        {
            return faker.System.MimeType();
        }

        /// <summary>
        /// Returns a semver version value.
        /// </summary>
        public static string SemVer()
        {
            return faker.System.Semver();
        }

        /// <summary>
        /// Returns a random system.version.
        /// </summary>
        public static string Version()
        {
            return faker.System.Version().ToString();
        }
    }
}
