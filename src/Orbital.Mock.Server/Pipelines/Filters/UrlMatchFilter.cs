using Orbital.Mock.Server.Factories.Interfaces;
using Orbital.Mock.Server.Pipelines.Filters.Bases;
using Orbital.Mock.Server.Pipelines.Ports.Interfaces;
using Orbital.Mock.Server.Pipelines.RuleMatchers.Interfaces;

namespace Orbital.Mock.Server.Pipelines.Filters
{
    public class UrlMatchFilter<T> : FaultableBaseFilter<T>
        where T : IFaultablePort, IURLMatchPort, IScenariosPort, IPathValidationPort
    {
        private IAssertFactory assertFactory;
        private IRuleMatcher ruleMatcher;

        public UrlMatchFilter(IAssertFactory assertFactory, IRuleMatcher ruleMatcher)
        {
            this.assertFactory = assertFactory;
            this.ruleMatcher = ruleMatcher;
        }

        public override T Process(T port)
        {
            throw new System.NotImplementedException();
        }
    }
}
