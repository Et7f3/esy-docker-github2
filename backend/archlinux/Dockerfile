FROM archlinux:latest

ARG acu
ENV ACTIONS_CACHE_URL=$acu
ARG aru
ENV ACTIONS_RUNTIME_URL=$acu

ARG github_action
ENV GITHUB_ACTION=github_action
ARG github_actions
ENV GITHUB_ACTIONS=github_actions
ARG github_actor
ENV GITHUB_ACTOR=github_actor
ARG github_api_url
ENV GITHUB_API_URL=github_api_url
ARG github_base_ref
ENV GITHUB_BASE_REF=github_base_ref
ARG github_event_name
ENV GITHUB_EVENT_NAME=github_event_name
ARG github_event_path
ENV GITHUB_EVENT_PATH=github_event_path
ARG github_graphql_url
ENV GITHUB_GRAPHQL_URL=github_graphql_url
ARG github_head_ref
ENV GITHUB_HEAD_REF=github_head_ref
ARG github_job
ENV GITHUB_JOB=github_job
ARG github_ref
ENV GITHUB_REF=github_ref
ARG github_repository
ENV GITHUB_REPOSITORY=github_repository
ARG github_repository_owner
ENV GITHUB_REPOSITORY_OWNER=github_repository_owner
ARG github_run_id
ENV GITHUB_RUN_ID=github_run_id
ARG github_run_number
ENV GITHUB_RUN_NUMBER=github_run_number
ARG github_server_url
ENV GITHUB_SERVER_URL=github_server_url
ARG github_sha
ENV GITHUB_SHA=github_sha
ARG github_workflow
ENV GITHUB_WORKFLOW=github_workflow
ARG github_workspace
ENV GITHUB_WORKSPACE=github_workspace


RUN echo $GITHUB_ACTION $GITHUB_ACTIONS $GITHUB_ACTOR $GITHUB_API_URL $GITHUB_BASE_REF $GITHUB_EVENT_NAME $GITHUB_EVENT_PATH $GITHUB_GRAPHQL_URL $GITHUB_HEAD_REF $GITHUB_JOB $GITHUB_REF $GITHUB_REPOSITORY $GITHUB_REPOSITORY_OWNER $GITHUB_RUN_ID $GITHUB_RUN_NUMBER $GITHUB_SERVER_URL $GITHUB_SHA $GITHUB_WORKFLOW $GITHUB_WORKSPACE
RUN echo $ACTIONS_RUNTIME_URL $ACTIONS_CACHE_URL

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
RUN ls / /project
WORKDIR /project/backend
RUN pwd
RUN ls -la


RUN esy install
RUN node ../.github/workflows/gha.js restore
RUN node ../.github/workflows/gha.js build
RUN node ../.github/workflows/gha.js save
