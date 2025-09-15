using System.ComponentModel.DataAnnotations;

namespace dataaccess;

public class NotInFutureAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value == null) 
            return true;

        if (value is DateTime dateTime)
        {
            return dateTime <= DateTime.Now;
        }

        return false;
    }
}