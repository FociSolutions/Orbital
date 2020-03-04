using System.Threading;
using System.Threading.Tasks;

namespace Orbital.Mock.Server.Pipelines.Policies
{
    public static class DelayPolicy
    {
        /**
         * Delays the request by the specified amount of milliseconds
         */
        public static bool Execute(int milliseconds)
        {
            Thread.Sleep(milliseconds);
            return true;
        }
    }
}
