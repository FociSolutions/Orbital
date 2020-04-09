using Bogus;
using Scriban.Runtime;

namespace Orbital.Mock.Server.Functions
{
    public class FinanceFunctions : ScriptObject
    {
        public static Faker faker;
        public FinanceFunctions()
        {
            faker = new Faker();
        }
        
        /// <summary>
        /// Gets a random account
        /// </summary>
        public static string Account()
        {
            return faker.Finance.Account();
        }

        /// <summary>
        /// Gets a random account name
        /// </summary>
        public static string AccountName()
        {
            return faker.Finance.AccountName();
        }

        /// <summary>
        /// Gets a random amount
        /// </summary>
        public static decimal Amount()
        {
            return faker.Finance.Amount();
        }

        /// <summary>
        /// Gets a random transaction type
        /// </summary>
        public static string TransactionType()
        {
            return faker.Finance.TransactionType();
        }

        /// <summary>
        /// Gets a random currency
        /// </summary>
        public static string Currency()
        {
            return faker.Finance.Currency().Description;
        }

        /// <summary>
        /// Gets a random credit card number
        /// </summary>
        public static string CreditCardNumber()
        {
            return faker.Finance.CreditCardNumber();
        }

        /// <summary>
        /// Gets a random credit card cvv
        /// </summary>
        public static string CreditCardCvv()
        {
            return faker.Finance.CreditCardCvv();
        }

        /// <summary>
        /// Gets a random bitcoin address
        /// </summary>
        public static string BitcoinAddress()
        {
            return faker.Finance.BitcoinAddress();
        }

        /// <summary>
        /// Gets a random ethereum address
        /// </summary>
        public static string EthereumAddress()
        {
            return faker.Finance.EthereumAddress();
        }

        /// <summary>
        /// Gets a random routing number
        /// </summary>
        public static string RoutingNumber()
        {
            return faker.Finance.RoutingNumber();
        }

        /// <summary>
        /// Gets a random bic
        /// </summary>
        public static string Bic()
        {
            return faker.Finance.Bic();
        }

        /// <summary>
        /// Gets a random iban
        /// </summary>
        public static string Iban()
        {
            return faker.Finance.Iban();
        }
    }
}