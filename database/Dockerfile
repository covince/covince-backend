ARG COVINCE_BACKEND_TAG=latest
ARG CSV_FILE=input.csv

FROM ghcr.io/covince/covince-backend:${COVINCE_BACKEND_TAG} as data
ARG TSV_FILE

COPY generate-data-sql.js .
COPY ${CSV_FILE} .

RUN node generate-data-sql.js ${CSV_FILE}

FROM postgres:14-alpine

COPY *.sql /docker-entrypoint-initdb.d/

COPY --from=data /home/node/02-data.sql /docker-entrypoint-initdb.d/
