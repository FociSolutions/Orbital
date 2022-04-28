FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ./src .
RUN dotnet restore Orbital.Mock.Server/Orbital.Mock.Server.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish src/Orbital.Mock.Server/Orbital.Mock.Server.csproj -c Release -o /app/out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build-env /app/out .
RUN chmod -R u+w /app

ENV ASPNETCORE_ENVIROMENT=Production
ENV LD_LIBRARY_PATH=/app/runtimes/debian.9-x64/native/

ENTRYPOINT ["dotnet", "Orbital.Mock.Server.dll"]
