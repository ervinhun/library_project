# Adjust DOTNET_OS_VERSION as desired
ARG DOTNET_OS_VERSION="-alpine"
ARG DOTNET_SDK_VERSION=9.0

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_SDK_VERSION}${DOTNET_OS_VERSION} AS build
WORKDIR /src

# Copy only server/Api and server/DataAccess for efficient caching
COPY server/ ./server/
COPY library_project.sln ./

# Restore dependencies for the solution
RUN dotnet restore MySolution.sln

# Build and publish only the Api project
RUN dotnet publish server/Api/Api.csproj -c Release -o /app

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_SDK_VERSION}
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
WORKDIR /app
COPY --from=build /app .

ENTRYPOINT ["dotnet", "Api.dll"]

