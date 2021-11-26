ARG COVINCE_BACKEND_TAG=latest
ARG TSV_FILE=input.csv

FROM ghcr.io/richardgoater/covince-backend:${COVINCE_BACKEND_TAG} as data

COPY generate-data-sql.js .
COPY ${TSV_FILE} .

RUN node generate-data-sql.js ${TSV_FILE}

FROM postgres:14-alpine

COPY *.sql /docker-entrypoint-initdb.d/

COPY --from=data /home/node/02-data.sql /docker-entrypoint-initdb.d/
