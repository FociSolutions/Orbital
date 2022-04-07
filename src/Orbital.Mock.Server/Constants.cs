namespace Orbital.Mock.Server
{
    public static class Constants
    {
        public const string ADMIN_ENDPOINT_URL = "/api/v1/OrbitalAdmin";

        /// <summary>
        /// The key used to index the MockDefinition cache
        /// </summary>
        public const string MOCK_IDS_CACHE_KEY = "mockIds";

        /// <summary>
        /// When loading environment variables, only ones with this prefix will be loaded
        /// </summary>
        public const string ENV_PREFIX = "ORBITAL_";

        /// <summary>
        /// The configuration section name for PublicKeyServiceConfig options to be loaded from
        /// </summary>
        public const string PUB_KEY_SVC_SECTION_NAME = "PUB_KEYS";

        /// <summary>
        /// The configuration section name for MockDefinitionImportServiceConfig options to be loaded from
        /// </summary>
        public const string MOCK_DEF_IMPORT_SVC_SECTION_NAME = "IMPORT_SVC";
    }
}
