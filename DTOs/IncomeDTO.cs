namespace WalletView.DTOs;

public class IncomeDTO
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
}