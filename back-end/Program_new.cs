using System;
using System.Collections.Generic;
using System.Globalization;

namespace DIO.Bank
{
    class Program
    {
        static List<Account> listAccount = new List<Account>();

        static void Main(string[] args)
        {
            string userOption = GetOptionUser();

            while (userOption.ToUpper() != "X")
            {
                switch (userOption)
                {
                    case "1":
                        ListAccount();
                        break;
                    case "2":
                        InsertAccount();
                        break;
                    case "3":
                        Transfer();
                        break;
                    case "4":
                        Withdraw();
                        break;
                    case "5":
                        Deposit();
                        break;
                    case "C":
                        Console.Clear();
                        break;
                    default:
                        Console.WriteLine("Invalid option.");
                        break;
                }

                userOption = GetOptionUser();
            }

            Console.WriteLine("Thank you for using our services.");
            Console.ReadLine();
        }

        private static void Deposit()
        {
            Console.Write("Enter account number: ");
            if (!int.TryParse(Console.ReadLine(), out int indexAccount) || !ValidIndex(indexAccount))
            {
                Console.WriteLine("Invalid account index.");
                return;
            }

            Console.Write("Enter the amount to be deposited: ");
            if (!decimal.TryParse(Console.ReadLine(), NumberStyles.Number, CultureInfo.InvariantCulture, out decimal valueDeposit) || valueDeposit <= 0)
            {
                Console.WriteLine("Invalid amount.");
                return;
            }

            listAccount[indexAccount].Deposit(valueDeposit);
            Console.WriteLine("Deposit completed.");
        }

        private static void Withdraw()
        {
            Console.Write("Enter account number: ");
            if (!int.TryParse(Console.ReadLine(), out int indexAccount) || !ValidIndex(indexAccount))
            {
                Console.WriteLine("Invalid account index.");
                return;
            }

            Console.Write("Enter the amount to be withdrawn: ");
            if (!decimal.TryParse(Console.ReadLine(), NumberStyles.Number, CultureInfo.InvariantCulture, out decimal valueWithdrawal) || valueWithdrawal <= 0)
            {
                Console.WriteLine("Invalid amount.");
                return;
            }

            bool ok = listAccount[indexAccount].Withdraw(valueWithdrawal);
            if (ok) Console.WriteLine("Withdrawal completed.");
            else Console.WriteLine("Withdrawal failed: insufficient funds.");
        }

        private static void Transfer()
        {
            Console.Write("Enter source account number: ");
            if (!int.TryParse(Console.ReadLine(), out int indexAccountOrigin) || !ValidIndex(indexAccountOrigin))
            {
                Console.WriteLine("Invalid source account index.");
                return;
            }

            Console.Write("Enter destination account number: ");
            if (!int.TryParse(Console.ReadLine(), out int indexAccountDestination) || !ValidIndex(indexAccountDestination))
            {
                Console.WriteLine("Invalid destination account index.");
                return;
            }

            Console.Write("Enter the amount to be transferred: ");
            if (!decimal.TryParse(Console.ReadLine(), NumberStyles.Number, CultureInfo.InvariantCulture, out decimal valueTransfer) || valueTransfer <= 0)
            {
                Console.WriteLine("Invalid amount.");
                return;
            }

            var origin = listAccount[indexAccountOrigin];
            var dest = listAccount[indexAccountDestination];

            if (origin.Transfer(valueTransfer, dest))
            {
                Console.WriteLine("Transfer completed.");
            }
            else
            {
                Console.WriteLine("Transfer failed: insufficient funds.");
            }
        }

        private static void InsertAccount()
        {
            Console.WriteLine("Insert new account");

            Console.Write("Enter 1 for Physical Person or 2 for Legal Person: ");
            if (!int.TryParse(Console.ReadLine(), out int entryAccountType) || (entryAccountType != 1 && entryAccountType != 2))
            {
                Console.WriteLine("Invalid account type.");
                return;
            }

            Console.Write("Enter Customer Name: ");
            string inputName = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(inputName))
            {
                Console.WriteLine("Name is required.");
                return;
            }

            Console.Write("Enter opening balance: ");
            if (!decimal.TryParse(Console.ReadLine(), NumberStyles.Number, CultureInfo.InvariantCulture, out decimal entryBalance))
            {
                Console.WriteLine("Invalid balance.");
                return;
            }

            Console.Write("Enter credit: ");
            if (!decimal.TryParse(Console.ReadLine(), NumberStyles.Number, CultureInfo.InvariantCulture, out decimal entryCredit))
            {
                Console.WriteLine("Invalid credit.");
                return;
            }

            var newAccount = new Account((AccountType)entryAccountType, entryBalance, entryCredit, inputName);
            listAccount.Add(newAccount);

            Console.WriteLine("Account created successfully.");
        }

        private static void ListAccount()
        {
            Console.WriteLine("List Account");

            if (listAccount.Count == 0)
            {
                Console.WriteLine("No account registered.");
                return;
            }

            for (int i = 0; i < listAccount.Count; i++)
            {
                Account acc = listAccount[i];
                Console.Write("#{0} - ", i);
                Console.WriteLine(acc);
            }
        }

        private static string GetOptionUser()
        {
            Console.WriteLine();
            Console.WriteLine("DIO Bank at your disposal!!!");
            Console.WriteLine("Enter the desired option:");

            Console.WriteLine("1- List accounts");
            Console.WriteLine("2- Insert new account");
            Console.WriteLine("3- Transfer");
            Console.WriteLine("4- Withdraw");
            Console.WriteLine("5- Deposit");
            Console.WriteLine("C- Clear screen");
            Console.WriteLine("X- To go out");
            Console.WriteLine();

            string userOption = Console.ReadLine().ToUpper();
            Console.WriteLine();
            return userOption;
        }

        private static bool ValidIndex(int i)
        {
            return i >= 0 && i < listAccount.Count;
        }
    }
}
