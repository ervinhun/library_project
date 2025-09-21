# 0. Adjust DOTNET_OS_VERSION as desired
ARG DOTNET_OS_VERSION="-alpine"
ARG DOTNET_SDK_VERSION=9.0

# 1. Build stage
FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_SDK_VERSION}${DOTNET_OS_VERSION} AS build

# 2. Set workdir and copy everything
WORKDIR /src
COPY . .

# 3. Restore dependencies (solution level)
RUN dotnet restore ./library_project.sln

# 4. Build & publish API project only
RUN dotnet publish ./Api/Api.csproj -c Release -o /app --no-self-contained

# 5. Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_SDK_VERSION}
WORKDIR /app
COPY --from=build /app .

# 6. Environment
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

# 7. Run Api
ENTRYPOINT ["dotnet", "Api.dll"]
