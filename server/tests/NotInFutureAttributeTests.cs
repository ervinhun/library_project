using dataaccess;

namespace tests
{
    public class NotInFutureAttributeTests
    {
        [Fact]
        public void IsValid_ShouldReturnTrue_WhenDateIsPast()
        {
            // Arrange
            var attribute = new NotInFutureAttribute();
            var pastDate = DateTime.Now.AddDays(-1);

            // Act
            var result = attribute.IsValid(pastDate);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsValid_ShouldReturnTrue_WhenDateIsNow()
        {
            // Arrange
            var attribute = new NotInFutureAttribute();
            var nowDate = DateTime.Now;

            // Act
            var result = attribute.IsValid(nowDate);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsValid_ShouldReturnFalse_WhenDateIsFuture()
        {
            // Arrange
            var attribute = new NotInFutureAttribute();
            var futureDate = DateTime.Now.AddDays(1);

            // Act
            var result = attribute.IsValid(futureDate);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsValid_ShouldReturnTrue_WhenValueIsNull()
        {
            // Arrange
            var attribute = new NotInFutureAttribute();

            // Act
            var result = attribute.IsValid(null);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsValid_ShouldReturnFalse_WhenValueIsNotADateTime()
        {
            // Arrange
            var attribute = new NotInFutureAttribute();
            var notADate = "not a date";

            // Act
            var result = attribute.IsValid(notADate);

            // Assert
            Assert.False(result);
        }
    }
}
