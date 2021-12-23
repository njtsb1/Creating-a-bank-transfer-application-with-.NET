using System;

namespace DIO.Bank
{
	public class Account
	{
		// Attributes
		private AccountType AccountType { get; set; }
		private double Balance { get; set; }
		private double Credit { get; set; }
		private string Name { get; set; }

		// Methods
		public Account(AccountType AccountType, double balance, double credit, string name)
		{
			this.AccountType = AccountType;
			this.Balance = balance;
			this.Credit = credit;
			this.Name = name;
		}

		public bool ToWithdraw(double valuewithdrawal)
		{
            // Sufficient balance validation
            if (this.Balance - valuewithdrawal < (this.Credit *-1)){
                Console.WriteLine("Insufficient funds!");
                return false;
            }
            this.Balance -= valuewithdrawal;

            Console.WriteLine("Current account balance of {0} is {1}", this.Name, this.Balance);
            // https://docs.microsoft.com/pt-br/dotnet/standard/base-types/composite-formatting

            return true;
		}

		public void Deposit(double valuedeposit)
		{
			this.Balance += valuedeposit;

            Console.WriteLine("Current account balance of {0} is {1}", this.Name, this.Balance);
		}

		public void Transfer(double transfervalue, Account accountdestination)
		{
			if (this.towithdraw(transfervalue)){
                accountdestination.Deposit(transfervalue);
            }
		}

        public override string ToString()
		{
            string returns = "";
            returns += "Accounttype " + this.Accounttype + " | ";
            returns += "Name " + this.Name + " | ";
            returns += "Balance " + this.Balance + " | ";
            returns += "Credit " + this.Credit;
			return returns;
		}
	}
}