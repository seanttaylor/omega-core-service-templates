FROM softinstigate/restheart:5.1.1

COPY ./custom.properties etc/

MAINTAINER @omegalabs

ENTRYPOINT [ "java", "-Dfile.encoding=UTF-8", "-server", "-jar", "restheart.jar", "etc/restheart.yml"]

CMD ["--envFile", "etc/custom.properties"]

EXPOSE 8009 8080 4443

