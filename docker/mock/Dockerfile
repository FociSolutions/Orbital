FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ./src .
RUN dotnet restore Orbital.Mock.Server/Orbital.Mock.Server.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish src/Orbital.Mock.Server/Orbital.Mock.Server.csproj -c Release -o /app/out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
WORKDIR /app
COPY --from=build-env /app/out .
RUN chmod -R u+w /app

ENV ASPNETCORE_ENVIROMENT=Production

ENTRYPOINT ["dotnet", "Orbital.Mock.Server.dll"]