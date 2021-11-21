#! /bin/bash
set -e

CONTAINER=${1:-'postgres'}
DB=${2:-'covince'}

docker exec -it $CONTAINER pg_dump -U postgres $DB -C --section pre-data > 01-predata.sql
docker exec -it $CONTAINER pg_dump -U postgres $DB --section post-data > 03-postdata.sql
