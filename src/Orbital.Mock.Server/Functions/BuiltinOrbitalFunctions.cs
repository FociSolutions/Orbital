using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class BuiltinOrbitalFunctions : ScriptObject
    {
        /// <summary>
        /// This object is readonly, should not be modified by any other objects internally.
        /// </summary>
        internal static readonly ScriptObject Default = new DefaultBuiltins();

        public BuiltinOrbitalFunctions() : base(5)
        {
            ((ScriptObject)Default.Clone(true)).CopyTo(this);
        }

        /// <summary>
        /// Use an internal object to create all default builtins just once to avoid allocations of delegates/IScriptCustomFunction
        /// </summary>
        private class DefaultBuiltins : ScriptObject
        {
            public DefaultBuiltins() : base(5, false)
            {
                SetValue("name", new NameFunctions(), true);
                SetValue("address", new AddressFunctions(), true);
                SetValue("database", new DatabaseFunctions(), true);
                SetValue("finance", new FinanceFunctions(), true);
                SetValue("commerce", new CommerceFunctions(), true);
            }
        }
    }
}
