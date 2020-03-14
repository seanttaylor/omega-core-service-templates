FROM hashicorp/terraform:light

COPY ./ /

RUN terraform init /tf

CMD ["terraform"]