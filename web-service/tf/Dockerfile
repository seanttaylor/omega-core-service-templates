FROM hashicorp/terraform:light

COPY ./tf /tf

RUN terraform init /tf

CMD ["terraform"]