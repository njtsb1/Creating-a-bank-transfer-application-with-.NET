using System;
using System.Collections.Generic;

namespace DIO.Bank
{
	class Program
	{
		static List<Account> listAccount = new List<Account>();
		static void Main(string[] args)
		{
			string 	Useroption = GetOptionUser();

			while (Useroption.ToUpper() != "X")
			{
				switch (Useroption)
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
						Towithdraw();
						break;
					case "5":
						Deposit();
						break;
                    case "C":
						Console.Clear();
						break;

					default:
						throw new ArgumentOutOfRangeException();
				}

				Useroption = GetOptionUser();
			}
			
			Console.WriteLine("Thank you for using our services.");
			Console.ReadLine();
		}

		private static void Deposit()
		{
			Console.Write("Enter account number: ");
			int indexAccount = int.Parse(Console.ReadLine());

			Console.Write("Enter the amount to be deposited: ");
			double valuedeposit = double.Parse(Console.ReadLine());

            listAccount[indexAccount].Deposit(valuedeposit);
		}

		private static void Towithdraw()
		{
			Console.Write("Enter account number: ");
			int indexAccount = int.Parse(Console.ReadLine());

			Console.Write("Enter the amount to be withdrawn: ");
			double valuewithdrawal = double.Parse(Console.ReadLine());

            llistAccount[indexAccount].Towithdraw(valuewithdrawal);
		}

		private static void Transfer()
		{
			Console.Write("Enter source account number: ");
			int indexAccountOrigin = int.Parse(Console.ReadLine());

            Console.Write("Enter destination account number: ");
			int indexaccountdestination = int.Parse(Console.ReadLine());

			Console.Write("Enter the amount to be transferred: ");
			double Valortransfer = double.Parse(Console.ReadLine());

            listAccount[indexAccountOrigin].Transfer(valorTransfer, listAccount[indexaccountdestination]);
		}

		private static void InsertAccount()
		{
			Console.WriteLine("Insert new account");

			Console.Write("Enter 1 for Physical Account or 2 for Legal: ");
			int entryAccountType = int.Parse(Console.ReadLine());

			Console.Write("Enter Customer Name: ");
			string inputname = Console.ReadLine();

			Console.Write("Enter opening balance: ");
			double entryBalance = double.Parse(Console.ReadLine());

			Console.Write("Enter credit: ");
			double entrycredit = double.Parse(Console.ReadLine());

			Account newaccount = new Account(AccountType: (AccountType)entryAccountType,
										Balance: entryBalance,
										credit: entrycredi,
										name: inputname);

			listAccount.Add(newaccount);
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
				Account Account = listAccount[i];
				Console.Write("#{0} - ", i);
				Console.WriteLine(Account);
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
			Console.WriteLine("4- To withdraw");
			Console.WriteLine("5- Deposit");
            Console.WriteLine("C- Clear screen");
			Console.WriteLine("X- To go out");
			Console.WriteLine();

			string Useroption = Console.ReadLine().ToUpper();
			Console.WriteLine();
			return Useroption;
		}
	}
}
