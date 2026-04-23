using System;

namespace DIO.Bank
{
    public class Account
    {
        public AccountType AccountType { get; private set; }
        public decimal Balance { get; private set; }
        public decimal Credit { get; private set; }
        public string Name { get; private set; }

        public Account(AccountType accountType, decimal balance, decimal credit, string name)
        {
            AccountType = accountType;
            Balance = balance;
            Credit = credit;
            Name = name;
        }

        public bool Withdraw(decimal amount)
        {
            if (Balance - amount < -Credit)
            {
                Console.WriteLine("Insufficient funds!");
                return false;
            }
            Balance -= amount;
            Console.WriteLine($"Current account balance of {Name} is {Balance}");
            return true;
        }

        public void Deposit(decimal amount)
        {
            Balance += amount;
            Console.WriteLine($"Current account balance of {Name} is {Balance}");
        }

        public bool Transfer(decimal amount, Account destination)
        {
            if (!Withdraw(amount)) return false;
            destination.Deposit(amount);
            return true;
        }

        public override string ToString()
        {
            return $"AccountType: {AccountType} | Name: {Name} | Balance: {Balance} | Credit: {Credit}";
        }
    }
}
