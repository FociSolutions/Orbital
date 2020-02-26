using System.Threading;

namespace Orbital.Mock.Server.Pipelines.Policies
{
    public static class DelayPolicy
    {
        public static bool Execute(int seconds)
        {
            int milliseconds = seconds * 1000;
            Thread.Sleep(milliseconds);
            return true;
        }
    }
}
