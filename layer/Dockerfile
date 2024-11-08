# Download the official aws cli Docker image
# see https://hub.docker.com/r/amazon/aws-cli
FROM amazon/aws-cli:2.19.3

RUN mkdir -p /opt
WORKDIR /tmp

#
# tools
#

RUN yum update -y \
    && yum install -y zip unzip wget tar gzip

#
# organize for self-contained usage
#

RUN mv /usr/local/aws-cli /opt/awscli
RUN ln -s /opt/awscli/v2/2.*/bin/aws /opt/awscli

#
# cleanup
#

RUN cd /opt/awscli/v2/2.*/dist/awscli/examples \
    && ls | grep -v "global_options.rst" | xargs rm -rf

#
# Test that the CLI works
#

RUN /opt/awscli/aws help

#
# create the bundle
#

RUN cd /opt \
    && zip --symlinks -r ../layer.zip * \
    && echo "/layer.zip is ready" \
    && ls -alh /layer.zip;

WORKDIR /
ENTRYPOINT [ "/bin/bash" ]
