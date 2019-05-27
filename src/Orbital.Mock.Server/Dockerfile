# Build runtime image
FROM microsoft/dotnet:2.2-aspnetcore-runtime
WORKDIR /app

# Copy dlls
COPY . .

RUN chmod -R u+w /app

ARG port=3971
ENV ASPNETCORE_ENVIROMENT=Production
ENV ASPNETCORE_URLS="http://*:${port}"
EXPOSE ${port}

ENTRYPOINT ["dotnet", "Orbital.Mock.Server.dll"]