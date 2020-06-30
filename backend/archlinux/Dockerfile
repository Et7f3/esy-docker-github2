FROM archlinux:latest

RUN pacman -Syu --noconfirm
RUN pacman -S --noconfirm base base-devel git npm perl
#perl for shasum binary

ENV PATH=$PATH:/usr/bin/core_perl

# workaround hack while ocaml-secondary-compiler@4.08.1 work well with gcc 10
RUN mv /usr/bin/gcc /usr/bin/gcc-orig
RUN echo -en '#!/usr/bin/sh\n/usr/bin/gcc-orig -fcommon "$@"' > /usr/bin/gcc
RUN chmod u+x /usr/bin/gcc

RUN npm install --verbose --global --unsafe-perm=true esy@0.6.6


COPY . /project
WORKDIR /project



RUN esy install
RUN node .github/workflows/gha.js restore
RUN node .github/workflows/gha.js build
RUN node .github/workflows/gha.js save