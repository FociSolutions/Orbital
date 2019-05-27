FROM microsoft/dotnet:sdk AS build-env
WORKDIR /app

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_12.x |  bash -
RUN apt-get install -y nodejs

# Copy csproj and restore as distinct layers
COPY ./src .
RUN dotnet restore Orbital.Designer.Server/Orbital.Designer.Server.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish src/Orbital.Designer.Server/Orbital.Designer.Server.csproj -c Release -o /app/out/designer
RUN mv -f out/orbital-designer out/designer/orbital-designer

# Build runtime image
FROM microsoft/dotnet:sdk
WORKDIR /app
COPY --from=build-env /app/out/designer .
RUN chmod -R u+w /app

ARG port=3970
ENV ASPNETCORE_ENVIROMENT=Production
ENV ASPNETCORE_URLS="http://*:${port}"
EXPOSE ${port}

ENTRYPOINT ["dotnet", "Orbital.Designer.Server.dll"]