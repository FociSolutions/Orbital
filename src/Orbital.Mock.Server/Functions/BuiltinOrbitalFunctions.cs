using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class BuiltinOrbitalFunctions : ScriptObject
    {
        /// <summary>
        /// This object is readonly, should not be modified by any other objects internally.
        /// </summary>
        internal static readonly ScriptObject Default = new DefaultBuiltins();

        public BuiltinOrbitalFunctions() : base(13)
        {
            ((ScriptObject)Default.Clone(true)).CopyTo(this);
        }

        /// <summary>
        /// Use an internal object to create all default builtins just once to avoid allocations of delegates/IScriptCustomFunction
        /// </summary>
        private class DefaultBuiltins : ScriptObject
        {
            public DefaultBuiltins() : base(13, false)
            {
                SetValue("name", new NameFunctions(), true);
                SetValue("address", new AddressFunctions(), true);
                SetValue("database", new DatabaseFunctions(), true);
                SetValue("date", new DateFunctions(), true);
                SetValue("finance", new FinanceFunctions(), true);
                SetValue("commerce", new CommerceFunctions(), true);
                SetValue("hacker", new HackerFunctions(), true);
                SetValue("image", new ImageFunctions(), true);
                SetValue("internet", new InternetFunctions(), true);
                SetValue("lorem", new LoremFunctions(), true);
                SetValue("vehicle", new VehicleFunctions(), true);
                SetValue("system", new SystemFunctions(), true);
                SetValue("rant", new RantFunctions(), true);
            }
        }
    }
}
