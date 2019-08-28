FROM microsoft/dotnet:sdk AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ./src .
RUN dotnet restore Orbital.Mock.Server/Orbital.Mock.Server.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish src/Orbital.Mock.Server/Orbital.Mock.Server.csproj -c Release -o /app/out

# Build runtime image
FROM microsoft/dotnet:sdk
WORKDIR /app
COPY --from=build-env /app/out .
RUN chmod -R u+w /app

ENV ASPNETCORE_ENVIROMENT=Production
ENV ASPNETCORE_URLS="https://*:3971;http://*:3970"

EXPOSE 3970
EXPOSE 3971

ENTRYPOINT ["dotnet", "Orbital.Mock.Server.dll"]